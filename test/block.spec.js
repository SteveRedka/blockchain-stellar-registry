'use strict'

var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const BlockClass = require('../src/block')

describe('Block module', () => {
  var block

  beforeEach(function(){
    block = new BlockClass.Block({data: 'Sample Block'});
  });

  describe('"validate"', () => {
    it('returns true if Block havent been tampered with')
    // it('returns true if Block havent been tampered with', async () => {
    //   const valid_block = await block.validate();
    //   expect(valid_block).to.eq(true)
    // })

    it('returns false if Block have been tampered with', async () => {
      // Tamper
      block.body = 'foo'
      const valid_block = await block.validate();
      expect(valid_block).to.eq(false)
    })
  })

  describe('getBData', () => {
    it('rejects on Genesis block', async() => {
      var blockBData = block.getBData();
      await expect(blockBData).to.be.rejectedWith('This is genesis block!')
    })

    it('returns data on normal blocks', async() => {
      block.hash = 'foo'
      var result = block.getBData();
      return expect(result).to.eventually.include({ data: 'Sample Block' });
    })
  })
})
