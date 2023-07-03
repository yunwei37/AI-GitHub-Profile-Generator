import { fetchStats } from '../lib/userStats/statsFetcher';

describe('fetchStats', () => {
  xit('returns an object with the expected properties', async () => {
    const stats = await fetchStats('yunwei37');
    console.log(JSON.stringify(stats));
    expect(stats).toHaveProperty('totalCommits');
    expect(stats).toHaveProperty('totalPRs');
    expect(stats).toHaveProperty('totalIssues');
    expect(stats).toHaveProperty('totalStars');
    expect(stats).toHaveProperty('rank');
  });
});
