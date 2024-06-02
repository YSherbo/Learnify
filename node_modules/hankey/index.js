const chalk = require("chalk");
const emoji = require("node-emoji");

// just a wrapper for console.log
function log(...args) {
  console.log(...args);
}

function info(msg) {
  console.log(format(msg, "yellow"));
}

function error(msg) {
  console.log(format(msg, "red"));
}

function action(msg) {
  console.log(format(msg, "blue"));
}

function findEmojis(str) {
  return str.replace(/(:.*?:)/g, x => `${emoji.get(x)} `);
}

function format(msg, color) {
  msg = findEmojis(msg);
  if (!color) {
    return msg;
  }

  return chalk[color](msg);
}

module.exports = {
  log,
  info,
  error,
  action,
  format
};
