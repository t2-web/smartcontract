require("dotenv").config();

const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    eth: {
      provider: () =>
        new HDWalletProvider(process.env.PRIVATE_KEY, process.env.ETH_NODE_URL),
      network_id: "4",
      gasPrice: process.env.GAS_PRICE,
      skipDryRun: true,
    },
    bsc: {
      provider: () =>
        new HDWalletProvider(process.env.PRIVATE_KEY, process.env.BSC_NODE_URL),
      network_id: "97",
      gasPrice: 0,
      skipDryRun: true,
    },
    polygon: {
      provider: () =>
        new HDWalletProvider(
          process.env.PRIVATE_KEY,
          process.env.POLYGON_NODE_URL
        ),
      network_id: "80001",
      gasPrice: process.env.GAS_PRICE,
      skipDryRun: true,
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          process.env.PRIVATE_KEY,
          "https://rinkeby.infura.io/v3/99ed327c292e423e874eac228a240137"
        ),
      network_id: 4,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    shibuya: {
      provider: () =>
        new HDWalletProvider(
          process.env.PRIVATE_KEY,
          process.env.ASTAR_NODE_URL
        ),
      network_id: "81",
      gasPrice: process.env.GAS_PRICE,
      skipDryRun: true,
    },
  },

  mocha: {
    timeout: 100000,
  },

  compilers: {
    solc: {
      version: "0.8.10",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },

  db: {
    enabled: false,
  },
};
