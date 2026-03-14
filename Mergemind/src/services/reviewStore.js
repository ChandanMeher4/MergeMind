import crypto from "crypto";

// In-memory store for full review analysis results
// Structure: { id: string, userId: string|number, repo: string, prNumber: number, diffText: string, issues: array, reviewedAt: string }
const reviews = [];

export function saveReview(data, userId) {
  const reviewData = {
    id: crypto.randomUUID(),
    userId,
    ...data,
    reviewedAt: new Date().toISOString(),
  };
  reviews.push(reviewData);
  return reviewData;
}

export function getAllReviews(userId) {
  // Return list with minimal data (no full diff string)
  return reviews
    .filter(r => r.userId == userId)
    .map(r => ({
      id: r.id,
      repo: r.repo,
      prNumber: r.prNumber,
      issueCount: r.issues?.length || 0,
      reviewedAt: r.reviewedAt
    }))
    .sort((a, b) => new Date(b.reviewedAt) - new Date(a.reviewedAt));
}

export function getReviewById(id, userId) {
  return reviews.find(r => r.id === id && r.userId == userId);
}
