import generateUserStats from '../lib/userStats/userData';

describe('generateUserStats', () => {
  it('returns user stats for a valid owner', async () => {
    const owner = 'yunwei37';
    const stats = await generateUserStats(owner);
    console.log(JSON.stringify(stats));
  });
  it('returns user stats for a valid owner', async () => {
    const owner = 'mosesxiaoqi';
    const stats = await generateUserStats(owner);
    console.log(JSON.stringify(stats));
  });
  it('throws an error for an invalid owner', async () => {
    const owner = 'invalid-owner';
    await expect(generateUserStats(owner)).rejects.toThrow();
  });
});