import { user, useAuth, fetchUser } from '@/composables/useAuth';
import 'jest';

describe('useAuth compsable', () => {
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

        it ('throws on failead login', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: 'Invalid credentials' }),
            });
            const { login } = useAuth();
            await expect(login('baduser', 'badpass')).rejects.toThrow('Invalid credentials');
            expect(user.value).toBeNull();
        });
    });

    describe('register', () => {
        it('sets user on successful register', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({}),
            });
            const { register } = useAuth();
            await register('newuser', 'newpass');
            expect(user.value).toEqual({ username: 'newuser' });
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/register'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ username: 'newuser', password: 'newpass' }),
                })
            );
        });

        it('throws on failed register', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: 'Username taken' }),
            });
            const { register } = useAuth();
            await expect(register('takenuser', 'pass')).rejects.toThrow('Username taken');
            expect(user.value).toBeNull();
        });
    });

    describe('logout', () => {
        it('clears user on logout', async () => {
            user.value = { username: 'loggedinuser' };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
            });
            const { logout } = useAuth();
            await logout();
            expect(user.value).toBeNull();
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/logout'),
                expect.objectContaining({
                    method: 'POST',
                })
            );
        });
    });

    describe('fetchUser', () => {
        it('sets user if authenticated', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ username: 'fetcheduser' }),
            });
            await fetchUser();
            expect(user.value).toEqual({ username: 'fetcheduser' });
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/me'),
                expect.objectContaining({
                    credentials: 'include',
                })
            );
        });

        it('clears user if not authenticated', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
            });
            await fetchUser();
            expect(user.value).toBeNull();
        });

        it('clears user on fetch error', async () => {
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
            await fetchUser();
            expect(user.value).toBeNull();
        });
    });
});