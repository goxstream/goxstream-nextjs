/**
 * Calculates the Cosine Similarity between two numeric vectors.
 * Formula: CosineSimilarity = (A . B) / (||A|| * ||B||)
 * 
 * @param vectorA - Array of numbers representing the feature vector of object A
 * @param vectorB - Array of numbers representing the feature vector of object B
 * @returns The similarity value between 0.0 (no similarity) and 1.0 (identical)
 */
export function calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length || vectorA.length === 0) {
    return 0;
  }

  let dotProduct = 0;
  let normASquared = 0;
  let normBSquared = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    normASquared += vectorA[i] * vectorA[i];
    normBSquared += vectorB[i] * vectorB[i];
  }

  const normA = Math.sqrt(normASquared);
  const normB = Math.sqrt(normBSquared);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  const similarity = dotProduct / (normA * normB);
  
  // Round to 4 decimal places
  return Math.round(similarity * 10000) / 10000;
}
