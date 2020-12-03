const VendingMachine = artifacts.require('VendingMachine');

module.exports = function (deployer) {
  deployer.deploy(
  	VendingMachine,
  	web3.utils.padLeft(web3.utils.utf8ToHex('Super Fun Vending Machine'), 64)
  );

};
