import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createAd } from "./api";
import type { Ad } from "./api";

export default function AdForm({
  onCreated,
  onBusyChange,
}: {
  onCreated: (ad: Ad) => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    const rawPrice = String(data.get("price") ?? "").trim();
    const price = Number(rawPrice);
    if (
      !title ||
      !description ||
      !rawPrice ||
      !Number.isFinite(price) ||
      price < 0 ||
      !file
    ) {
      setError(
        "Заполните все поля, укажите неотрицательную цену и добавьте фотографию.",
      );
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Выберите файл с изображением.");
      return;
    }
    data.set("title", title);
    data.set("description", description);
    data.set("price", String(price));
    data.set("image", file);
    setBusy(true);
    onBusyChange(true);
    setError("");
    try {
      const ad = await createAd(data);
      onBusyChange(false);
      onCreated(ad);
    } catch (cause) {
      setError(
        cause instanceof TypeError
          ? "Ошибка соединения. Проверьте список перед повторной отправкой: объявление могло сохраниться."
          : cause instanceof Error
            ? cause.message
            : "Не удалось отправить объявление.",
      );
      setBusy(false);
      onBusyChange(false);
    }
  }

  return (
    <form onSubmit={submit} className="ad-form">
      <p className="form-intro">
        Расскажите о вещи и добавьте фотографию. Все поля обязательны.
      </p>
      <fieldset disabled={busy}>
        <label>
          Название
          <input name="title" placeholder="Например, велосипед" required />
        </label>
        <label>
          Описание
          <textarea
            name="description"
            placeholder="Состояние, особенности и как с вами связаться"
            rows={4}
            required
          />
        </label>
        <label>
          Цена, сом
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            required
          />
        </label>
        <label className="upload-label">
          Фотография
          <span className="upload-box">
            {preview ? (
              <img src={preview} alt="Предпросмотр фотографии" />
            ) : (
              <span className="upload-icon" aria-hidden="true">
                ＋
              </span>
            )}
            <span>
              {file ? file.name : "Выберите фотографию"}
              <small>Изображение товара</small>
            </span>
            <input
              name="image"
              type="file"
              accept="image/*"
              required
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null);
                setError("");
              }}
            />
          </span>
        </label>
      </fieldset>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="button primary full-width"
        disabled={busy}
      >
        {busy ? "Публикуем…" : "Опубликовать объявление"}
      </button>
      <p className="form-note">
        Объявление будет видно всем посетителям доски.
      </p>
    </form>
  );
}
