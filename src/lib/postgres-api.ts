export type ApiResult<T = unknown> = {
  data: T | null;
  error: { message: string } | null;
};

export async function apiGet<T>(url: string): Promise<ApiResult<T>> {
  const response = await fetch(url);
  const payload = await response.json();

  if (!response.ok) {
    return {
      data: null,
      error: { message: payload.error ?? "No se pudo cargar la informacion." },
    };
  }

  return { data: payload.data as T, error: null };
}

export async function apiPost<T>(url: string, body: unknown): Promise<ApiResult<T>> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json();

  if (!response.ok) {
    return {
      data: null,
      error: { message: payload.error ?? "No se pudo guardar la informacion." },
    };
  }

  return { data: payload.data as T, error: null };
}
