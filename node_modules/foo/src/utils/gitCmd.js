const shell = require("shelljs");
const debug = require("debug")("foo");

function gitCmd(command) {
  const { code, stdout, stderr } = shell.exec(`git ${command}`, {
    silent: true
  });

  const data = debug(command, { code, stdout, stderr });
  return { code, stdout, stderr };
}

module.exports = gitCmd;
