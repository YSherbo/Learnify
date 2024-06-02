const pager = require("node-pager");
const { gitCmd } = require("../utils");

async function log() {
  const { stdout } = gitCmd("log  --color=always");
  pager(stdout);
}

module.exports = log;
