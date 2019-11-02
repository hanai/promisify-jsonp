const pjsonp = require('../../index');

describe('basic timeout', function () {
    var defaultTimeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    });

    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = defaultTimeoutInterval;
    });

    it('should get timeout error', async function () {
        try {
            await pjsonp('/jsonp/hold10', {
                timeout: 5000
            });
            fail('Expected request timeout.');
        } catch (err) {
            expect(err.message).toBe('Timeout');
        }
    });

    it('should wait 10s', async function () {
        const res = await pjsonp('/jsonp/hold10', {
            timeout: 15000
        });
        expect(res.success).toBe(true);
    });
});
