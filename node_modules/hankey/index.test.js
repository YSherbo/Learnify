const { info, log, error, action } = require("./index");

const yellow = msg => `\u001b[33m${msg}\u001b[39m`;
const glog = global.console.log;

describe("log", () => {
  describe("info", () => {
    it("info is yellow", () => {
      global.console = { log: jest.fn() };
      info("foo");
      expect(global.console.log).toBeCalledWith(yellow("foo"));
    });

    it("info has an emoji!", () => {
      global.console = { log: jest.fn() };
      info(":smile: foo");
      // glog(global.console.log.mock.calls);
      expect(global.console.log).toBeCalledWith(yellow("😄  foo"));
    });
  });

  describe("log", () => {
    it("one message", () => {
      global.console = { log: jest.fn() };
      log("foo");
      expect(global.console.log).toBeCalledWith("foo");
    });

    it("two messages", () => {
      global.console = { log: jest.fn() };
      log("foo", "bar");
      expect(global.console.log).toBeCalledWith("foo", "bar");
    });
  });
});
