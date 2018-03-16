const SHA256 = require("crypto-js/sha256");
const { DIFFICULTY, MINERATE } = require("../config");

class Block {
  constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  toString() {
    return `Block -
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash.substring(0, 10)}
      Hash      : ${this.hash.substring(0, 10)}
      Nonce     : ${this.nonce}
      Data      : ${this.data}
      Difficulty: ${this.difficulty}`;
  }

  static genesis() {
    return new this("Genesis time", "-----", "f1r57-h45h", [], 0, DIFFICULTY);
  }

  static mineBlock(lastBlock, data) {
    let hash, timestamp;
    const lastHash = lastBlock.hash;
    let nonce = 0;
    let { difficulty } = lastBlock;
    do {
      timestamp = Date.now();
      nonce++;
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

    return new this(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return SHA256(
      `${timestamp}${lastHash}${data}${nonce}${difficulty}`
    ).toString();
  }

  static blockHash(block) {
    const { timestamp, lastHash, data, nonce, difficulty } = block;
    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty, timestamp } = lastBlock;
    difficulty =
      timestamp + MINERATE > currentTime ? difficulty + 1 : difficulty - 1;
    return difficulty;
  }
}

module.exports = Block;
