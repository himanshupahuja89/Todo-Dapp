const {Web3}= require("web3");
const ABI = require("../ABI.json");
const web3 = new Web3("https://api.avax-test.network/ext/bc/C/rpc")
const contractAddress = "0x428B7512281fC053B8ab39631b5C0023b441AC86";
const contract = new web3.eth.Contract(ABI,contractAddress);

module.exports={contract} 