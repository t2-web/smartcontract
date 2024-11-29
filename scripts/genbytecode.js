const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  console.log("== Deploy start");

  const isVerify = false;
  const Disperse_expectedAddress = "";

  // Verify
  if (isVerify) {
    // let bridgeContract = await hre.ethers.getContractAt(
    //   "Bridge",
    //   BridgeProxy_expectedAddress
    // );
    // let tx = await bridgeContract.getFeeReceiver();
    // console.log("getFeeReceiver:", tx);
    // const DEFAULT_ADMIN_ROLE = await bridgeContract.DEFAULT_ADMIN_ROLE();
    // const OPERATOR_ROLE = await bridgeContract.OPERATOR_ROLE();
    // tx = await bridgeContract.hasRole(OPERATOR_ROLE, admin);
    // console.log("hasRole OPERATOR_ROLE:", tx);
    // tx = await bridgeContract.hasRole(DEFAULT_ADMIN_ROLE, admin);
    // console.log("hasRole DEFAULT_ADMIN_ROLE:", tx);
    // return;
  }

  {
    // Disperse
    const factory = await ethers.getContractFactory("Disperse");
    const deplyTx = await factory.getDeployTransaction();
    console.log(`
Disperse: deplyment bytecode:

${deplyTx.data}
`);
  }

  console.log("== Deploy done");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
