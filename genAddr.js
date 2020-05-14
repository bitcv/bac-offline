/**
 *
 * node genAddr.js
 */

const bacchainjs = require("./bacchain-sdk-js/src/index");
const chainId = "bacchain-mainnet-1.0";
const lcdUrl = "http://127.0.0.1:1317";
const bacchainSdk = bacchainjs.newBacchainSdk(lcdUrl, chainId)
mnemonic = bacchainSdk.generateRandomMnemonic()
bacchainSdk.setBech32MainPrefix("bac")
addr = bacchainSdk.getAddress(mnemonic)
console.log('{"addr":"'+addr+'","private_key":"'+mnemonic+'"}')
