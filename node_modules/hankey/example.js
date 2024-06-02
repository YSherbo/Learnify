const { info, log, error, action } = require("./index");

info(":wave: hey there!");
error(":bomb: Oh noes!");
action(":dizzy: doing something big!");

const yo = "oy";
log("a shorter console.log", { yo });
