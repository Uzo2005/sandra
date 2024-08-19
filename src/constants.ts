export const SERVER_BASE_URL = import.meta.env.DEV
  ? "http://localhost:8080"
  : "https://focusswiftlogistics.com.ng";

export interface chatProps {
  role: "assistant" | "user" | "loading";
  content: string;
}
