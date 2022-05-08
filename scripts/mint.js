/* eslint no-use-before-define: "warn" */
require("dotenv").config();

const { ethers } = require("hardhat");
const ipfsAPI = require("ipfs-http-client");
const ipfs = ipfsAPI({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});

const main = async () => {
  const deployer = "0x343eCF760a020936eEE8D655b43C5cBD40769A05";
  const toAddress = "0x343eCF760a020936eEE8D655b43C5cBD40769A05";

  console.log("\n\n 🎫 Minting to " + toAddress + "...\n");

  const nft = await ethers.getContract("DodoNFT", deployer);

  const buffalo = {
    name: "Buffalo",
    description: "It's actually a bison?",
    image: "https://austingriffith.com/images/paintings/buffalo.jpg",
  };

  console.log("Uploading buffalo...");
  const uploaded = await ipfs.add(JSON.stringify(buffalo));

  console.log("Minting buffalo with IPFS hash (" + uploaded.path + ")");
  await nft.mintItem(toAddress, uploaded.path, {
    gasLimit: 10000000,
  });
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
