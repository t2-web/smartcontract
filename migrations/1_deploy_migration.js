var UniqueNFT = artifacts.require("UniqueNFT");
var MultiNFT = artifacts.require("MultiNFT");

var BASE_URI = process.env.BASE_URI || "https://t2web.mypinata.cloud/ipfs/";

module.exports = function (deployer) {
  console.log("Deploying UniqueNFT...");
  deployer.deploy(UniqueNFT, "T2WEB NFT", "T2WEB", BASE_URI);

  console.log("Deploying MultiNFT...");
  deployer.deploy(MultiNFT, BASE_URI, "");
};
