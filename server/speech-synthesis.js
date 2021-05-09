const sdk = require("microsoft-cognitiveservices-speech-sdk");
const SpeechKeyHelper = require("./speech-key-helper");

const filename = "OutputAudioFile.wav";

function runSpeechSynthesis(synthesizer, ssml_input) {
  return new Promise((p_res, p_rej) => {
    synthesizer.speakSsmlAsync(
      ssml_input,
      function (result) {
        let p_action = p_res;
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

module.exports = async function (text) {
  // now create the audio-config pointing to our stream and
  // the speech config specifying the language.
  var audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
  
  var speech_token = await SpeechKeyHelper();
  var speechConfig = sdk.SpeechConfig.fromAuthorizationToken(
    speech_token.token,
    speech_token.region
  );

  speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio24Khz160KBitRateMonoMp3;

  // create the speech synthesizer.
  var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  // const voice = "en-AU-HayleyRUS";
  const ssml =
    `
    <speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US"><voice name="en-US-JennyNeural"><mstts:express-as style="chat"><prosody rate="-8%" pitch="0%">
    ${text}
    </prosody></mstts:express-as></voice></speak>
    `

  console.log(text);
  return runSpeechSynthesis(synthesizer, ssml);
};
