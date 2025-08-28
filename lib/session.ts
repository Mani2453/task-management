export function handleSessionExpired(error: unknown) {
  if (typeof window !== 'undefined' && typeof error === 'object' && error !== null && 'sessionExpired' in error) {
    // Use a custom event to notify the app
    window.dispatchEvent(new CustomEvent('session-expired-toast'));
  }
}
