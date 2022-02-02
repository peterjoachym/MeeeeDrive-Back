const request = require("supertest");
const app = require("../src/app");

describe("app", () => {
  it('GETs / and should obtain { foo: "bar" }', async () => {
    expect.assertions(1);
    const res = await request(app).get("/").expect(200);
    expect(res.body.foo).toEqual("Hello undefined api !");
  });
});
