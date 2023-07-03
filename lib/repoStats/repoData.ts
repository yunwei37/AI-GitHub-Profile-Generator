import StargazerLoader from './StargazerLoader';
import { repoCache } from '../cache';
import { getRepoReadme } from './getRepoReadme';

function getPercentiles(data: any[], percentiles: number[]): any[] {
  // Sort data by count
  const sortedData = [...data].sort((a, b) => a.count - b.count);

  // Calculate indexes for each percentile
  const indexes = percentiles.map(p => Math.floor((p / 100) * (sortedData.length - 1)));

  // Get the corresponding data
  const percentileData = indexes.map(i => sortedData[i]);

  // Add tag for each percentile
  percentileData.forEach((d, i) => {
    if (d) {
      d.tag = `${percentiles[i]}%`;
    }
  });
  return percentileData;
}

function createResult(data: any) {
  return {
    name: data.name,
    full_name: data.full_name,
    private: data.private,
    owner: {
      login: data.owner.login,
      type: data.owner.type,
      site_admin: data.owner.site_admin
    },
    html_url: data.html_url,
    description: data.description,
    fork: data.fork,
    created_at: data.created_at,
    updated_at: data.updated_at,
    pushed_at: data.pushed_at,
    homepage: data.homepage,
    size: data.size,
    stargazers_count: data.stargazers_count,
    watchers_count: data.watchers_count,
    language: data.language,
    has_issues: data.has_issues,
    has_projects: data.has_projects,
    has_downloads: data.has_downloads,
    has_wiki: data.has_wiki,
    has_pages: data.has_pages,
    has_discussions: data.has_discussions,
    forks_count: data.forks_count,
    mirror_url: data.mirror_url,
    archived: data.archived,
    disabled: data.disabled,
    open_issues_count: data.open_issues_count,
    license: data.license,
    allow_forking: data.allow_forking,
    is_template: data.is_template,
    topics: data.topics,
    visibility: data.visibility,
    forks: data.forks,
    open_issues: data.open_issues,
    watchers: data.watchers,
    default_branch: data.default_branch,
    network_count: data.network_count,
    subscribers_count: data.subscribers_count,
  };
}

export default async function generateRepoStats(owner: string, repo: string) {
  // get the owner's GitHub stats
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
  if (!response.ok) {
    // if is 404, throw error
    if (response.status === 404) {
      throw new Error(`GitHub Repo not found for user ${owner} repo ${repo}`);
    } else {
      throw new Error(`GitHub API returned ${response.status} for user ${owner} repo ${repo}: ${response.json()}`);
    }
  }
  const data = await response.json();
  const readmeData = await getRepoReadme(owner, repo);
  // init a empty object
  let stargazerDataFull: any = {};
  const cacheStarData = repoCache.get(`${owner}/${repo}`);
  if (cacheStarData) {
    stargazerDataFull = cacheStarData;
  } else {
    try {
      stargazerDataFull = await StargazerLoader.loadStargazers(owner, repo);
      if (!stargazerDataFull) {
        throw new Error(`No stargazer data found for user ${owner} repo ${repo}`);
      }
      repoCache.set(`${owner}/${repo}`, stargazerDataFull);
    } catch (e) {
      console.error("stargazerDataFull error: " + (e as any).message);
      return createResult(data);
    }
  }

  // Get the 20%, 40%, 60%, 80% and 100% data
  const stargazerData = getPercentiles(stargazerDataFull.stargazerData, [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);

  // Create a new object with only the fields you need.
  return {
    ...createResult(data),
    stargazerData,
    readme: readmeData
  };
}

