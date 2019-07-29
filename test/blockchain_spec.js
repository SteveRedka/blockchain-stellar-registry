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

  const validWallet = '1HxEVketEJc4pSDSrjq1qo2bEzehagV9ft'
  const validMessage = '1HxEVketEJc4pSDSrjq1qo2bEzehagV9ft:1564409335:starRegistry'
  const validSignature = 'H9DzdK1tygUraWQwrxTWoQK7TOyo9mBSnDqGUvkHJ4jzFTqp4HHbCGgvpN2Qg+JjDndyiVzwHk5njuQTe0T+LNA='
  const validStar = {
    "dec": "68deg 52' 56.9",
    "ra": "16h 29m 1.0s",
    "story": "Lorem ipsum"
  }

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
    it('rejects blocks if elapsed time is too long', async () => {
      var tenMinsAgo = (new Date()).getTime() - 10*60*1000;
      var msg = `${validWallet}:${tenMinsAgo.toString().slice(0,-3)}:starRegistry`
      var action = blockchain.submitStar(validWallet, msg, validSignature, validStar)
      await expect(action).to.be.rejected
    })

    it('rejects blocks with invalid signature', async () => {
      var action = blockchain.submitStar(validWallet, validMessage, 'invalidSignature', validStar)
       expect(action).to.eventually.be.rejected
    })

    it('submits proper blocks', async () => {
      var action = blockchain.submitStar(validWallet, validMessage, validSignature, validStar)
      await expect(action).not.to.be.rejected
    })
  })

  describe('getBlockByHash', () => {
    it('returns block by hash', async () => {
      await blockchain._addBlock(block);
      var action = await blockchain.getBlockByHash(block.hash)
      expect(action).to.eq(block)
    })
  })

  describe('getStarsByWalletAddress', () => {
    it('returns array of starts', async () => {
      await blockchain.submitStar(validWallet, validMessage, validSignature, validStar)
      var action = await blockchain.getStarsByWalletAddress(validWallet)
      expect(action.length).to.eq(1)
      expect(action[0].owner).to.eq(validWallet)
      expect(action[0].star).to.deep.eq(validStar)
    })
  })

  describe('validateChain', () => {
    it('returns empty errors on valid chain', async () => {
      await blockchain.submitStar(validWallet, validMessage, validSignature, validStar)
      var errors = await blockchain.validateChain()
      expect(errors.length).to.eq(0)
    })

    it('returns array of errors', async () => {
      await blockchain.submitStar(validWallet, validMessage, validSignature, validStar)
      blockchain.chain[1].time = 0
      var errors = await blockchain.validateChain()
      expect(errors.length).to.eq(1)
    })
  })
})
