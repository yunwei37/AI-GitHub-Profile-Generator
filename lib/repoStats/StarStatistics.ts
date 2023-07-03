interface StarData {
  date: string;
  count: number;
}

interface DateFilter {
  start?: string;
  end?: string;
}

class StarStatistics {
  private calculateDaysBetweenDates(start: Date, end: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    return Math.round(Math.abs((start.getTime() - end.getTime()) / oneDay));
  }

  private filterStarDataByDateRange(starData: StarData[], dateFilter?: DateFilter): StarData[] {
    if (dateFilter?.start && dateFilter?.end) {
      const startDate = new Date(dateFilter.start);
      const endDate = new Date(dateFilter.end);
      return starData.filter(data => {
        const date = new Date(data.date);
        return date >= startDate && date <= endDate;
      });
    }
    return starData;
  }

  public calculateStatistics(starData: StarData[]): any {
    if (starData.length === 0) {
      return {
        "Total stars": 0,
        "Total days": 0,
        "Average stars per day": 0,
        "Average days per star": 0,
        "Days with stars": 0,
        "Max stars in a day": 0,
        "Day with max stars": 0,
      };
    }

    const starDates = starData.map(data => new Date(data.date));
    const firstStarDate = starDates[0];
    const lastStarDate = starDates[starDates.length - 1];
    const totalDays = this.calculateDaysBetweenDates(firstStarDate, lastStarDate);
    const totalStars = starDates.length;
    const averageStarsPerDay = (totalStars / totalDays).toFixed(3);
    const averageDaysPerStar = (totalDays / totalStars).toFixed(3);

    let daysWithStars = 0;
    let maxStarsInADay = 0;
    let dayWithMaxStars = firstStarDate;

    starDates.reduce((prevDate, currDate) => {
      const daysBetween = this.calculateDaysBetweenDates(prevDate, currDate);
      if (daysBetween > 0) {
        daysWithStars++;
        if (daysBetween > maxStarsInADay) {
          maxStarsInADay = daysBetween;
          dayWithMaxStars = currDate;
        }
      }
      return currDate;
    }, firstStarDate);

    return {
      "Total stars": totalStars,
      "Total days": totalDays,
      "Average stars per day": averageStarsPerDay,
      "Average days per star": averageDaysPerStar,
      "Days with stars": daysWithStars,
      "Max stars in a day": maxStarsInADay,
      "Day with max stars": dayWithMaxStars.toISOString().slice(0, 10),
    };
  }

  public getStatistics(starData: StarData[], dateFilter?: DateFilter): any {
    const filteredStarData = this.filterStarDataByDateRange(starData, dateFilter);
    return this.calculateStatistics(filteredStarData);
  }
}

const starStatistics = new StarStatistics();
Object.freeze(starStatistics);

export default starStatistics;
