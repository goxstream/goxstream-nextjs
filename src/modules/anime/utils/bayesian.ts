/**
 * Calculates the weighted rating using the Bayesian Average formula.
 * Formula: WR = (v * R + m * C) / (v + m)
 * 
 * @param voterCount (v) - The number of users who rated this anime
 * @param averageRating (R) - The current average rating of this anime
 * @param minVotesThreshold (m) - The minimum number of ratings required to be considered
 * @param globalAverageRating (C) - The global average rating across all anime in the database
 */
export function calculateBayesianAverage(
  voterCount: number,
  averageRating: number,
  minVotesThreshold: number = 50,
  globalAverageRating: number = 7.0
): number {
  if (voterCount <= 0 && minVotesThreshold <= 0) {
    return globalAverageRating;
  }
  
  const weightedRating = (voterCount * averageRating + minVotesThreshold * globalAverageRating) / (voterCount + minVotesThreshold);
  
  // Round to 2 decimal places
  return Math.round(weightedRating * 100) / 100;
}
