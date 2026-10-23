import { useEffect, useState } from "react";
import AdCard, { AdImage } from "./AdCard";
import AdForm from "./AdForm";
import Modal from "./Modal";
import { formatPrice, getAds } from "./api";
import type { Ad } from "./api";

export default function App() {
  const [items, setItems] = useState<Ad[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("new");
  const [formOpen, setFormOpen] = useState(false);
  const [formBusy, setFormBusy] = useState(false);
  const [selected, setSelected] = useState<Ad | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    getAds(page, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setItems((previous) =>
          page === 1
            ? data.items
            : [
                ...previous,
                ...data.items.filter(
                  (ad) => !previous.some((old) => old.id === ad.id),
                ),
              ],
        );
        setTotal(data.total);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            cause instanceof TypeError
              ? "Нет соединения с сервером. Проверьте интернет и попробуйте ещё раз."
              : cause instanceof Error
                ? cause.message
                : "Не удалось загрузить объявления.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [page, revision]);

  const normalizedQuery = query.trim().toLocaleLowerCase("ru");
  const visible = items
    .filter((ad) =>
      `${ad.title} ${ad.description}`
        .toLocaleLowerCase("ru")
        .includes(normalizedQuery),
    )
    .sort((a, b) =>
      sort === "cheap"
        ? a.price - b.price
        : sort === "expensive"
          ? b.price - a.price
          : b.id - a.id,
    );

  function openForm() {
    setNotice("");
    setFormOpen(true);
  }

  function created(ad: Ad) {
    setFormOpen(false);
    setFormBusy(false);
    setQuery("");
    setSort("new");
    setPage(1);
    setRevision((value) => value + 1);
    setNotice(`Объявление «${ad.title}» опубликовано!`);
  }

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <a
            href={import.meta.env.BASE_URL}
            className="brand"
            aria-label="Рядом — главная"
          >
            <span className="brand-icon" aria-hidden="true">
              р
            </span>
            рядом<span className="brand-dot">.</span>
          </a>
          <span className="header-caption">Доска объявлений</span>
          <button className="button primary" onClick={openForm}>
            <span aria-hidden="true">＋</span> Подать объявление
          </button>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span /> Вещи находят новых хозяев
            </p>
            <h1>
              Хорошие вещи.
              <br />
              <span>Новые истории.</span>
            </h1>
            <p className="hero-description">
              Найдите то, что нужно, или продайте то,
              <br className="desktop-break" /> что больше не нужно вам.
            </p>
            <a className="hero-link" href="#listings">
              Смотреть объявления <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-orbit" />
            <div className="art-card back">
              <span>↗</span>
            </div>
            <div className="art-card front">
              <svg viewBox="0 0 160 130" fill="none">
                <path d="M28 49 80 21l52 28v57l-52 27-52-27Z" fill="#dfeea5" />
                <path
                  d="m28 49 52 28 52-28M80 77v56M54 35l52 28v26"
                  stroke="#175e45"
                  strokeWidth="4"
                  strokeLinejoin="round"
                />
                <path
                  d="m48 13 5-9m57 11-3-10M139 36l10-4"
                  stroke="#dfeea5"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
              <span>Для кого-то — та самая вещь</span>
            </div>
            <span className="art-spark">✳</span>
          </div>
        </section>

        <section
          id="listings"
          className="listings"
          aria-labelledby="listings-title"
          aria-busy={loading}
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Найдите своё</p>
              <h2 id="listings-title">
                Объявления <span className="count">{total}</span>
              </h2>
            </div>
            <button
              className="refresh-button"
              disabled={loading}
              onClick={() => {
                setPage(1);
                setRevision((value) => value + 1);
              }}
            >
              <span aria-hidden="true">↻</span> Обновить
            </button>
          </div>

          <div className="toolbar">
            <label className="search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m16 16 5 5" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Что вы ищете?"
                aria-label="Поиск по загруженным объявлениям"
              />
            </label>
            <label className="sort">
              <span className="sr-only">Сортировка</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="new">Сначала новые</option>
                <option value="cheap">Сначала дешевле</option>
                <option value="expensive">Сначала дороже</option>
              </select>
            </label>
          </div>

          {notice && (
            <p className="success" role="status">
              ✓ {notice}
            </p>
          )}
          {error && (
            <div className="error error-panel" role="alert">
              <p>{error}</p>
              <button
                className="button secondary"
                onClick={() => setRevision((value) => value + 1)}
              >
                Попробовать снова
              </button>
            </div>
          )}
          <div className="ads-grid">
            {visible.map((ad) => (
              <AdCard key={ad.id} ad={ad} onOpen={setSelected} />
            ))}
          </div>
          {loading && (
            <p className="loading" role="status">
              <span className="spinner" /> Загружаем объявления…
            </p>
          )}
          {!loading && !error && visible.length === 0 && (
            <div className="empty-state">
              <span aria-hidden="true">⌕</span>
              <h3>{query ? "Ничего не найдено" : "Пока нет объявлений"}</h3>
              <p>
                {query
                  ? "Попробуйте другое слово или загрузите больше объявлений."
                  : "Ваше объявление может стать первым."}
              </p>
              {query ? (
                <button
                  className="button secondary"
                  onClick={() => setQuery("")}
                >
                  Сбросить поиск
                </button>
              ) : (
                <button className="button primary" onClick={openForm}>
                  Подать объявление
                </button>
              )}
            </div>
          )}
          {!loading && !error && items.length < total && (
            <div className="load-more">
              <button
                className="button secondary"
                onClick={() => setPage((value) => value + 1)}
              >
                Показать ещё
              </button>
            </div>
          )}
          {items.length > 0 && (
            <p className="list-note">
              Загружено {items.length} из {total} · Поиск и сортировка по
              загруженным объявлениям
            </p>
          )}
        </section>

        <section className="sell-banner">
          <div>
            <span className="eyebrow">Освободите место для нового</span>
            <h2>У вашей вещи ещё всё впереди.</h2>
            <p>Добавьте фотографию, описание и цену. Готово!</p>
          </div>
          <button className="button primary" onClick={openForm}>
            Подать объявление <span aria-hidden="true">↗</span>
          </button>
        </section>
      </main>

      <footer className="container footer">
        <span className="footer-brand">рядом.</span>
        <p>Хорошим вещам — вторую историю.</p>
        <span>Доска объявлений</span>
      </footer>

      {formOpen && (
        <Modal
          title="Новое объявление"
          onClose={() => {
            if (!formBusy) setFormOpen(false);
          }}
        >
          <AdForm onCreated={created} onBusyChange={setFormBusy} />
        </Modal>
      )}
      {selected && (
        <Modal title={selected.title} onClose={() => setSelected(null)}>
          <div className="detail-image">
            <AdImage key={selected.id} ad={selected} />
          </div>
          <p className="detail-price">{formatPrice(selected.price)}</p>
          <h3 className="detail-label">Описание</h3>
          <p className="detail-description">{selected.description}</p>
          <p className="detail-id">Объявление № {selected.id}</p>
        </Modal>
      )}
    </>
  );
}
