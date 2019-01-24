var Migrations = artifacts.require("./PictureProof.sol");

module.exports = function (deployer) {
    deployer.deploy(Migrations);
};