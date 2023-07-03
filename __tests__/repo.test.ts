import generateRepoStat from '../lib/repoStats/repoData';

describe('loadStargazers', () => {
  it('returns stargazer data for a valid repo', async () => {
    const username = 'yunwei37';
    const repo = 'Eunomia';
    const stargazerData = await generateRepoStat(username, repo);
    expect(stargazerData).not.toBeNull();
    console.log(JSON.stringify(stargazerData));
  }, 10000);

  xit('returns stargazer data for a large valid repo', async () => {
    const username = 'WasmEdge';
    const repo = 'WasmEdge';
    const stargazerData = await generateRepoStat(username, repo);
    expect(stargazerData).not.toBeNull();
    console.log(JSON.stringify(stargazerData));
  }, 10000);

  it('returns null for an invalid repo', async () => {
    const username = 'yunwei37';
    const repo = 'invalid-repo';
    try {
        const stargazerData = await generateRepoStat(username, repo);
    } catch (error) {
        expect(error).not.toBeNull();
    }
  }, 10000);
});
