import fetchGitHubData from '../lib/userStats/contributions';

describe('test contributions', () => {
    it('returns stargazer data for a valid repo', async () => {
        const res = await fetchGitHubData('yunwei37');
        console.log(res);
    }, 10000);
})