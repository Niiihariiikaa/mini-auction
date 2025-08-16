export function getUser() {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}
export function setUser(u){ localStorage.setItem('user', JSON.stringify(u)); }

