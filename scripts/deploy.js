const hre = require("hardhat");
const deployUtils = require('./deploy.utils');

const DEFAULT_CONFIG = {
  T2WebNFT:"",
  T2WebMultiNFT: "",
  T2WebERC4907NFT: "",
  Disperse: "",
  T2WebProjectManager: "",
  OPERATOR: "",
  SIGNER: ""
}

async function main() {
  let envName = await deployUtils.promptChoices("Choose environment", ["local", "dev", "prod"]);
  let networkName = hre.network.name;
  let suffixConfig = `${envName}`;
  let deployConfig = deployUtils.loadConfig(networkName, DEFAULT_CONFIG, suffixConfig);
  deployConfig.OPERATOR = "0xf9209B6F49BB9fD73422BA834f4cD444aE7ceacE";
  deployConfig.SIGNER = "0xf9209B6F49BB9fD73422BA834f4cD444aE7ceacE";

  // // ERC-721
  // const deployT2WebNFT = await deployUtils.deployContractIfNotExist("T2WebNFT", deployConfig.T2WebNFT);
  // deployConfig.T2WebNFT = deployT2WebNFT.address;

  // // ERC-1155
  // const deployT2WebMultiNFT = await deployUtils.deployContractIfNotExist("T2WebMultiNFT", deployConfig.T2WebMultiNFT);
  // deployConfig.T2WebMultiNFT = deployT2WebMultiNFT.address;

  // // ERC-4907
  // const deployT2WebERC4907NFT = await deployUtils.deployContractIfNotExist("T2WebERC4907NFT", deployConfig.T2WebERC4907NFT);
  // deployConfig.T2WebERC4907NFT = deploT2WebERC4907NFT.address;

  // // Disperse
  // const deployDisperse = await deployUtils.deployContractIfNotExist("Disperse", deployConfig.Disperse);
  // deployConfig.Disperse = deployDisperse.address;

  // T2WebProjectManager
  const deployT2WebProjectManager = await deployUtils.deployContractIfNotExist("T2WebProjectManager", deployConfig.T2WebProjectManager, [deployConfig.SIGNER]);
  deployConfig.T2WebProjectManager = deployT2WebProjectManager.address;

  // Write config
  deployUtils.writeConfig(networkName, deployConfig, suffixConfig);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
