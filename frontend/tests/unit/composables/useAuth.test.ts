import { user, useAuth, fetchUser } from '@/composables/useAuth';
import 'jest';

describe('useAuth compsable', () => {
    const mockFetch = global.fetch as jest.Mock;

    beforeEach(() => {
        global.fetch = jest.fn();
        user.value = null;
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('login', () => {
        it('sets user on successful login', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({}),
            });
            const { login } = useAuth();
            await login('testuser', 'testpass');
            expect(user.value).toEqual({ username: 'testuser' });
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/login'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ username: 'testuser', password: 'testpass' }),
                })
            );
        });
    });
})