//node tran.js  "bac10tyhju9pfpfkt7hrd2zqr0vjn4k5sfrrhenf7v" "bac1xd9mvz9hh3wljp2qwvakkxfnwumzq6tmutllc8"  "10000ubcv"

/**
 *
 *  node tran.js from to amount
 *
 *  node tran.js  "bac1anp8qzj4welr3ydqnfyhmnarxjwqk0vrhuca7n" "bac1hzpytmhedn302fgygsmxn67sq4lc90kcv5cvmn"  "0.001" "bac"
 *
 */
const bacchainjs = require("./bacchain-sdk-js/src/index");
const chainId = "bacchain-mainnet-1.0";
const lcdUrl = "http://52.69.196.169:1317";
const bacchainSdk = bacchainjs.newBacchainSdk(lcdUrl, chainId)
bacchainSdk.setBech32MainPrefix("bac")
const readline = require('readline-sync')


console.log(process.argv.length)
if (process.argv.length != 6){
    console.log("input error")
    return
}

var fromAddr = process.argv[2]
var toAddr = process.argv[3]
var amount = process.argv[4]
var coin = process.argv[5]
var amount = amount
if("bcv" == coin){
    amount = amount * 1000000
}
if("bac" == coin ){
    amount = amount * 1000000000
}


var mnemonic = readline.question('请输入助记词：\n')
const accAddr = bacchainSdk.getAddress(mnemonic);
const ecpairPriv = bacchainSdk.getECPairPriv(mnemonic);

if(accAddr != fromAddr){
    console.log("private key error")
    return
}

var main = async () => {
    var txhash = await sendTx()
    await  sleep(6000)
    var  txInfo = await bacchainSdk.getTxInfoByHash(txhash)
    console.log("交易hash:")
    console.log(txhash)

    console.log("交易详情:")
    console.log(txInfo)
}


async   function sendTx(){
    

    var data =  await  bacchainSdk.getAccounts(fromAddr)

    var txInfo = {
        type: "bacchain/MsgSend",
        from_address :fromAddr,
        to_address :toAddr,
        amountDenom: "nbac",
        amount: amount,
        feeDenom: "nbac",
        fee: 2000000,
        gas: 2000000,
        memo: "",
        account_number: data.value.account_number,
        sequence: data.value.sequence
    }

    var  stdSignMsg = bacchainSdk.NewStdMsg(txInfo);
    var signedTx = bacchainSdk.sign(stdSignMsg, ecpairPriv);
    var data =  await  bacchainSdk.broadcast(signedTx)
    var txHash = data['txhash']
    return txHash
}


var sleep = function(time) {
    var startTime = new Date().getTime() + parseInt(time, 10);
    while(new Date().getTime() < startTime) {}
};


main()