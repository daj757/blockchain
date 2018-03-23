const Wallet = require("./wallet");
const wallet = new Wallet();
console.log(wallet.toString());

// const Blockchain = require("./blockchain");

// const bc = new Blockchain();

// for (var i = 0; i < 10; i++) {
//   console.log(bc.addBlock(`foo${i}`).toString());
// }
// const block = new Block("foo", "var", "zoo", "baz");
// console.log(Block.genesis().toString());
// console.log(block.toString());

// const fooBlock = Block.mineBlock(Block.genesis(), "foo");
// console.log(fooBlock.toString());
