const { ethers, utils } = require("ethers");
const { assert, util, expect } = require('chai')

// https://medium.com/linum-labs/everything-you-ever-wanted-to-know-about-events-and-logs-on-ethereum-fec84ea7d0a5
// https://codeburst.io/deep-dive-into-ethereum-logs-a8d2047c7371

function static_decode() {

    // ##############################################################################
    // Figuring out the keccak256 of the function + argument types
    // ##############################################################################
    // can get online keccak: https://emn178.github.io/online-tools/keccak_256.html
    let keccak256For0x = utils.keccak256("0x");
    //console.log(`utils.keccak256("0x"): ${keccak256For0x}`);
    assert.equal(keccak256For0x, "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470");

    // convert strings to bytes first
    let keccak256ForTransfer = utils.keccak256(utils.toUtf8Bytes("Transfer(address,address,uint256)"));
    assert.equal(keccak256ForTransfer, "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef");
    //console.log(`utils.keccak256("Transfer(address,address,uint256)"): ${keccak256ForTransfer}`);

    // ##############################################################################
    // Decode event data
    // ##############################################################################

    const decoder = new utils.AbiCoder();

    // https://etherscan.io/tx/0xa4981389b46d104bf1a81ddaae3167b3e94f5dca47bd9a24bc26bcbdc91d52c2#eventlog
    // ERC-721 transfer function ==> Transfer (address from, address to, uint256 tokenId)
    let topic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
    let topicData = "0x000000000000000000000000e206bed1e14384bdef06736dac0fa0d0790a48950000000000000000000000001ac1970ad7caf1d4e3451addc13d8f8345a87867000000000000000000000000000000000000000000000000000000000005be74";
    let decodedData = decoder.decode([ "address", "address", "uint256" ], topicData);
    console.log(`decodedData: ${JSON.stringify(decodedData)}`)
    assert.equal(decodedData[0], "0xe206beD1E14384bDeF06736daC0fA0D0790a4895"); // from
    assert.equal(decodedData[1], "0x1Ac1970AD7cAF1d4E3451aDdC13d8f8345a87867"); // to
    if(decodedData[2]["_isBigNumber"]) {
        assert.equal(decodedData[2]["_hex"], "0x05be74")
        assert.equal(ethers.BigNumber.from(decodedData[2]["_hex"]).toString(), "376436")
    } else {
        expect.fail("decoded data should be integer")
    }

    

}

static_decode()
