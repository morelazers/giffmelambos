const _ = require('lodash')

let funcs = {

  /**
   *  Deploys a contract with given constructor parameters; if the final param is an object it is
   *  treated as the intended transaction object
   *  @param {Object} contract Contract to deploy
   *  @optional @param {List} ...args Additional arguments, passed as general comma separated args
   */
  deploy: async (contract, ...args) => {
    let txObj = _.last(args)
    if (!_.isObject(txObj)) {
      txObj = { from: web3.eth.accounts[0] }
      args.push(txObj)
    }
    let newContract = await contract.new(...args)
    return newContract
  },

  /**
   *  Sends a request to the RPC provider to mine a single block synchronously
   */
  mineOneBlock: function () {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_mine',
      id: new Date().getTime()
    })
  },

  /**
   *  Assert that a particular Ethereum transaction throws
   *  @param {Promise} promise Transaction operation which should throw
   *  @param {String} err Error message which should be printed upon test failure
   *  @return {Promise} Promise which will resolve once the transaction has been completed
   */
  assertThrows: (promise, err) => {
    return promise.then(() => {
      assert.isNotOk(true, err)
    }).catch((e) => {
      assert.include(e.message, 'VM Exception')
    })
  },

}

module.exports = funcs