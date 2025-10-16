
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const { Buffer } = require("buffer");

// This is the main handler for the serverless function.
module.exports = async (req, res) => {
    // 1. Check for POST request and correct body
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    if (!req.body || !req.body.text) {
        res.status(400).send('Bad Request: Missing "text" in body');
        return;
    }

    const textToSpeak = req.body.text;

    // 2. Read credentials from secure environment variables
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
        res.status(500).send('Server Configuration Error: Missing Azure credentials');
        return;
    }

    // 3. Configure the Speech SDK
    const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
    // Set the voice for Spanish (Spain)
    speechConfig.speechSynthesisVoiceName = "es-ES-ElviraNeural";
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

    // 4. Synthesize the speech
    // We use a null audio config to get the audio data in memory.
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);

    synthesizer.speakTextAsync(
        textToSpeak,
        result => {
            synthesizer.close();
            if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                // 5. Stream the audio data back to the client
                const audioBuffer = Buffer.from(result.audioData);
                res.setHeader('Content-Type', 'audio/mpeg');
                res.setHeader('Content-Length', audioBuffer.length);
                res.status(200).send(audioBuffer);
            } else {
                console.error("Speech synthesis canceled: " + result.errorDetails);
                res.status(500).send('Speech synthesis failed');
            }
        },
        error => {
            console.error("Error during speech synthesis: " + error);
            synthesizer.close();
            res.status(500).send('Speech synthesis error');
        }
    );
};
