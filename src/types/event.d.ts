export interface Event {
  id: number;
  event: string;
  created_at: string;
  actor: { login: string };
  [key: string]: unknown;
}
