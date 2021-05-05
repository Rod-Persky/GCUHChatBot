import { getSTTTokenOrRefresh, getChatTokenOrRefresh } from "./token_util";
import React, { Component } from 'react';
import RasaClient from "./rasa-api";
import SpeechClient from "./speech-api";
import { Container } from 'reactstrap';
import './custom.css'
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';


const speechsdk = require('microsoft-cognitiveservices-speech-sdk');

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayText: "INITIALIZED: ready to test speech...",
    };
  }

  async componentDidMount() { 
    await this.setupTTS();
    await this.setupSTT();
    await this.setupRasaConnection();
  }

  async setupTTS() {
    this.tts_token = await getSTTTokenOrRefresh();
  }

  async setupSTT() {
    this.stt_token = await getSTTTokenOrRefresh();
  }

  async setupRasaConnection() {
    this.rasaClient = new RasaClient("http://localhost:5005");
  }

  async setupSpeechConnection() {
    this.speechClient = new SpeechClient("http://localhost:3005");
  }

  async requestAnswerRasa(text) {
    let reply_chat_messages = await this.rasaClient.parse(text);
    if (reply_chat_messages.length === 0) {
      throw "Don't know how to handle";
    }

    console.log(reply_chat_messages);
    return reply_chat_messages[0].text;
  }

  async sendSpeechRequest(text) {

  }

  async sttFromMic() {
    const tokenObj = this.stt_token;
    const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(
      tokenObj.authToken,
      tokenObj.region
    );
    speechConfig.speechRecognitionLanguage = "en-US";

    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new speechsdk.SpeechRecognizer(
      speechConfig,
      audioConfig
    );

    this.setState({
      displayText: "speak into your microphone...",
    });


    recognizer.recognizeOnceAsync((result) => {
      let displayText;
      if (result.reason === ResultReason.RecognizedSpeech) {
        this.requestAnswerRasa(result.text).then(answer => {
          // var answer_compiled = "";
          // for (let msg_idx = 0; msg_idx < answer.length; msg_idx++) {
          //   answer_compiled = `${answer_compiled}\nBot: ${answer[msg_idx]}`
          // }
          this.setState({
            displayText: `Me: ${result.text}\nBot: ${answer}`,
          });
          this.sendSpeechRequest(answer);
        });

        displayText = `RECOGNIZED: Text=${result.text}`;

      } else {
        displayText =
          "ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.";
      }

      this.setState({
        displayText: displayText,
      });
    });
  }

  async SendSpeech(displayText) {
    let reply_speech_messages = await this.speechClient(displayText);
    if (reply_speech_messages.length === 0) {
      throw "No data for audio file";
    }};

  render() {
    return (
      <Container className="app-container">
        <h1 className="display-4 mb-3">Speech sample app</h1>

        <div className="row main-container">
          <div className="col-6">
            <i
              className="fas fa-microphone fa-lg mr-2"
              onClick={() => this.sttFromMic()}
            ></i>
            Convert speech to text from your mic.
          </div>
          <div className="col-6 output-display rounded">
            <code>{this.state.displayText}</code>
          </div>
        </div>
      </Container>
    );
  }
}
