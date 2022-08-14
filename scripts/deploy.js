const hre = require("hardhat");
const deployUtils = require("./deploy.utils");

const DEFAULT_CONFIG = {
  T2WebNFT: "",
  T2WebMultiNFT: "",
  T2WebERC4907NFT: "",
  Disperse: "",
  ProxyAdmin: "",
  T2WebProjectManagerLogic: "",
  T2WebProjectManagerProxy: "",
  OPERATOR: "",
  SIGNER: "",
  FEE_RECEIVER: "",
};

async function main() {
  let envName = await deployUtils.promptChoices("Choose environment", [
    "local",
    "dev",
    "prod",
  ]);
  let networkName = hre.network.name;
  let suffixConfig = `${envName}`;
  let deployConfig = deployUtils.loadConfig(
    networkName,
    DEFAULT_CONFIG,
    suffixConfig
  );

  deployConfig.OPERATOR = "0xf9209B6F49BB9fD73422BA834f4cD444aE7ceacE";
  deployConfig.SIGNER = "0xf9209B6F49BB9fD73422BA834f4cD444aE7ceacE";
  deployConfig.FEE_RECEIVER = "0xf27527E01508645d79D26324f72A516778838c26"; // key: 8c6e7f8d70554c3358af02ddeb99aad71244bd7cd3b9903fe483e3e3d0bcd69e

  // // ERC-721
  // const deployT2WebNFT = await deployUtils.deployContract("T2WebNFT");
  // deployConfig.T2WebNFT = deployT2WebNFT.address;

  // // ERC-1155
  // const deployT2WebMultiNFT = await deployUtils.deployContract("T2WebMultiNFT");
  // deployConfig.T2WebMultiNFT = deployT2WebMultiNFT.address;

  // // ERC-4907
  // const deployT2WebERC4907NFT = await deployUtils.deployContract("T2WebERC4907NFT");
  // deployConfig.T2WebERC4907NFT = deploT2WebERC4907NFT.address;

  // // Disperse
  // const deployDisperse = await deployUtils.deployContract("Disperse");
  // deployConfig.Disperse = deployDisperse.address;

  const deployProxyAdmin = await deployUtils.deployContractIfNotExist(
    "T2WebProxyAdmin",
    deployConfig.ProxyAdmin
  );
  deployConfig.ProxyAdmin = deployProxyAdmin.address;

  // T2WebProjectManager
  const deployT2WebProjectManager = await deployUtils.deployContractIfNotExist(
    "T2WebProjectManager",
    deployConfig.T2WebProjectManagerLogic,
    [deployConfig.FEE_RECEIVER, deployConfig.SIGNER]
  );
  deployConfig.T2WebProjectManagerLogic = deployT2WebProjectManager.address;

  const deployT2WebProjectManagerProxy =
    await deployUtils.deployContractIfNotExist(
      "T2WebProxy",
      deployConfig.T2WebProjectManagerProxy,
      [deployT2WebProjectManager.address, deployProxyAdmin.address, []]
    );
  deployConfig.T2WebProjectManagerProxy =
    deployT2WebProjectManagerProxy.address;
  console.log(
    "deployConfig.T2WebProjectManagerProxy :>> ",
    deployConfig.T2WebProjectManagerProxy
  );

  if (deployT2WebProjectManagerProxy.isNewDeployed) {
  } else if (deployT2WebProjectManager.isNewDeployed) {
    console.log("Upgrade logic", deployConfig);
    let proxyAdminContract = await hre.ethers.getContractAt(
      "T2WebProxyAdmin",
      deployConfig.ProxyAdmin
    );
    let tx = await proxyAdminContract.upgrade(
      deployConfig.T2WebProjectManagerProxy,
      deployConfig.T2WebProjectManagerLogic
    );
    await tx.wait();
  }

  // Write config
  deployUtils.writeConfig(networkName, deployConfig, suffixConfig);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
