import axios from 'axios';
import sdk = require("microsoft-cognitiveservices-speech-sdk");

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

export async function synthSpeech(config : {token: any; region: string;}, text : string) {
  var audioConfig = sdk.AudioConfig.fromAudioFileOutput('testme.mp3');
  var speechConfig = sdk.SpeechConfig.fromAuthorizationToken(
    config.token,
    config.region
  );

  speechConfig.speechSynthesisLanguage = "en-AU";
  speechConfig.speechSynthesisVoiceName = "en-US-AmberNeural";
  speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio48Khz192KBitRateMonoMp3;

  var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  var ssml_text = `
    <speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US"><voice name="${speechConfig.speechSynthesisVoiceName}"><prosody rate="0%" pitch="0%">
      ${text}
    </prosody></voice></speak>
  `
  console.log(ssml_text)

  runSpeechSynthesis(synthesizer, ssml_text);
}

function runSpeechSynthesis(synthesizer : sdk.SpeechSynthesizer, text : string) {
    return new Promise<void>((p_res, p_rej) => {
      synthesizer.speakSsmlAsync(
        text,
        function (result) {
          let p_action = () => {p_res();};
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            console.log("synthesis finished.");
          } else {
            console.error(
              "Speech synthesis canceled, " +
                result.errorDetails +
                "\nDid you update the subscription info?"
            );
            p_action = p_rej;
          }
          synthesizer.close();
          synthesizer = undefined;
          return p_action();
        },
        function (err) {
          console.trace("err - " + err);
          synthesizer.close();
          synthesizer = undefined;
          return p_rej();
        }
      );
    });
  }