import axios from 'axios';
import Cookie from 'universal-cookie';

export async function getSTTTokenOrRefresh() {
    const cookie = new Cookie();
    const speechToken = cookie.get('speech-token');

    if (speechToken === undefined) {
        try {
            const res = await axios.get('/api/get-speech-token');
            const token = res.data.token;
            const region = res.data.region;
            cookie.set('speech-token', region + ':' + token, {maxAge: 540, path: '/'});

            console.log('Token fetched from back-end: ' + token);
            return { authToken: token, region: region };
        } catch (err) {
            console.log(err.response.data);
            return { authToken: null, error: err.response.data };
        }
    } else {
        console.log('Token fetched from cookie: ' + speechToken);
        const idx = speechToken.indexOf(':');
        return { authToken: speechToken.slice(idx + 1), region: speechToken.slice(0, idx) };
    }
}


export async function getChatTokenOrRefresh() {
    const cookie = new Cookie();
    const chatToken = cookie.get('chat-token');

    if (chatToken === undefined) {
        try {
            const res = await axios.get('/api/get-chat-token');
            const token = res.data;
            cookie.set('chatToken', JSON.toString(token), {maxAge: 540, path: '/'});

            console.log('Token fetched from back-end: ' + token);
            return { authToken: token };
        } catch (err) {
            console.log(err.response.data);
            return { authToken: null, error: err.response.data };
        }
    } else {
        console.log('Token fetched from cookie: ' + chatToken);
        const token = JSON.parse(chatToken);
        return { authToken: token };
    }
}