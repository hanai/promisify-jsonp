const pjsonp = require('../../index');
const { getUrl } = require('../utils');

describe('basic timeout', function () {

    it('should get timeout error', async function () {
        try {
            await pjsonp(getUrl('/jsonp/hold10'), {
                timeout: 5000
            });
            fail('Expected request timeout.');
        } catch (err) {
            expect(err.message).toBe('Timeout');
        }
    }, 30000);

    it('should wait 10s', async function () {
        const res = await pjsonp(getUrl('/jsonp/hold10'), {
            timeout: 15000
        });
        expect(res.success).toBe(true);
    }, 30000);
});
