const Gorbachev = artifacts.require('./Gorbachev.sol')
const utils = require('./lib/utils')

const arbitraryMessage = "Some arbitrary message"

// this message is 141 chars and should fail
const longArbitraryMessage = "01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
const tooLongArbitraryMessage = "012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"


let gorbachevContract

contract('Gorbachev', async (accounts) => {
  beforeEach(async () => {
    gorbachevContract = await utils.deploy(Gorbachev, arbitraryMessage, { from: web3.eth.accounts[0] })
  })
  it('Does not allow adding a bubble for any less than 0.1 ether', async () => {
    await utils.assertThrows(gorbachevContract.addBubble(1, arbitraryMessage, { value: web3.toWei(0.09, 'ether') }))
  })
  it('Does not allow adding a bubble with a message longer than 140 characters', async () => {
    await utils.assertThrows(gorbachevContract.addBubble(1, tooLongArbitraryMessage, { value: web3.toWei(0.1, 'ether') }))
  })
  it('Allows adding a bubble with 140 characters', async () => {
    await gorbachevContract.addBubble(1, longArbitraryMessage, { value: web3.toWei(0.1, 'ether') })
  })
  it('Does not allow adding a bubble with a nonexistent parent', async () => {
    await utils.assertThrows(gorbachevContract.addBubble(2, longArbitraryMessage, { value: web3.toWei(0.1, 'ether') }))
  })
  it('Allows adding a bubble on top of a placed one', async () => {
    await gorbachevContract.addBubble(1, arbitraryMessage, { value: web3.toWei(0.1, 'ether') })
    await gorbachevContract.addBubble(2, arbitraryMessage, { value: web3.toWei(0.1, 'ether') })
  })
  it('Allows withdrawing 0.095 ETH after someone links to your bubble', async () => {
    let withdrawingAccount = web3.eth.accounts[1]
    await gorbachevContract.addBubble(1, arbitraryMessage, { value: web3.toWei(0.1, 'ether'), from: withdrawingAccount })
    await gorbachevContract.addBubble(2, arbitraryMessage, { value: web3.toWei(0.1, 'ether'), from: web3.eth.accounts[2] })
    let balanceBefore = await web3.eth.getBalance(withdrawingAccount)
    await gorbachevContract.withdraw({ from: withdrawingAccount })
    let balanceAfter = await web3.eth.getBalance(withdrawingAccount)
    let balanceDiff = balanceAfter.sub(balanceBefore)
    let shouldWithdraw = web3.toWei(0.095, 'ether')
    assert.isAbove(balanceDiff.toNumber(), shouldWithdraw * 0.97)
  })
  it('Gives the admin the correct amount after someone adds a bubble', async () => {
    let withdrawingAccount = web3.eth.accounts[0]
    await gorbachevContract.addBubble(1, arbitraryMessage, { value: web3.toWei(0.1, 'ether'), from: web3.eth.accounts[1] })
    let contractBalanceBefore = await gorbachevContract.balances.call(withdrawingAccount)
    await gorbachevContract.addBubble(1, arbitraryMessage, { value: web3.toWei(0.1, 'ether'), from: web3.eth.accounts[2] })
    let contractBalanceAfter = await gorbachevContract.balances.call(withdrawingAccount)
    let balanceDiff = contractBalanceAfter.sub(contractBalanceBefore)
    let shouldWithdraw = web3.toWei(0.005, 'ether')
    assert.isAbove(balanceDiff.toNumber(), shouldWithdraw)
  })
})