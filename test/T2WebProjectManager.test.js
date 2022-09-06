const { expect } = require("chai");
const { ethers } = require("hardhat");
const abi = require("ethereumjs-abi");

function timestamp() {
  return Math.floor(Date.now() / 1000);
}

const signer = {
  address: "0x46F6cFf3BA26283C6Dd413EdeCFF9cbC8344eb73",
  privateKey:
    "0x4091a36cf30fafd08e51b9fef800f5d46de2ea11c647c6f31bdab11090cb2b8d",
};

const FEE_ADDRESS = "0x6f182549Ea9E594E5b91ca2A5fA271318Db7C15c";

async function getSignature(
  privateKey,
  {
    backendId,
    owner,
    presalePrice,
    presaleAmount,
    presaleMaxPurchase,
    publicsalePrice,
    publicsaleAmount,
    publicsaleMaxPurchase,
    fee,
  }
) {
  const values = [
    backendId,
    owner,
    presalePrice,
    presaleAmount,
    presaleMaxPurchase,
    publicsalePrice,
    publicsaleAmount,
    publicsaleMaxPurchase,
    fee,
  ];
  let hash =
    "0x" +
    abi
      .soliditySHA3(
        [
          "uint256",
          "address",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
        ],
        values
      )
      .toString("hex");
  const Web3 = require("web3");
  const web3 = new Web3();
  let account = web3.eth.accounts.privateKeyToAccount(privateKey);
  let signature = account.sign(hash);

  return {
    signature: signature.signature,
    address: account.address,
  };
}

