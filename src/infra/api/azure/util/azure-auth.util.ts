export function createAuthHeader(token: string): string {
  // Azure DevOps usa Basic auth com token como username e senha vazia
  const auth = btoa(`:${token}`);
  return `Basic ${auth}`;
}
