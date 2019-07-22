'use strict'

const BlockClass = require('../src/block')
const expect = require('chai').expect

describe('Block module', () => {
  let block = new BlockClass.Block({data: 'Genesis Block'});

  describe('"validate"', () => {
    it('returns true if Block havent been tampered with', async () => {
      const valid_block = await block.validate();
      console.log('block') // Completely ignored
      expect(valid_block).to.eq(true)
    })
    it('returns false if Block have been tampered with', async () => {
      // Tamper
      block.body = 'foo'
      const valid_block = await block.validate();
      expect(valid_block).to.eq(false)
    })
  })
})
