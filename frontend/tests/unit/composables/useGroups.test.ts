import { groups, fetchMyGroups, fetchGroup, createGroup, joinGroup, Group } from '@/composables/useGroups';
import 'jest';

describe('useGroups composable', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
        groups.value = [];
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('fetchMyGroups', () => {
        it('sets groups on success', async () => {
            const mockGroups: Group[] = [
                { id: '1', name: 'A', sport: 'Soccer', admin: { id: '10', username: 'admin' }, users: [] }
            ];
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockGroups,
            });
            await fetchMyGroups();
            expect(groups.value).toEqual(mockGroups);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/my'),
                expect.objectContaining({ credentials: 'include' })
            );
        });

        it('sets groups to empty array on failure', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
            await fetchMyGroups();
            expect(groups.value).toEqual([]);
        });

        it('sets groups to empty array on fetch error', async () => {
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
            await fetchMyGroups();
            expect(groups.value).toEqual([]);
        });
    });

    describe('fetchGroup', () => {
        it('returns group on success', async () => {
            const mockGroup: Group = { id: '1', name: 'A', sport: 'Soccer', admin: { id: '10', username: 'admin' }, users: [] };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockGroup,
            });
            const result = await fetchGroup('1');
            expect(result).toEqual(mockGroup);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/1'),
                expect.objectContaining({ credentials: 'include' })
            );
        });

        it('returns null on failure', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
            const result = await fetchGroup('1');
            expect(result).toBeNull();
        });

        it('returns null on fetch error', async () => {
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
            const result = await fetchGroup('1');
            expect(result).toBeNull();
        });
    });

    describe('createGroup', () => {
        it('returns group and updates groups on success', async () => {
            const mockGroup: Group = { id: '2', name: 'B', sport: 'Tennis', admin: { id: '11', username: 'admin2' }, users: [] };
            (global.fetch as jest.Mock)
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockGroup,
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => [mockGroup],
                });
            const result = await createGroup('B', 'Tennis');
            expect(result).toEqual(mockGroup);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/groups'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ name: 'B', sport: 'Tennis' }),
                })
            );
        });

        it('returns null on failure', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
            const result = await createGroup('C', 'Basketball');
            expect(result).toBeNull();
        });

        it('returns null on fetch error', async () => {
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
            const result = await createGroup('C', 'Basketball');
            expect(result).toBeNull();
        });
    });

    describe('joinGroup', () => {
        it('returns ok true on success', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
            const result = await joinGroup('1');
            expect(result).toEqual({ ok: true });
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/1/join'),
                expect.objectContaining({ method: 'POST', credentials: 'include' })
            );
        });

        it('returns ok false and message on failure', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: 'Already joined' }),
            });
            const result = await joinGroup('1');
            expect(result).toEqual({ ok: false, message: 'Already joined' });
        });

        it('returns ok false and default message if no message', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                json: async () => ({}),
            });
            const result = await joinGroup('1');
            expect(result).toEqual({ ok: false, message: 'Failed to join group' });
        });

        it('returns ok false and network error on fetch error', async () => {
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
            const result = await joinGroup('1');
            expect(result).toEqual({ ok: false, message: 'Network error' });
        });
    });
});