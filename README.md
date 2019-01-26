# Consensys Final Project by edupleich

This is a proof-of-existence contract that registers an image to an address with the corresponding timestamp.

The contract uses Open Zeppelin's Pausable contract, which was installed through npm.

## Requirements
This project requires you to have installed:
1. [Ganache v6.1.6](https://truffleframework.com/ganache)
1. [Truffle v4.1.13](https://truffleframework.com/)
1. [npm v6.3.0](https://www.npmjs.com/)
1. [MetaMask](https://metamask.io/)
1. [Git](https://git-scm.com/)


## Running project
1. Set up a symlink from `client/` with `ln -s ../../build/contracts contracts`
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


