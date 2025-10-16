
const sdk = require("microsoft-cognitiveservices-speech-sdk");

// Correct Azure Functions signature
module.exports = async function (context, req) {
    const textToSpeak = (req.body && req.body.text);

    if (!textToSpeak) {
        context.res = {
            status: 400,
            body: "Bad Request: Please pass a \"text\" property in the body."
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

    // Use a Promise to handle the async SDK logic
    const synthesizeSpeech = () => new Promise((resolve, reject) => {
        const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
        speechConfig.speechSynthesisVoiceName = "es-ES-ElviraNeural";
        speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

        const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);

        synthesizer.speakTextAsync(
            textToSpeak,
            result => {
                synthesizer.close();
                if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                    resolve(Buffer.from(result.audioData));
                } else {
                    console.error("Speech synthesis canceled: " + result.errorDetails);
                    reject("Speech synthesis failed");
                }
            },
            error => {
                console.error("Error during speech synthesis: " + error);
                synthesizer.close();
                reject("Speech synthesis error");
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
            body: audioBuffer
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: error
        };
    }
};
