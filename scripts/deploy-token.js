const hre = require("hardhat");
const deployUtils = require("./deploy.utils");

const DEFAULT_CONFIG = {
  USDT: "",
};

async function main() {
  let envName = await deployUtils.promptChoices("Choose environment", [
    "local",
    "dev",
    "prod",
  ]);
  let networkName = hre.network.name;
  let suffixConfig = `token-${envName}`;
  let deployConfig = deployUtils.loadConfig(
    networkName,
    DEFAULT_CONFIG,
    suffixConfig
  );

  const holder = "0xf9209B6F49BB9fD73422BA834f4cD444aE7ceacE";
  const totalMint = 100000;

  const deployUSDT = await deployUtils.deployContractIfNotExist(
    "MockERC20",
    deployConfig.USDT,
    ["USDT", "USDT"]
  );
  deployConfig.USDT = deployUSDT.address;

  const contract = await hre.ethers.getContractAt(
    "MockERC20",
    deployConfig.USDT
  );
  const tx = await contract.mint(
    holder,
    hre.ethers.utils.parseEther(`${totalMint}`).toString()
  );
  await tx.wait();

  // Write config
  deployUtils.writeConfig(networkName, deployConfig, suffixConfig);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
