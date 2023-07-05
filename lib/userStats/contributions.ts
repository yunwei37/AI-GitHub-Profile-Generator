interface GitHubContributions {
    totalContributions: number;
    prCount: number;
    issueCount: number;
    latestPRs: string[];
    repoSet: string[];
};

async function fetchGitHubData(username: string, page = 1, per_page = 100): Promise<GitHubContributions> {
    const response = await fetch(`https://api.github.com/search/issues?q=author:${username}&page=${page}&per_page=${per_page}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        const data = await response.json();
        let prCount = 0;
        let issueCount = 0;
        let repoSet = new Set<string>();
        let latestPRs: string[] = [];

        data.items.forEach((item: any, index: number) => {
            if (page === 1 && index < 5 && item.pull_request) {
                latestPRs.push(item.title);
            }
            if (item.pull_request) {
                prCount++;
            } else {
                issueCount++;
            }
            const repo_url = item.repository_url.replace('https://api.github.com/repos/', '');
            repoSet.add(repo_url);
        });

        // Check if there are more pages to fetch and we haven't reached the 10-page limit
        const linkHeader = response.headers.get('Link');
        if (page < 8 && linkHeader && linkHeader.includes('rel="next"')) {
            const nextPageContributions = await fetchGitHubData(username, page + 1);
            prCount += nextPageContributions.prCount;
            issueCount += nextPageContributions.issueCount;
            latestPRs = latestPRs.concat(nextPageContributions.latestPRs);
            repoSet = new Set([...repoSet, ...nextPageContributions.repoSet]);
        }

        return {
            totalContributions: data.total_count,
            prCount,
            issueCount,
            latestPRs,
            repoSet: Array.from(repoSet),
        }
    }
}

export default fetchGitHubData;
export { fetchGitHubData };