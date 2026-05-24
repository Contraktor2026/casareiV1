import { getSupabaseServerConfig } from "./config";

type QueryOptions = {
  select?: string;
  order?: string;
  limit?: number;
};

export function createSupabaseServerClient({ useServiceRole = false }: { useServiceRole?: boolean } = {}) {
  const config = getSupabaseServerConfig();
  const key = useServiceRole && config.serviceRoleKey ? config.serviceRoleKey : config.anonKey;

  async function request<T>(path: string, init?: RequestInit) {
    const response = await fetch(`${config.url}/rest/v1/${path}`, {
      ...init,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
        ...init?.headers
      },
      cache: "no-store"
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Supabase request failed with ${response.status}`);
    }

    return (await response.json()) as T;
  }

  return {
    from(table: string) {
      return {
        select<T>(options: QueryOptions = {}) {
          const params = new URLSearchParams();
          params.set("select", options.select ?? "*");
          if (options.order) params.set("order", options.order);
          if (options.limit) params.set("limit", String(options.limit));
          return request<T[]>(`${table}?${params.toString()}`);
        },
        insert<TBody, TResult = TBody>(body: TBody | TBody[]) {
          return request<TResult[]>(table, {
            method: "POST",
            body: JSON.stringify(body)
          });
        },
        update<TBody, TResult = TBody>(id: string, body: TBody) {
          return request<TResult[]>(`${table}?id=eq.${encodeURIComponent(id)}`, {
            method: "PATCH",
            body: JSON.stringify(body)
          });
        },
        delete(id: string) {
          return request<unknown[]>(`${table}?id=eq.${encodeURIComponent(id)}`, {
            method: "DELETE"
          });
        }
      };
    }
  };
}
