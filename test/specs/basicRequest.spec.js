const pjsonp = require('../../index');

describe("basic request", function () {
    it("can get success", async function () {
        const res = await pjsonp('/jsonp/basic');
        expect(res.success).toBe(true);
    });
});
