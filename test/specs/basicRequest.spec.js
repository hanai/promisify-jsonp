const pjsonp = require('../../index');
const { getUrl } = require('../utils');

describe('basic request', function () {
    it('should get success', async function () {
        const res = await pjsonp(getUrl('/jsonp/basic'));
        expect(res.success).toBe(true);
    });
});
