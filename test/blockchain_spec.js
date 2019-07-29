'use strict'

var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const BlockchainClass = require('../src/blockchain')
const BlockClass = require('../src/block')

describe('Blockchain module', () => {
  var blockchain, block

  beforeEach(function(){
    blockchain = new BlockchainClass.Blockchain();
    block = new BlockClass.Block('Sample')
  });

  describe('_addBlock', () => {
    it('rejects if not a block is given', async () => {
      var action = blockchain._addBlock('not a block');
      await expect(action).to.be.rejected
    })

    it('stores block in blockchain', async () => {
      var action = await blockchain._addBlock(block);
      expect(action).to.eq(block);
      expect(blockchain.chain).to.include(block);
      var lastBlock = blockchain.chain.slice(-1)[0]
      expect(lastBlock.height).to.eq(blockchain.chain.length - 1)
    })
  })

  describe('requestMessageOwnershipVerification', () => {
    it('resolves with message containing wallet address', async () => {
      var verification = await blockchain.requestMessageOwnershipVerification('foo')
      expect(verification).to.include('foo')
    })
  })

  describe('submitStar', () => {
    const validWallet = '111'

    // No idea how to test wallets with invalid signatures

    // it('rejects blocks if elapsed time is too long', async () => {
    //   tenMinsAgo = new Date(oldDateObj.getTime() + diff*60000);
    //   msg = `${validWallet}:${tenMinsAgo.toString().slice(0,-3)}:starRegistry`
    //   var action = await blockchain.submitStar('foo')
    // })

    it('rejects blocks with invalid signature')

    it('submits proper blocks')
  })
})
