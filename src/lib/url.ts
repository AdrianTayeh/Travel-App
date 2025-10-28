// src/lib/url.ts
export type Updates = Record<string, string | number | boolean>;

export function buildSearchUrl(
  searchParams: URLSearchParams | string,
  updates: Updates,
  options?: { defaultPageSize?: number }
): string {
  const defaultPageSize = options?.defaultPageSize ?? 15;
  const newSearchParams = new URLSearchParams(
    typeof searchParams === "string" ? searchParams : searchParams.toString()
  );

  Object.entries(updates).forEach(([key, value]) => {
    const isDefaultPage = key === "page" && Number(value) === 1;
    const isDefaultPageSize =
      key === "pageSize" && Number(value) === defaultPageSize;

    if (
      value === "" ||
      value === false ||
      value === "All" ||
      isDefaultPage ||
      isDefaultPageSize
    ) {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, value.toString());
    }
  });

  const qs = newSearchParams.toString();
  return qs ? `?${qs}` : "";
}
