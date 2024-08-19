// export const SERVER_BASE_URL = "http://localhost:8080";
export const SERVER_BASE_URL = "http://192.168.165.55:8080";

export interface chatProps {
  role: "assistant" | "user" | "loading";
  content: string;
}
