var MultiDodoNFT = artifacts.require("MultiDodoNFT");

module.exports = function (deployer) {
  console.log("Deploying DodoNFT...");
  deployer.deploy(MultiDodoNFT, "ipfs://", "");
};
