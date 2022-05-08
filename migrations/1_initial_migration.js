var DodoNFT = artifacts.require("DodoNFT");

module.exports = function (deployer) {
  console.log("Deploying DodoNFT...");
  deployer.deploy(DodoNFT);
};
