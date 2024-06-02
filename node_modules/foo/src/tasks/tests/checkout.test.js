const m = jest.mock("../../utils/gitCmd", {
  gitCmd: jest.fn(() => ({
    stdout: "",
    stderr: "",
    code: 0
  }))
});

const { checkout, parseCheckout } = require("../checkout");

describe("checkout", () => {
  it("s", () => {
    jest.mock("../utils/gitCmd");
    expect(parseCheckout("@yo:foo")).toEqual({ branch: "foo", remote: "yo" });
  });

  it("s", () => {
    checkout("@yo:foo");
    console.log({ calls: require("../utils/gitCmd").mock });
  });
});
