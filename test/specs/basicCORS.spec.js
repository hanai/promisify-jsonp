const pjsonp = require('../../index');
const { getUrl } = require('../utils');

describe('basic CORS', function () {
    beforeAll(() => {
        return pjsonp(getUrl('/jsonp/add_cookie'));
    });

    afterAll(() => {
        return pjsonp(getUrl('/jsonp/remove_cookie'));
    });

    it('should has cookie', async function () {
        const res = await pjsonp(getUrl('/jsonp/cors'), { params: { crossOrigin: 'null' } });
        const { success, cookies } = res;

        return Promise.all([
            expect(success).toBe(true),
            expect(cookies.secret).toBe('12345678')
        ]);
    });

    it('should has cookie', async function () {
        const res = await pjsonp(getUrl('/jsonp/cors'), {
            crossOrigin: 'use-credentials',
            params: { crossOrigin: 'use-credentials' }
        });

        const { success, cookies } = res;

        return Promise.all([
            expect(success).toBe(true),
            expect(cookies.secret).toBe('12345678')
        ]);
    });

    it('should not has cookie', async function () {
        const res = await pjsonp(getUrl('/jsonp/cors'), {
            crossOrigin: 'anonymous',
            params: { crossOrigin: 'anonymous' }
        });

        const { success, cookies } = res;

        return Promise.all([
            expect(success).toBe(true),
            expect(cookies.secret).toBeFalsy()
        ]);
    });

    it('should not has cookie', async function () {
        const res = await pjsonp(getUrl('/jsonp/cors'), {
            crossOrigin: '',
            params: { crossOrigin: '' }
        });

        const { success, cookies } = res;

        return Promise.all([
            expect(success).toBe(true),
            expect(cookies.secret).toBeFalsy()
        ]);
    });
});
