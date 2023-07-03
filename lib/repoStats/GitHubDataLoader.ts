import { Octokit } from "@octokit/rest";

const GITHUB_API_URL = "https://api.github.com/repos/{user}/{repo}/stargazers?per_page=100&page={page}";
const MAX_PAGES_WITHOUT_TOKEN = 30;
const batchSize = 5;

let progressHandler = (progress: number) => {
  console.log(`Progress: ${progress}%`);
}

let memoryStorage = {};

class GitHubDataLoader {
  private static generateRange(size: number, startAt = 0): number[] {
    return Array.from({length: size}, (_, i) => i + startAt);
  }

  private static storage = memoryStorage;

  private async fetchStargazerPage(user: string, repo: string, page: number): Promise<any> {
    const octokit = new Octokit({
      auth: process.env.REACT_APP_GITHUB_ACCESS_TOKEN,
    });
    const url = GITHUB_API_URL.replace("{page}", page.toString()).replace("{user}", user)
      .replace("{repo}", repo);
    console.log("url: " + url);
    const response = await octokit.request(url, {
      owner: user,
      repo: repo,
      headers: {
        Accept: "application/vnd.github.star+json",
        "X-GitHub-Api-Version": "2022-11-28",
      }
    })
    return response;
  }

  private appendStarData(starData: any[], starCount: number, page: any): number {
    for (let star of page.data) {
      starData.push({
        date: star.starred_at,
        count: starCount++,
      });
    }
    return starCount;
  }

  public async fetchStargazers(user: string, repo: string): Promise<any | null> {
    try {
      let starData: { x: string, y: number }[] = [];
      let starCount = 1;
      progressHandler(0);

      const firstPage = await this.fetchStargazerPage(user, repo, 1);
      const totalPages = Number(this.extractLastPageNumber(firstPage.headers.link));
      if (
        totalPages > MAX_PAGES_WITHOUT_TOKEN && !process.env.REACT_APP_GITHUB_ACCESS_TOKEN
      ) {
        throw Error(
          `Cannot load a repo with more than ${100 * MAX_PAGES_WITHOUT_TOKEN} stars without GitHub access token. Please click "GitHub Authentication" and provide one`
        );
      }
      starCount = this.appendStarData(starData, starCount, firstPage);

      progressHandler((1 / totalPages) * 100);
      let currentPage = 2;
      while (currentPage <= totalPages) {
        const currentBatchSize = Math.min(currentPage + batchSize, totalPages + 1) - currentPage;
        const pages = await Promise.all(
          GitHubDataLoader.generateRange(currentBatchSize, currentPage).map((num) =>
            this.fetchStargazerPage(user, repo, num)
          )
        );
        for (let i = 0; i < currentBatchSize; i++) {
          starCount = this.appendStarData(starData, starCount, pages[i]);
        }
        const sktippedPages = Math.floor(totalPages / 50.0);
        // for large repos, make the request smaller
        currentPage += (1 + sktippedPages) * currentBatchSize;
        progressHandler(((currentPage - 1) / totalPages) * 100);
        starCount += Math.floor(100 * currentBatchSize * sktippedPages);
      }

      return starData;
    } catch (error: any) {
      console.log("error: " + error);
      if (error.response === undefined) {
        throw error;
      }
      if (error.response.status === 404) {
        throw Error(`Repo ${user}/${repo} Not found`);
      } else if (error.response.status === 403) {
        throw Error(
          'API rate limit exceeded! Please click "GitHub Authentication" and provide GitHub access token to increase rate limit'
        );
      } else {
        throw Error(
          `Couldn't fetch stargazers data, error code ${error.response.status} returned` +
          (error.response.data.message && error.response.data.message !== ""
            ? `: ${error.response.data.message}`
            : "")
        );
      }
    }
  }

  private extractLastPageNumber(linkHeader: string | undefined): string {
    if (!linkHeader) {
      return "1";
    }
    const sections = linkHeader.split(",");

    for (const section of sections) {
      const [urlPart, namePart] = section.split(";");

      if (namePart.replace(/rel="(.*)"/, "$1").trim() === "last") {
        const lastPageNumber = urlPart.replace(/(.*)&page=(.*)/, "$2").trim().split("&owner=")[0];
        console.log(lastPageNumber);
        return lastPageNumber;
      }
    }
    return "1";
  }
}

const gitHubDataLoader = new GitHubDataLoader();
Object.freeze(gitHubDataLoader);

export default gitHubDataLoader;
