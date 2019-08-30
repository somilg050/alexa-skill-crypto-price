/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

var repeatStatement;
const GetRemoteDataHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
      || (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetRemoteDataIntent');
  },
  async handle(handlerInput) {
    let outputSpeech = 'Welcome to Crypto Price! I can tell you the current price of Bitcoin and Ethereum. Which one would you like to know?';
    repeatStatement = outputSpeech;
    const request = handlerInput.requestEnvelope.request;
    var currency=0,crypto=0;
    if(handlerInput.requestEnvelope
      && handlerInput.requestEnvelope.request
      && handlerInput.requestEnvelope.request.intent
      && handlerInput.requestEnvelope.request.intent.slots
      && handlerInput.requestEnvelope.request.intent.slots.currency
      && handlerInput.requestEnvelope.request.intent.slots.currency.resolutions
      && handlerInput.requestEnvelope.request.intent.slots.currency.resolutions.resolutionsPerAuthority[0]
      && (handlerInput.requestEnvelope.request.intent.slots.currency.resolutions.resolutionsPerAuthority[0].status.code === "ER_SUCCESS_MATCH")){
        currency = request.intent.slots.currency.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    }
    if(handlerInput.requestEnvelope
      && handlerInput.requestEnvelope.request
      && handlerInput.requestEnvelope.request.intent
      && handlerInput.requestEnvelope.request.intent.slots
      && handlerInput.requestEnvelope.request.intent.slots.cryptoCurrency
      && handlerInput.requestEnvelope.request.intent.slots.cryptoCurrency.resolutions
      && handlerInput.requestEnvelope.request.intent.slots.cryptoCurrency.resolutions.resolutionsPerAuthority[0]
      && (handlerInput.requestEnvelope.request.intent.slots.cryptoCurrency.resolutions.resolutionsPerAuthority[0].status.code === "ER_SUCCESS_MATCH")){
        crypto = request.intent.slots.cryptoCurrency.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    }
    // if(request.intent.slots.currency.hasOwnProperty("resolutions")){
    //   currency = request.intent.slots.currency.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    // }
    // if(request.intent.slots.cryptoCurrency.hasOwnProperty("resolutions")){
    //   crypto = request.intent.slots.cryptoCurrency.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    // }
    await getRemoteData('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=USD,EUR&api_key=9d6d0ad237ed6e36e7b9f60ea1590244f25f201445320f188bdda2f8dd237121')
      .then((response) => {
        const data = JSON.parse(response);
        if(crypto==="BTC"){
          if(currency==="USD"){
            outputSpeech = `Current Bitcoin price is ${data.BTC.USD} dollar.`;
          }
          else if(currency==="EUR"){
            outputSpeech = `Current Bitcoin price is ${data.BTC.EUR} euro.`;
          }
          else{
            outputSpeech = `Current Bitcoin price is ${data.BTC.USD} dollar.`;
          }
          outputSpeech+= ` Do you need the price of another crypto? `;
          repeatStatement = outputSpeech;
        }
        if(crypto==='ETH'){
          if(currency==="USD"){
            outputSpeech = `Current Ethereum price is ${data.ETH.USD} dollar.`;
          }
          else if(currency==="EUR"){
            outputSpeech = `Current Ethereum price is ${data.ETH.EUR} euro.`;
          }
          else{
            outputSpeech = `Current Ethereum price is ${data.ETH.USD} dollar.`;
          }
          outputSpeech+= ` Do you need the price of another crypto? `;
          repeatStatement = outputSpeech;
        }
      })
      .catch((err) => {
        //set an optional error message here
        //outputSpeech = err.message;
      });

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt(`I can tell you the current price of Bitcoin and Ethereum. What can I help you with?`)
      .withShouldEndSession(false)
      .getResponse();

  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = `I can tell you the current price of Bitcoin and Ethereum. What can I help you with?`;
    repeatStatement = speechText;
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const YesHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.YesIntent';
  },
  handle(handlerInput) {
    var speechOutput = 'Great! Which crypto do you need the price of? Bitcoin or Ether?';
    repeatStatement = speechOutput;
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt("Which crypto do you need the price of? Bitcoin or Ether?")
      .withShouldEndSession(false)
      .getResponse();
  },
};

const NoHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.NoIntent';
  },
  handle(handlerInput) {
    var speechOutput = 'Goodbye and have a nice day';
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak(`Sorry, I didn't get that. Try asking about Bitcoin or Ethereum.`)
      .reprompt(`Sorry, I didn't get that. Try asking about Bitcoin or Ethereum.`)
      .getResponse();
  },
};

const RepeatHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.RepeatIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(repeatStatement)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const getRemoteData = function (url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? require('https') : require('http');
    const request = client.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Failed with status code: ' + response.statusCode));
      }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err) => reject(err))
  })
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetRemoteDataHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    RepeatHandler,
    YesHandler,
    NoHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

