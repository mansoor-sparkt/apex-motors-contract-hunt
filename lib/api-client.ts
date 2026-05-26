/** Same-origin API calls that send the HttpOnly hunt_session cookie. */
export const apiFetch = (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> =>
  fetch(input, {
    ...init,
    credentials: "include",
  });
