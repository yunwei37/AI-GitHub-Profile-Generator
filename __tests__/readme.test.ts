import { getRepoReadme } from '../lib/repoStats/getRepoReadme';

describe('getRepoReadme', () => {
  it('returns the README data for a valid repo', async () => {

    const readmeData = await getRepoReadme('yunwei37', 'Eunomia');
    console.log(readmeData);
  });

  it('throws an error if the README is not found on the main or master branch', async () => {
    const owner = 'yunwei37';
    const repo = 'invalid-repo';
    try {
      const readmeData = await getRepoReadme(owner, repo);
    }
    catch (error) {
      expect(error).not.toBeNull();
    }
  });
});
