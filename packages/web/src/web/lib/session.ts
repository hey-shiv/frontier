export function getSessionId(): string {
  const key = "frontier_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `sess_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    localStorage.setItem(key, id);
  }
  return id;
}
