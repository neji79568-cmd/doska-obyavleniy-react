export const API_URL = "https://inai-col1.fishrungames.com";

export interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string | null;
}

export interface AdsResponse {
  items: Ad[];
  total: number;
  page: number;
  limit: number;
}

export async function getAds(
  page: number,
  signal: AbortSignal,
): Promise<AdsResponse> {
  const response = await fetch(`${API_URL}/ads?page=${page}&limit=12`, {
    signal,
  });
  if (!response.ok)
    throw new Error("Не удалось загрузить объявления. Попробуйте ещё раз.");
  return response.json();
}

export async function createAd(data: FormData): Promise<Ad> {
  // The browser sets multipart/form-data and its boundary automatically.
  const response = await fetch(`${API_URL}/ads`, {
    method: "POST",
    body: data,
  });
  if (!response.ok) {
    throw new Error(
      response.status === 422
        ? "Проверьте название, описание, цену и фотографию."
        : "Не удалось опубликовать объявление. Попробуйте ещё раз.",
    );
  }
  return response.json();
}

export function imageUrl(path: string | null): string | undefined {
  if (!path) return undefined;
  try {
    const url = new URL(path, API_URL);
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export function formatPrice(price: number): string {
  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(price)} сом`;
}
