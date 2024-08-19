export const SERVER_BASE_URL = import.meta.env.DEV
  ? "http://localhost:8080"
  : "http://34.239.137.104";

export interface chatProps {
  role: "assistant" | "user" | "loading";
  content: string;
}

console.log();
