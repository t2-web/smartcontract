require('@nomiclabs/hardhat-truffle5')

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: '0.6.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
