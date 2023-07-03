export interface userStats {
    name: string;
    totalPRs: number;
    totalCommits: number;
    totalIssues: number;
    totalStars: number;
    contributedTo: number;
    rank: { level: string; percentile: number };
    mostStarredRepos?: string[];
}
