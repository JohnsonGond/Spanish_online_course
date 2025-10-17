
const https = require('https');

module.exports = async function (context, req) {
    const textToSpeak = req.body?.text;
    const speechRate = req.body?.rate;

    if (!textToSpeak) {
        context.res = { status: 400, body: "Bad Request: Please pass a 'text' property in the body." };
        return;
    }

    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
        context.res = { status: 500, body: "Server Configuration Error: Missing Azure credentials." };
        return;
    }

    // Conditionally wrap with prosody tag if rate is provided
    const textContent = speechRate
        ? `<prosody rate="${speechRate}">${textToSpeak}</prosody>`
        : textToSpeak;

    // SSML (Speech Synthesis Markup Language) body for the request
    const ssml = `
        <speak version='1.0' xml:lang='es-ES'>
            <voice xml:lang='es-ES' name='es-ES-ElviraNeural'>
                ${textContent}
            </voice>
        </speak>`;

    const options = {
        hostname: `${speechRegion}.tts.speech.microsoft.com`,
        path: '/cognitiveservices/v1',
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': speechKey,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
            'User-Agent': 'AzureFunction'
        }
    };

    // Use a Promise to handle the async HTTPS request
    const performRequest = () => new Promise((resolve, reject) => {
        const httpRequest = https.request(options, (res) => {
            const chunks = [];
            res.on('data', (chunk) => {
                chunks.push(chunk);
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    const audioBuffer = Buffer.concat(chunks);
                    resolve(audioBuffer);
                } else {
                    const errorBody = Buffer.concat(chunks).toString();
                    console.error(`Request failed with status ${res.statusCode}: ${errorBody}`);
                    reject(`Speech service request failed with status ${res.statusCode}`);
                }
            });
        });

        httpRequest.on('error', (error) => {
            console.error('HTTPS request error:', error);
            reject('Network error during speech synthesis request.');
        });

        httpRequest.write(ssml);
        httpRequest.end();
    });

    try {
        const audioBuffer = await performRequest();
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.length
            },
            isRaw: true,
            body: audioBuffer
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: error.toString()
        };
    }
};
