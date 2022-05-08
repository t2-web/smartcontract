/* eslint-disable no-undef */
const DodoNFT = artifacts.require("DodoNFT");

const owner = "0x343eCF760a020936eEE8D655b43C5cBD40769A05";

module.exports = async () => {
  // console.log('  Deploying RIKEN...')
  // const riken = await Riken.new('RIKEN', 'RIKEN', web3.utils.toWei('1000000000'))
  // const dodo = await DodoNFT.at("0xc78cd7A12D73B3021CDB3Bffb8230065118D3b47");
  // console.log(`  Deployed RIKEN at: ${riken.address}`)

  try {
    console.log('Deploy DodoNFT');
    const nft = await DodoNFT.at('0x15111F8fd928F0053bC55D93775f7236f215CC82')

    // const mintRole = await rigy.MINTER_ROLE()
    // await rigy.grantRole(mintRole, idleGame.address)
    // console.log('Granted minter role to idle game', idleGame.address)

    // await idleGame.setRewardConfigs(
    //   rigy.address,
    //   riken.address,
    //   web3.utils.toWei('200'),
    //   web3.utils.toWei('20'),
    //   winRatio
    // )
    // console.log('DONE Set Reward Configs')

    // const reservePool = owner
    // const idoAddr = '0xa0e705b92ace169572edcfc43cad51addcf697f5'
    // const totalChests = 100
    // const silverChests = 30
    // const goldChests = 20
    // const totalPorians = 170
    // const startTime = 1647069973
    // const vrfCoordinator = '0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed'
    // const subscriptionId = 59
    // const keyHash = '0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f'
    // console.log('  Deploying PorianAllocation...')

    // const allocationLogic = await PorianAllocation.new(
    //   idoAddr,
    //   nft.address,
    //   reservePool,
    //   totalChests,
    //   silverChests,
    //   goldChests,
    //   totalPorians,
    //   startTime,
    //   vrfCoordinator,
    //   subscriptionId,
    //   keyHash
    // )
    // const allocationProxy = await UpgradableProxy.new(allocationLogic.address, proxyAdmin, '0x')
    // const allocation = await PorianAllocation.at(allocationProxy.address)
    // await allocation.initialize(
    //   owner,
    //   idoAddr,
    //   nft.address,
    //   reservePool,
    //   totalChests,
    //   silverChests,
    //   goldChests,
    //   totalPorians,
    //   startTime,
    //   vrfCoordinator,
    //   subscriptionId,
    //   keyHash
    // )

    // const allocation = await PorianAllocation.at('0x8354f9a3bAcb470c59E81e0120f91Dc806c37c51')
    // console.log(`  Deployed PorianAllocation at: ${allocation.address}`)
    // await allocation.setAmountConfig(
    //   totalChests,
    //   silverChests,
    //   goldChests,
    //   totalPorians
    // )
    // console.log('DONE')

    // console.log(`  Set PoriNFT to Breeding Rule: ${nft.address}`)
    // let tx = await rule.setPoriNFT(nft.address)
    // console.log(tx)

    // console.log(`  Set Breeding Rule to PoriNFT: ${rule.address}`)
    // tx = await nft.setBreedingRuleAddress(rule.address)
    // console.log(tx)

    // console.log(`  Set Gene Factory to PoriNFT: ${geneFactory.address}`)
    // tx = await nft.setGeneFactoryAddress(geneFactory.address)
    // console.log(tx)

    // console.log('DONE')

    // let tx = await nft.transferFrom(owner, '0xF707964F1F8c94B7AB813785621407c18816092E', 0)
    // console.log(tx)
    // tx = await nft.transferFrom(owner, '0xF707964F1F8c94B7AB813785621407c18816092E', 1)
    // console.log(tx)
    // tx = await nft.transferFrom(owner, '0xF707964F1F8c94B7AB813785621407c18816092E', 2)
    // console.log(tx)
    // tx = await nft.transferFrom(owner, '0xF707964F1F8c94B7AB813785621407c18816092E', 3)
    // console.log(tx)
    // tx = await nft.transferFrom(owner, '0xF707964F1F8c94B7AB813785621407c18816092E', 4)
    // console.log(tx)
    // let tx = await nft.transferFrom(owner, '0xF707964F1F8c94B7AB813785621407c18816092E', 5)
    // console.log(tx)
    // tx = await nft.transferFrom(owner, '0xF707964F1F8c94B7AB813785621407c18816092E', 6)
    // console.log(tx)

    //
    // for (let i = 299; i <= 274 + 46; i++) {
    //   await nft.safeTransferFrom(owner, '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C', i)
    //   console.log(i)
    // }

    // const porians = await allocation.remainPorians()
    // console.log(porians.toString())

    // const addresses = [
    //   // '0x1F8A3F6083F90f5FeF56AC3D3F22822C41C9488a',
    //   // '0xF41Ef7638Ad68Eb674de233A843c7693694a57Ab',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0x4cfd17EE4a6Df12A5e6AC73E4e818e7eBca4ADCB'
    //   // '0xf9209B6F49BB9fD73422BA834f4cD444aE7ceacE',
    //   // '0x61df94964cD8BC3083Dec299F68C4914dd0E69B0',
    //   // '0x165E9322E13717d9E2F90a42b3d79f5430B7e1Ae',
    //   // '0xF3291FA41D1B62aA8102566a891e5d70e4EA2520',
    //   // '0x8d1A4b353d80f31757CC2264f6a163c410B2fBF2',
    //   // '0xbBbFA611308ed4EC57e332Bd0C7aE9B5dC373c2E',
    //   // '0x2E0f6252C96BD36a232D3b94fF96dd4B35694aDA',
    //   // '0xF096CF25A4270BFfeC261d9AF31f70aAB6c46D39',
    //   // '0x8eB3afAe1f03F142a9C0cfC72068fa2684AD3E29',
    //   // '0x57FE5DF87eD590AB8cf4B5a1fF0DAf12Ec240957',
    //   // '0x10ee0aFc9B3315E6c7DD8198caF75FE5f6B7100a'
    // ]
    // for (let i = 0; i < addresses.length; i++) {
    //   const dataMint = mintPorians(20, addresses[i])
    //   await nft.mintPoriBatch(dataMint.addresses, dataMint.genes)
    //   console.log('DONE MINT', i)

    //   await rigy.mint(addresses[i], web3.utils.toWei('10000'))
    //   console.log('DONE RIGY', i)

    //   await riken.transfer(addresses[i], web3.utils.toWei('10000'))
    //   console.log('DONE RIKEN', i)
    // }
    // for (let i = 0; i < 100; i++) {
    //   const dataMint = mintPorians(60, allocation.address)
    //   await nft.mintPoriBatch(dataMint.addresses, dataMint.genes)
    //   console.log('DONE MINT', i)
    //   if (i % 5 === 0) {
    //     await sleep(5 * 1000)
    //   }
    // }

    // const receivers = [
    //   "0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C",
    //   "0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C",
    //   "0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C",
    // ];
    // await nft.mintPoriBatch(receivers, genes);

    // 274 -> 274 + 46
    // await nft.mintPoriBatch([
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C',
    //   '0xf8ee40AeEd469fB768fC870343BC7e98C0C03A7C'
    // ], [
    //   createGene('7', '1'),
    //   createGene('6', '2'),
    //   createGene('5', '3'),
    //   createGene('4', '4'),
    //   createGene('3', '5'),
    //   createGene('2', '6'),
    //   createGene('1', '7'),
    //   createGene('1', '1'),
    //   createGene('2', '2'),
    //   createGene('3', '3'),
    //   createGene('4', '4'),
    //   createGene('5', '5'),
    //   createGene('6', '6'),
    //   createGene('7', '7'),
    //   createGene('5', '1'),
    //   createGene('4', '2'),
    //   createGene('3', '3'),
    //   createGene('2', '4'),
    //   createGene('1', '5'),
    //   createGene('3', '6'),
    //   createGene('4', '7'),
    //   createGene('5', '1'),
    //   createGene('6', '2'),
    //   createGene('7', '3'),
    //   createGene('8', '4'),
    //   createGene('4', '5'),
    //   createGene('3', '6'),
    //   createGene('4', '7')
    // ])
    // console.log('DONE MINT')

    // await rigy.mint('0x6f182549Ea9E594E5b91ca2A5fA271318Db7C15c', web3.utils.toWei('600000000'))
    // console.log('DONE RIGY')

    // await riken.transfer('0x6f182549Ea9E594E5b91ca2A5fA271318Db7C15c', web3.utils.toWei('300000000'))
    // console.log('DONE RIKEN')

    // await fragment.transfer(idleGame.address, web3.utils.toWei('2000'))
    // console.log('DONE fragment')

    // await rule.setHatchingConfig(300)
    // await rule.setBreedingConfigs(7, 2)

    // console.log('DONE')
    //   // tx = await nft.hatchEgg(7)
    //   // console.log(tx)
  } catch (e) {
    console.log(e);
    process.exit(0);
  }

  // const payment = await PaymentToken.at('0xdCEd63dDbC20a91E1E210976815E814ffa002d2b')
  // await payment.transfer('0xF707964F1F8c94B7AB813785621407c18816092E', '20000000000000000000000000')
  // const market = await Marketplace.at('0xE828251c4BA574F3645Ea196753B7c725d551b31')
  // await market.changeNFTToken(nft.address)

  // await nft.grantRole('0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6', '0xF707964F1F8c94B7AB813785621407c18816092E')
  // console.log(minter)
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// PoriNFTBreedable at: 0x2Eb6CD30A202C4B0b12379c5D49A6580b33A0Ba4
// PaymentToken at: 0xdCEd63dDbC20a91E1E210976815E814ffa002d2b
// Marketplace at: 0x17F614755Daa25c5a3c828750A35D003F989c0E4
// RIKEN: 0x8Eb726F81f52e6c30A5babf2E369CE5a2340E467
// RIGI: 0xfe8ac57434Aabad8b0112cA1Bb4b7A2cF33ca582

// PoriNFTBreedable at: 0x38d5D850b6d67a88423044A1d71D366154eC9f37
// GeneFactory at: 0xa365470C45d1CA7fBe87231e5b5fCC8e16a4Cebf
// PoriBreedingRule: 0xbBCc3DEBBFf40e7EEBa6542b433028220Bf8e072
// PoriPower: 0xF23D6153E7b1d62B9549c5518a833268Dc8A2697

// MATIC MUMBAI
// Deployed RIKEN at: 0x933a4eF3C5aF99322825F59791037aa0cc583b4A
// Deployed RIGI at: 0x8db1B29cB1ee0e8b3156caab41a4B9c6AefB399B
// Deployed GeneFactory at: 0xb847F0Fbd072392B279808Fc761D52DEA45aa36e
// Deployed PoriPower at: 0x5a82086266cD7eD6B9375105c478c66E10827435
// Deployed PoriBreedingRule at: 0xFCff83f0ce91DF679A1ad3c59D70a1db742Ac4D5
// Deployed PoriNFTBreedable at: 0xeC476Ae735D91D3bF2Bb8C172854c901906C9936
// Deployed Marketplace at: 0xAD2Ae863040aee48EEC17e97438383766c99e443
// Deployed PoriRentalCentre at: 0xEa5ee287DE00112b427f96eCe8d2725EA2BfEf41
// Deployed PorianAllocation at: 0xAFEEf265FDc07EDe3DE027598078a9dce4875012

// version 2
// Deployed PoriNFTBreedable at: 0x15111F8fd928F0053bC55D93775f7236f215CC71
// Deployed PoriBreedingRule at: 0x207706366F94f6d17c1b8F89d493Bef9C4e56F8d
// Deployed Marketplace at: 0x2292af5c4ddB9853c264249944d330A844089E03
// Deployed Fragment at: 0x0DB9392328077a88415C7F72d54A8c16d4aA1cCC
// Deployed PoriPower at: 0x650469abA27343a8d6730377CBcC9811DfAe0Fa0
// Deployed IdleGame at: 0x480E31c43961ebF605f99C16eA058bF147030435
// Deployed PorianAllocation at: 0xBA4e7D404775292909d98D48491b11C9b8b3BBf4
// Deployed RIKEN at: 0x3622302b213F6509D409E8Fa24d9B1162df663C4
// Deployed RIGY at: 0xd5B7e59fc93Da7098052f66D5dc388B47CCeF10E

// staging
// Deployed RIKEN at: 0xc78cd7A12D73B3021CDB3Bffb8230065118D3b47
// Deployed RIGY at: 0xB9C88958806a187a6626A5B22089E3d3909415aa
// Deployed PoriNFTBreedable at: 0xe958F64556f7293D882E7a3E7330546F9Ea75182
// Deployed Marketplace at: 0x4831013ac926366e856140548692e4e2B4799Bfa
// Deployed PoriBreedingRule at: 0x066aB3B4817514a86cf91433dfF8C5bC2c666FDf
// Deployed IdleGame at: 0x70d66d12c424Db41bf4E501A3FBbF5D4a779E66b
// Deployed Fragment at: 0x37a0318c36D38724fD3b193BF2D6bAD3498A67e3
// Deployed PoriPower at: 0x650469abA27343a8d6730377CBcC9811DfAe0Fa0
// Deployed PoriRentalCentre at: 0x77739F76Dd56732adca6c528ba72E562feA21F51
// Deployed PorianAllocation at: 0x8354f9a3bAcb470c59E81e0120f91Dc806c37c51
