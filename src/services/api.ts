const API_URL =
`${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

export async function fetcher<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = { ...options.headers } as Record<string, string>;

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = (await response.json()) as {
    data: T;
    message?: string;
  };
  if (!response.ok) {
    const messageForUser =
      typeof data.data === "object" &&
      data.data !== null &&
      "messageForUser" in data.data &&
      typeof data.data.messageForUser === "string"
        ? data.data.messageForUser
        : undefined;
    throw new Error(data.message || messageForUser || "An error occurred");
  }
  return data.data;
}

export async function uploadFile(
  file: File,
  folder: string = "uploads",
): Promise<{ key: string; url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  return fetcher<{ key: string; url: string }>("/uploads/single", {
    method: "POST",
    body: formData,
  });
}
