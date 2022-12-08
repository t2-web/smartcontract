const hre = require("hardhat");
const deployUtils = require("./deploy.utils");

const DEFAULT_CONFIG = {
  Disperse: "",
  ERC721: "",
  ERC1125: "",
  ERC4907: "",
};

async function main() {
  let envName = await deployUtils.promptChoices("Choose environment", [
    "local",
    "dev",
    "prod",
  ]);
  let networkName = hre.network.name;
  let suffixConfig = `nft-${envName}`;
  let deployConfig = deployUtils.loadConfig(
    networkName,
    DEFAULT_CONFIG,
    suffixConfig
  );

  const BASE_URI = process.env.BASE_URI;

  const deployERC721 = await deployUtils.deployContractIfNotExist(
    "T2WebNFT",
    deployConfig.ERC721,
    ["T2WEB NFT", "T2WEB", BASE_URI]
  );
  deployConfig.ERC721 = deployERC721.address;

  const deployERC1125 = await deployUtils.deployContractIfNotExist(
    "T2WebMultiNFT",
    deployConfig.ERC1125,
    [BASE_URI, ""]
  );
  deployConfig.ERC1125 = deployERC1125.address;

  const deployERC4907 = await deployUtils.deployContractIfNotExist(
    "T2WebERC4907NFT",
    deployConfig.ERC4907,
    ["T2WEB NFT", "T2WEB", BASE_URI]
  );
  deployConfig.ERC4907 = deployERC4907.address;

  const deployDisperse = await deployUtils.deployContractIfNotExist(
    "Disperse",
    deployConfig.Disperse
  );
  deployConfig.Disperse = deployDisperse.address;

  // Write config
  deployUtils.writeConfig(networkName, deployConfig, suffixConfig);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
