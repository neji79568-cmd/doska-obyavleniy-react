import { useEffect, useState, type FormEvent } from 'react';
import { createRoot } from 'react-dom/client';

type Ad = { id: number; title: string; description: string; price: number; image_url: string | null };
const api = 'https://inai-col1.fishrungames.com';

function App() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [message, setMessage] = useState('Загрузка...');
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const response = await fetch(api + '/ads');
      if (!response.ok) throw new Error();
      setAds((await response.json()).items);
      setMessage('');
    } catch {
      setMessage('Ошибка загрузки объявлений');
    }
  }

  useEffect(() => { load(); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    try {
      const response = await fetch(api + '/ads', { method: 'POST', body: data });
      if (!response.ok) throw new Error();
      const ad: Ad = await response.json();
      setAds(items => [ad, ...items]);
      form.reset();
      setMessage('Объявление добавлено');
    } catch {
      setMessage('Ошибка отправки объявления');
    } finally {
      setBusy(false);
    }
  }

  return <>
    <h1>Доска объявлений</h1>
    <form onSubmit={submit}>
      <p><label>Название <input name="title" required /></label></p>
      <p><label>Описание <textarea name="description" required /></label></p>
      <p><label>Цена <input name="price" type="number" min="0" step="0.01" required /></label></p>
      <p><label>Фото <input name="image" type="file" accept="image/*" required /></label></p>
      <button disabled={busy}>{busy ? 'Отправка...' : 'Добавить'}</button>
    </form>
    <p role="status">{message}</p>
    <h2>Объявления</h2>
    <button onClick={load}>Обновить</button>
    {ads.map(ad => <article key={ad.id}>
      <h3>{ad.title}</h3>
      {ad.image_url && <img src={new URL(ad.image_url, api).href} width="200" alt={ad.title} />}
      <p>{ad.description}</p>
      <p>{ad.price} сом</p>
      <hr />
    </article>)}
  </>;
}

createRoot(document.getElementById('root')!).render(<App />);
