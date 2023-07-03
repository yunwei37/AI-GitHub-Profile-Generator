import StargazerLoader from '../lib/repoStats/StargazerLoader';

describe('loadStargazers', () => {
  it('returns stargazer data for a valid repo', async () => {
    const username = 'yunwei37';
    const repo = 'Eunomia';
    const stargazerData = await StargazerLoader.loadStargazers(username, repo);
    expect(stargazerData).not.toBeNull();
    console.log(JSON.stringify(stargazerData));
  });

  it('returns null for an invalid repo', async () => {
    const username = 'yunwei37';
    const repo = 'invalid-repo';
    try {
        const stargazerData = await StargazerLoader.loadStargazers(username, repo);
    } catch (error) {
        expect(error).not.toBeNull();
    }
  });
});
