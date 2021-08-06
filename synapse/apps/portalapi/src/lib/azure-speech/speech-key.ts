import axios from 'axios';

export async function getSpeechToken() : Promise<{token: any; region: string;}> {
    const speechKey = process.env.SPEECH_KEY;
    const speechRegion = process.env.SPEECH_REGION;

    const headers = { 
        headers: {
            'Ocp-Apim-Subscription-Key': speechKey,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    try {
        const tokenResponse = await axios.post(
            `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
            null, headers);
        return { token: tokenResponse.data, region: speechRegion };
    } catch (err) {
        throw('There was an error authorizing your speech key.');
    }
    
}