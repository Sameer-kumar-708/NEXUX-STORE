/** Safe in-app path after login (blocks open redirects). */
export function safePostLoginPath(next: string | null): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return '/'
  }
  return next
}
