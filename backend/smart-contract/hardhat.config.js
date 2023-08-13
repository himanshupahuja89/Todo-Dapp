/** @type import('hardhat/config').HardhatUserConfig */
// require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();


module.exports = {
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113, // Fuji C-Chain chain ID
      accounts: [process.env.PRIVATE_KEY]
    },
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
