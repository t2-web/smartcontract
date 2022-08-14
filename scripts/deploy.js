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
  deployConfig.FEE_RECEIVER = "0xf27527E01508645d79D26324f72A516778838c26";

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

  // Upgrade logic
  if (deployT2WebProjectManager.isNewDeployed) {
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
