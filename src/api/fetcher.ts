export async function fetcher(
  url: string,
  init?: RequestInit,
  serverCookie?: string
) {
  const response = await fetch(`http://localhost:3000${url}`, {
    ...init,
  });

  if (!response.ok) {
    const res = await response.json();

    throw new Error(res.message, {
      cause: {
        code:
          response.status === 401 || response.status === 403
            ? response.status
            : "default",
      },
    });
  }

  return response;
}
