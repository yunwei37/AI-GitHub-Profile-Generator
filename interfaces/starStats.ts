// This interface defines the shape of the data for a single stargazer
export interface StargazerData {
    date: string; // The date the stargazer starred the repository
    count: number; // The number of stars the repository had on that date
}

// This interface defines the shape of the result object returned by the API
export interface StargazerResult {
    username: string; // The username of the repository owner
    repo: string; // The name of the repository
    stargazerData: StargazerData[]; // An array of stargazer data objects
    stats: any; // The statistics for the repository (this should be replaced with the actual type)
}
