const PictureProof = artifacts.require("PictureProof");

contract(PictureProof, accounts => {
    const owner = accounts[0]
    const alice = accounts[1]
    const bob = accounts[2]
    const emptyAddress = '0x0000000000000000000000000000000000000000'

    it("should register a picture", async () => {
        const pictureProof = await PictureProof.deployed();
        // const hash_random = web3.utils.randomHex(32);
        const hash_random = randomHash();
        let eventEmitted = false;

        const tx = await pictureProof.register(hash_random, { from: owner });
        if (tx.logs[0].event === "Registration") {
            eventEmitted = true;
        }
        // const index = await pictureProof.getRegistrationCount();
        const result = await pictureProof.fetchPicture.call(0);
        assert(eventEmitted, true, 'registering picture should emit event');
        assert.equal(web3.utils.toHex(result[0]), web3.utils.sha3(hash_random), 'Hashes do not match');
    });   
});

function randomHash() {
    return Math.random().toString(36).replace(/[^A-Za-z0-9]+/g, '');
}