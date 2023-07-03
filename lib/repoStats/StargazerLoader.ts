// from https://github.com/seladb/StarTrack-js/blob/master/src/utils/StargazerLoader.js
import GitHubDataLoader from "./GitHubDataLoader";
import StarStatistics from "./StarStatistics";
import { StargazerResult } from "../../interfaces/starStats";

class StargazerLoader {
  async loadStargazers(
    username: string,
    repo: string,
  ): Promise<StargazerResult | null> {
    const stargazerData = await GitHubDataLoader.fetchStargazers(
      username,
      repo,
    );
    if (stargazerData === null) {
      return null;
    }
    return {
      username: username,
      repo: repo,
      stargazerData: stargazerData,
      stats: StarStatistics.calculateStatistics(stargazerData),
    };
  }
}

const stargazerLoader = new StargazerLoader();
Object.freeze(stargazerLoader);

export default stargazerLoader;
