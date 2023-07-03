import { userCache } from '../cache';
import {calculateRank} from './calculateRank';

const GRAPHQL_REPOS_FIELD = `
  repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}, after: $after) {
    totalCount
    nodes {
      name
      stargazers {
        totalCount
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
`;

const GRAPHQL_REPOS_QUERY = `
  query userInfo($login: String!, $after: String) {
    user(login: $login) {
      ${GRAPHQL_REPOS_FIELD}
    }
  }
`;

const GRAPHQL_STATS_QUERY = `
  query userInfo($login: String!, $after: String) {
    user(login: $login) {
      name
      login
      contributionsCollection {
        totalCommitContributions
      }
      repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
        totalCount
      }
      pullRequests(first: 1) {
        totalCount
      }
      openIssues: issues(states: OPEN) {
        totalCount
      }
      closedIssues: issues(states: CLOSED) {
        totalCount
      }
      followers {
        totalCount
      }
      ${GRAPHQL_REPOS_FIELD}
    }
  }
`;

interface Variables {
  login: string;
  first: number;
  after: string | null;
}

const fetcher = async (variables: Variables, token: string) => {
  const query = !variables.after ? GRAPHQL_STATS_QUERY : GRAPHQL_REPOS_QUERY;
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
};

const statsFetcher = async (username: string) => {
  let stats;
  let hasNextPage = true;
  let endCursor = null;
  const token = process.env.REACT_APP_GITHUB_ACCESS_TOKEN;
  if (!token) {
    throw Error("token is required");
  }

  while (hasNextPage) {
    const variables: Variables = { login: username, first: 100, after: endCursor };
    let res = await fetcher(variables, token);

    if (res.errors) {
      console.error(res.errors);
      return;
    }

    const repoNodes = res.data.user.repositories.nodes;
    if (!stats) {
      stats = res;
    } else {
      stats.data.user.repositories.nodes.push(...repoNodes);
    }

    hasNextPage = repoNodes.length === repoNodes.filter(
      (node: { stargazers: { totalCount: number; }; }) => node.stargazers.totalCount !== 0,
    ).length && res.data.user.repositories.pageInfo.hasNextPage;
    endCursor = res.data.user.repositories.pageInfo.endCursor;
  }

  return stats;
};

const fetchStats = async (username: string): Promise<userStats> => {
  if (!username) throw new Error("Username is required");

  const stats: userStats = {
    name: "",
    totalPRs: 0,
    totalCommits: 0,
    totalIssues: 0,
    totalStars: 0,
    contributedTo: 0,
    rank: { level: "C", percentile: 100 },
  };

  let res = await statsFetcher(username);
  if (!res) {
    console.error("Failed to fetch stats");
    throw Error("Failed to fetch stats");
  }
  if (res.errors) {
    console.error(res.errors);
    throw Error("Failed to fetch stats with errors: " + JSON.stringify(res.errors));
  }

  const user = res.data.user;
  if (!user) {
    console.error("Failed to fetch user");
    throw Error("Failed to fetch user");
  }

  stats.name = user.name || user.login;
  stats.totalCommits = user.contributionsCollection.totalCommitContributions;
  stats.totalPRs = user.pullRequests.totalCount;
  stats.totalIssues = user.openIssues.totalCount + user.closedIssues.totalCount;
  stats.contributedTo = user.repositoriesContributedTo.totalCount;

  stats.totalStars = user.repositories.nodes.reduce((prev: any, curr: { stargazers: { totalCount: any; }; }) => {
    return prev + curr.stargazers.totalCount;
  }, 0);

  const mostStarredRepos = user.repositories.nodes
  .sort((a: { stargazers: { totalCount: number; }; }, b: { stargazers: { totalCount: number; }; }) => b.stargazers.totalCount - a.stargazers.totalCount)
  .slice(0, 8)
  .map((repo: { name: any; }) => repo.name);

  stats.mostStarredRepos = mostStarredRepos;

  stats.rank = calculateRank({
    all_commits: false,
    commits: stats.totalCommits,
    prs: stats.totalPRs,
    issues: stats.totalIssues,
    repos: user.repositories.totalCount,
    stars: stats.totalStars,
    followers: user.followers.totalCount,
  });

  return stats;
};

export { fetchStats };
export default fetchStats;
