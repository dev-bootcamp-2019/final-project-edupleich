# Consensys Final Project by edupleich

This is a proof-of-existence contract that registers an image to an address with the corresponding timestamp.

The contract uses Open Zeppelin's Pausable contract, which was installed through npm.

## Requirements
This project requires you to have installed:
1. [Ganache](https://truffleframework.com/ganache)
1. [Truffle](https://truffleframework.com/)
1. [npm](https://www.npmjs.com/)
1. [MetaMask](https://metamask.io/)
1. [Git](https://git-scm.com/)


## Running project
1. (Might need to) Set up a symlink from `client/` with `ln -s ../../build/contracts contracts`
1. Run `npm install` from `client/`
1. Start `Ganache` with `ganache-cli`
1. Run `truffle compile` and `truffle migrate --reset`
1. Run `npm start` from `client/`


## Testing
1. Make sure that you have `Ganache` running. If not, start it with `ganache-cli`
1. Run the tests with `truffle test`
1. All tests should pass.

## Rinkeby Testnet
The contract is deployed on the `Rinkeby` testnet with the address: `0x9Af94c0Ad8eC268374afd10B82ed7500D5Fa717f`
Check at https://rinkeby.etherscan.io/address/0x94E226a72d46F27c9a9DFF7336acF9872137Ee2E


