var BlocketPlaceToken = artifacts.require("BlocketPlaceToken");
var Blocketplace = artifacts.require("Blocketplace");

module.exports = function (deployer) {
  deployer.deploy(BlocketPlaceToken).then(function () {
    return deployer.deploy(Blocketplace, BlocketPlaceToken.address);
  });
};
