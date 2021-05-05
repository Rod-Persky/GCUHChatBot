const sdk = require("microsoft-cognitiveservices-speech-sdk");
const SpeechKeyHelper = require("./speech-key-helper")

const filename = "YourAudioFile.wav";

function runSpeechSynthesis(synthesizer, text) {
  return new Promise((p_res, p_rej) => {
    synthesizer.speakTextAsync(
      text,
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

module.exports = async function(text) {
  // now create the audio-config pointing to our stream and
  // the speech config specifying the language.
  var audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
  var speech_token = await SpeechKeyHelper();
  var speechConfig = sdk.SpeechConfig.fromAuthorizationToken(
    speech_token.token,
    speech_token.region
  );

  // create the speech synthesizer.
  var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
  console.log(text)
  return runSpeechSynthesis(synthesizer, text);
}
