var UniqueNFT = artifacts.require("UniqueNFT");
var MultiNFT = artifacts.require("MultiNFT");

module.exports = function (deployer) {
  console.log("Deploying UniqueNFT...");
  deployer.deploy(UniqueNFT, "T2WEB NFT", "T2WEB", "ipfs://");

  console.log("Deploying MultiNFT...");
  deployer.deploy(MultiNFT, "ipfs://", "");
};
