pragma solidity 0.4.18;

contract Gorbachev {

  uint public constant MINIMUM_MESSAGE_LENGTH = 2;
  uint public constant MAXIMUM_MESSAGE_LENGTH = 140;
  uint public constant PRICE_PER_BUBBLE = 0.1 ether;

  address public owner;
  uint public messageCount;
  mapping(uint => address) public bubbleOwner;
  mapping(uint => string) public bubbleText;
  mapping(uint => uint) public bubbleParent;
  mapping(uint => bool) public bubbleInitialised;
  mapping(address => uint) public balances;

  function Gorbachev(string _firstMessage) public {
    owner = msg.sender;
    messageCount = 1;
    bubbleOwner[1] = msg.sender;
    bubbleText[1] = _firstMessage;
    bubbleParent[1] = 1;
    bubbleInitialised[1] = true;
  }

  function addBubble(uint _parentBubble, string _message) payable public {
    require(msg.value == 0.1 ether);
    require(bubbleInitialised[_parentBubble]);
    require(bytes(_message).length >= MINIMUM_MESSAGE_LENGTH);
    require(bytes(_message).length <= MAXIMUM_MESSAGE_LENGTH);
    messageCount++;
    bubbleInitialised[messageCount] = true;
    bubbleText[messageCount] = _message;
    bubbleOwner[messageCount] = msg.sender;
    bubbleParent[messageCount] = _parentBubble;
    balances[bubbleOwner[_parentBubble]] += 0.095 ether;
    balances[owner] += 0.005 ether;
  }

  function withdraw() public {
    require(balances[msg.sender] >= 0);
    uint toWithdraw = balances[msg.sender];
    balances[msg.sender] -= toWithdraw;
    msg.sender.transfer(toWithdraw);
  }

}