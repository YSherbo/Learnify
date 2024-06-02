const tasks = require("./src/tasks");
module.exports = function(opts) {
  tasks[opts.args[0]](opts.args[1]);
};
