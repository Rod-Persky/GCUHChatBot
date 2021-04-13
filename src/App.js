import { getSTTTokenOrRefresh, getChatTokenOrRefresh } from './token_util';

import React from 'react';

import ReactWebChat, { createDirectLine } from 'botframework-webchat';

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      directLine: null,
      webSpeechPonyfill: null
    };
  }

  componentDidMount() {
    this.fetchToken();
    this.fetchSpeechPonyfill();
  }

  async fetchSpeechPonyfill() {
    const stt_token = await getSTTTokenOrRefresh()

    if (stt_token.authToken === null) {
      throw new Error("Failed to fetch authorization token and region.");
    }

    console.log(stt_token.authToken);

    this.setState({ webSpeechPonyfill: await window.WebChat.createCognitiveServicesSpeechServicesPonyfillFactory({
        credentials : {authorizationToken: stt_token.authToken, region: stt_token.region, textNormalization: 'lexical' }
    }) });
  }

  async fetchToken() {
    const token = await getChatTokenOrRefresh();

    this.setState(() => ({
      directLine: createDirectLine({ token : token.authToken.token })
    }));
  }

  render() {
    return (
      this.state.directLine && this.state.webSpeechPonyfill?
        <ReactWebChat
          className="chat"
          directLine={ this.state.directLine }
          webSpeechPonyfillFactory={ this.state.webSpeechPonyfill }
          { ...this.props }
        />
      :
        <div>Connecting to bot&hellip;</div>
    );
  }
}


