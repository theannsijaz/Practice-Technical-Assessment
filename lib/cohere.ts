import { CohereClient } from "cohere-ai";

export function getCohereClient() {
  const apiKey = process.env.COHERE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing COHERE_API_KEY environment variable.");
  }
  return new CohereClient({ token: apiKey });
}