describe("T2WebProjectManager", function () {
  let proxyAdmin,
    projectManager = null;

  beforeEach(async function () {
    const [operator] = await ethers.getSigners();

    const ProxyAdmin = await ethers.getContractFactory("T2WebProxyAdmin");
    proxyAdmin = await ProxyAdmin.deploy();

    const T2WebProjectManager = await ethers.getContractFactory(
      "T2WebProjectManager"
    );
    const T2WebProxy = await ethers.getContractFactory("T2WebProxy");
    const _logic = await T2WebProjectManager.deploy();
    const _proxy = await T2WebProxy.deploy(_logic.address, proxyAdmin.address);

    projectManager = await ethers.getContractAt(
      "T2WebProjectManager",
      _proxy.address
    );

    await projectManager.initialize(FEE_ADDRESS, signer.address);

    let operatorRole = await projectManager.OPERATOR_ROLE();
    await projectManager.grantRole(operatorRole, operator.address);
  });

  it("Should create project successfully", async function () {
    const [operator, project] = await ethers.getSigners();

    const backendId = 1;
    const ts = timestamp();
    const presalePrice = 0.001;
    const presaleAmount = 10;
    const presaleMaxPurchase = 2;
    const publicsalePrice = 0.002;
    const publicsaleAmount = 20;
    const publicsaleMaxPurchase = 5;
    const fee = 5 * 100;

    const saleData = [
      ts,
      ts + 3600 * 1,
      ethers.utils.parseEther(`${presalePrice}`).toString(),
      presaleAmount,
      presaleMaxPurchase,
      ts + 3600 * 2,
      ts + 3600 * 3,
      ethers.utils.parseEther(`${publicsalePrice}`).toString(),
      publicsaleAmount,
      publicsaleMaxPurchase,
      fee,
    ];
    const hasWhitelist = false;
    const canReveal = true;

    const sign = await getSignature(signer.privateKey, {
      backendId,
      owner: project.address.toLowerCase(),
      presalePrice: ethers.utils.parseEther(`${presalePrice}`).toString(),
      presaleAmount,
      presaleMaxPurchase,
      publicsalePrice: ethers.utils.parseEther(`${publicsalePrice}`).toString(),
      publicsaleAmount,
      publicsaleMaxPurchase,
      fee,
    });

    const tx = await projectManager
      .connect(project)
      .createERC721Project(
        backendId,
        "Test 1",
        "T2WEB",
        "ipfs://t2web",
        saleData,
        hasWhitelist,
        canReveal,
        sign.signature
      );

    let receipt = await tx.wait();
    let txLog = receipt.events[3];

    expect(txLog.args.projectId).to.equal("1");
  });

  it("Should buy presale successfully", async function () {
    const [operator, project, user1, user2] = await ethers.getSigners();

    const backendId = 1;
    const ts = timestamp();
    const presalePrice = 2;
    const presaleAmount = 10;
    const presaleMaxPurchase = 2;
    const publicsalePrice = 0.002;
    const publicsaleAmount = 20;
    const publicsaleMaxPurchase = 5;
    const fee = 0 * 100;

    const saleData = [
      ts,
      ts + 3600 * 1,
      ethers.utils.parseEther(`${presalePrice}`),
      presaleAmount,
      presaleMaxPurchase,
      ts + 3600 * 2,
      ts + 3600 * 3,
      ethers.utils.parseEther(`${publicsalePrice}`),
      publicsaleAmount,
      publicsaleMaxPurchase,
      fee,
    ];
    const hasWhitelist = false;
    const canReveal = true;

    const sign = await getSignature(signer.privateKey, {
      backendId,
      owner: project.address.toLowerCase(),
      presalePrice: ethers.utils.parseEther(`${presalePrice}`).toString(),
      presaleAmount,
      presaleMaxPurchase,
      publicsalePrice: ethers.utils.parseEther(`${publicsalePrice}`).toString(),
      publicsaleAmount,
      publicsaleMaxPurchase,
      fee,
    });

    const tx = await projectManager
      .connect(project)
      .createERC721Project(
        backendId,
        "Test 1",
        "T2WEB",
        "ipfs://t2web",
        saleData,
        hasWhitelist,
        canReveal,
        sign.signature
      );

    let receipt = await tx.wait();
    let txLog = receipt.events[3];
    const projectId = txLog.args.projectId;
    const contractAddress = txLog.args.contractAddress;
    expect(projectId).to.equal("1");

    const buyAmount = 1;
    const before = await ethers.provider.getBalance(project.address);
    console.log(`eth before:`, before);

    console.log(`contractAddress:${contractAddress}`);
    projectContract = await ethers.getContractAt(
      "T2WebERC721",
      contractAddress
    );

    expect(await projectContract.balanceOf(user1.address)).to.equal(`${0}`);

    await projectManager.connect(user1).buyPresale(projectId, buyAmount, 0, {
      value: ethers.utils.parseEther(`${presalePrice}`),
    });

    const after = await ethers.provider.getBalance(project.address);

    console.log(`eth after:`, after);

    expect(await projectContract.balanceOf(user1.address)).to.equal(`${1}`);

    expect(
      after.sub(ethers.utils.parseEther(`${buyAmount * presalePrice}`))
    ).to.equal(before);
  });

  it("Should buy presale with price=0 successfully", async function () {
    const [operator, project, user1, user2] = await ethers.getSigners();

    const backendId = 1;
    const ts = timestamp();
    const presalePrice = 0.001;
    const presaleAmount = 10;
    const presaleMaxPurchase = 2;
    const publicsalePrice = 0.002;
    const publicsaleAmount = 20;
    const publicsaleMaxPurchase = 5;
    const fee = 5 * 100;

    const saleData = [
      ts,
      ts + 3600 * 1,
      ethers.utils.parseEther(`${presalePrice}`),
      presaleAmount,
      presaleMaxPurchase,
      ts + 3600 * 2,
      ts + 3600 * 3,
      ethers.utils.parseEther(`${publicsalePrice}`),
      publicsaleAmount,
      publicsaleMaxPurchase,
      fee,
    ];
    const hasWhitelist = false;
    const canReveal = true;

    const sign = await getSignature(signer.privateKey, {
      backendId,
      owner: project.address.toLowerCase(),
      presalePrice: ethers.utils.parseEther(`${presalePrice}`).toString(),
      presaleAmount,
      presaleMaxPurchase,
      publicsalePrice: ethers.utils.parseEther(`${publicsalePrice}`).toString(),
      publicsaleAmount,
      publicsaleMaxPurchase,
      fee,
    });

    const tx = await projectManager
      .connect(project)
      .createERC721Project(
        backendId,
        "Test 1",
        "T2WEB",
        "ipfs://t2web",
        saleData,
        hasWhitelist,
        canReveal,
        sign.signature
      );

    let receipt = await tx.wait();
    let txLog = receipt.events[3];
    const projectId = txLog.args.projectId;
    const contractAddress = txLog.args.contractAddress;
    expect(projectId).to.equal("1");

    console.log(`contractAddress:${contractAddress}`);
    projectContract = await ethers.getContractAt(
      "T2WebERC721",
      contractAddress
    );

    expect(await projectContract.balanceOf(user1.address)).to.equal(`${0}`);

    await projectManager.connect(user1).buyPresale(projectId, 1, 0, {
      value: ethers.utils.parseEther(`${presalePrice}`),
    });

    expect(await projectContract.balanceOf(user1.address)).to.equal(`${1}`);
  });

  it("Should buy presale with fee=0 successfully", async function () {
    const [operator, project, user1, user2] = await ethers.getSigners();

    const backendId = 1;
    const ts = timestamp();
    const presalePrice = 0.001;
    const presaleAmount = 10;
    const presaleMaxPurchase = 2;
    const publicsalePrice = 0.002;
    const publicsaleAmount = 20;
    const publicsaleMaxPurchase = 5;
    const fee = 5 * 100;

    const saleData = [
      ts,
      ts + 3600 * 1,
      ethers.utils.parseEther(`${presalePrice}`),
      presaleAmount,
      presaleMaxPurchase,
      ts + 3600 * 2,
      ts + 3600 * 3,
      ethers.utils.parseEther(`${publicsalePrice}`),
      publicsaleAmount,
      publicsaleMaxPurchase,
      fee,
    ];
    const hasWhitelist = false;
    const canReveal = true;

    const sign = await getSignature(signer.privateKey, {
      backendId,
      owner: project.address.toLowerCase(),
      presalePrice: ethers.utils.parseEther(`${presalePrice}`).toString(),
      presaleAmount,
      presaleMaxPurchase,
      publicsalePrice: ethers.utils.parseEther(`${publicsalePrice}`).toString(),
      publicsaleAmount,
      publicsaleMaxPurchase,
      fee,
    });

    const tx = await projectManager
      .connect(project)
      .createERC721Project(
        backendId,
        "Test 1",
        "T2WEB",
        "ipfs://t2web",
        saleData,
        hasWhitelist,
        canReveal,
        sign.signature
      );

    let receipt = await tx.wait();
    let txLog = receipt.events[3];
    const projectId = txLog.args.projectId;
    const contractAddress = txLog.args.contractAddress;
    expect(projectId).to.equal("1");

    console.log(`contractAddress:${contractAddress}`);
    projectContract = await ethers.getContractAt(
      "T2WebERC721",
      contractAddress
    );

    expect(await projectContract.balanceOf(user1.address)).to.equal(`${0}`);

    await projectManager.connect(user1).buyPresale(projectId, 1, 0, {
      value: ethers.utils.parseEther(`${presalePrice}`),
    });

    expect(await projectContract.balanceOf(user1.address)).to.equal(`${1}`);
  });
});
