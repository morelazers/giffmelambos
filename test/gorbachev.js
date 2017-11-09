const Gorbachev = artifacts.require('./Gorbachev.sol')
const utils = require('./lib/utils')

const arbitraryMessage = "Some arbitrary message"

let gorbachevContract

contract('Gorbachev', async (accounts) => {
  beforeEach(async () => {
    gorbachevContract = await utils.deploy(Gorbachev, arbitraryMessage, { from: web3.eth.accounts[0] })
  })
  it('Sets the deployer as the owner', async () => {
    let owner = await gorbachevContract.owner.call()
    assert.equal(owner, web3.eth.accounts[0])
  })
  it('Sets the initial message count to 1', async () => {
    let messageCount = await gorbachevContract.messageCount.call()
    assert.equal(messageCount.toNumber(), 1)
  })
  it('Initialises the first bubble', async () => {
    let bubbleText = await gorbachevContract.bubbleText.call(1)
    let bubbleOwner = await gorbachevContract.bubbleOwner.call(1)
    let bubbleParent = await gorbachevContract.bubbleParent.call(1)
    let initialised = await gorbachevContract.bubbleInitialised.call(1)

    assert.equal(bubbleText, arbitraryMessage)
    assert.equal(bubbleOwner, web3.eth.accounts[0])
    assert.equal(bubbleParent.toNumber(), 1)
    assert.isOk(initialised)
  })
})