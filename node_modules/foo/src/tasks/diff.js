const { gitCmd } = require("../utils");

function diff() {
  const { stdout } = gitCmd("diff  --color=always");
  console.log(stdout);
}

module.exports = diff;
