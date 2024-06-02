const { action } = require("hankey");
const path = require("path");
const { gitCmd } = require("../utils");

function getRepoName() {
  const { repository: { url } } = require(path.join(
    process.cwd(),
    "package.json"
  ));
  const repo = path.basename(url);
  return repo.replace(/\.git$/, "");
}

function addRemote(remote) {
  const repo = getRepoName();
  gitCmd(`remote add ${remote} https://github.com/${remote}/${repo}.git`);
}

function parseCheckout(cmd) {
  const [, remote, branch] = cmd.match(/^@(.+):(.+)$/);
  return { remote, branch };
}

function checkout(cmd) {
  const matches = cmd.match(/^@(.+)[:|\/](.+)$/);
  if (!matches) {
    return;
  }

  const [, remote, branch] = matches;
  addRemote(remote);

  gitCmd(`fetch ${remote}`);
  const { stderr, code } = gitCmd(`checkout --track ${remote}/${branch}`);
  if (code != 0) {
    console.log(stderr);
  }

  action(`:dancer: Current branch ${branch}`);
}

module.exports = { checkout, parseCheckout };
