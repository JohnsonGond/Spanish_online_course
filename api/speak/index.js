
const sdk = require("microsoft-cognitiveservices-speech-sdk");

// Correct Azure Functions signature
module.exports = async function (context, req) {
    const textToSpeak = (req.body && req.body.text);

    if (!textToSpeak) {
        context.res = {
            status: 400,
            body: "Bad Request: Please pass a 'text' property in the body."
        };
        return;
    }

    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
        context.res = {
            status: 500,
            body: "Server Configuration Error: Missing Azure credentials."
        };
        return;
    }

    // Use a Promise to handle the async SDK logic with proper AudioConfig
    const synthesizeSpeech = () => new Promise((resolve, reject) => {
        const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
        speechConfig.speechSynthesisVoiceName = "es-ES-ElviraNeural";
        speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

        // Correct way to handle in-memory synthesis:
        const pushStream = sdk.AudioOutputStream.createPushStream();
        const audioConfig = sdk.AudioConfig.fromStreamOutput(pushStream);

        const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

        const audioData = [];
        pushStream.on('data', (data) => {
            audioData.push(data);
        });

        pushStream.on('close', () => {
            const finalBuffer = Buffer.concat(audioData);
            resolve(finalBuffer);
        });

        synthesizer.speakTextAsync(
            textToSpeak,
            result => {
                synthesizer.close();
                if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                    // Data is handled by the stream events.
                } else {
                    const errorDetails = `Speech synthesis canceled: ${result.errorDetails}`;
                    console.error(errorDetails);
                    reject(errorDetails);
                }
            },
            error => {
                const errorDetails = `Error during speech synthesis: ${error}`;
                console.error(errorDetails);
                synthesizer.close();
                reject(errorDetails);
            }
        );
    });

    try {
        const audioBuffer = await synthesizeSpeech();
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.length
            },
            isRaw: true, // Important for sending binary data
            body: audioBuffer
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: error.toString()
        };
    }
};
