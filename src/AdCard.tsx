import { useState } from "react";
import { formatPrice, imageUrl } from "./api";
import type { Ad } from "./api";

export function AdImage({ ad }: { ad: Ad }) {
  const [failed, setFailed] = useState(false);
  const source = imageUrl(ad.image_url);
  return source && !failed ? (
    <img
      src={source}
      alt={ad.title}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    <div className="image-placeholder">
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="7" y="9" width="34" height="30" rx="6" />
        <circle cx="17" cy="19" r="3" />
        <path d="m8 34 10-10 8 8 6-6 9 9" />
      </svg>
      <span>Без фотографии</span>
    </div>
  );
}

export default function AdCard({
  ad,
  onOpen,
}: {
  ad: Ad;
  onOpen: (ad: Ad) => void;
}) {
  return (
    <article className="ad-card">
      <button
        className="card-button"
        onClick={() => onOpen(ad)}
        aria-label={`Открыть: ${ad.title}`}
      >
        <div className="card-image">
          <AdImage ad={ad} />
        </div>
        <div className="card-content">
          <p className="card-price">{formatPrice(ad.price)}</p>
          <h3>{ad.title}</h3>
          <p className="card-description">{ad.description}</p>
          <span className="card-link">
            Подробнее <span aria-hidden="true">↗</span>
          </span>
        </div>
      </button>
    </article>
  );
}
