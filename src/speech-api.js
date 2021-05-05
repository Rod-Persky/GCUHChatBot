"use strict";

const fetch = require("node-fetch");

class SpeechClient {
  constructor(endpoint, token) {
    this.endpoint = endpoint;
  }

  async _post(urlEndpoint, body) {
    const response = await fetch(`${this.endpoint}${urlEndpoint}`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(body), // body data type must match "Content-Type" header
    });

    return response.json(); // parses JSON response into native JavaScript objects
  }

  speaking(text) {
    return this._post('/api/start-speech-synthesis', {
      text: text,
    });
  }
}

module.exports = SpeechClient;
