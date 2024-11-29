var T2WebNFT = artifacts.require("T2WebNFT");
var T2WebMultiNFT = artifacts.require("T2WebMultiNFT");
var T2WebERC4907NFT = artifacts.require("T2WebERC4907NFT");

var BASE_URI = process.env.BASE_URI || "https://t2web.mypinata.cloud/ipfs/";

module.exports = function (deployer) {
  // console.log("Deploying T2WebNFT...");
  // deployer.deploy(T2WebNFT, "T2WEB NFT", "T2WEB", BASE_URI);

  // console.log("Deploying T2WebMultiNFT...");
  // deployer.deploy(T2WebMultiNFT, BASE_URI, "");

  console.log("Deploying T2WebERC4907NFT...");
  // deployer.deploy(T2WebERC4907NFT, "T2WEB NFT", "T2WEB", BASE_URI);
};
