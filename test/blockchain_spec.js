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
})
