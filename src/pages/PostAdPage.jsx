import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const PostAdPage = ({ onAddListing, currentUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'wohnung',
    title: '',
    city: '',
    price: '',
    description: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert("Сначала войдите через Google!");
      return;
    }

    setLoading(true);

    // Отправляем данные в таблицу 'listings' в Supabase
    const { data, error } = await supabase
      .from('listings')
      .insert([
        {
          type: formData.type,
          title: formData.title,
          city: formData.city,
          price: Number(formData.price),
          description: formData.description,
          user_id: currentUser.id, // Привязываем объявление к вошедшему юзеру
          images: ["/assets/img/placeholder.jpg"] // Пока без загрузки фото, используем заглушку
        }
      ])
      .select();

    setLoading(false);

    if (error) {
      alert("Ошибка при сохранении: " + error.message);
    } else {
      // Обновляем список в App.jsx и уходим на страницу категории
      onAddListing(data[0]);
      navigate(`/${formData.type}`);
    }
  };

  return (
    <main className="page-main">
      <section className="page-hero"><div className="container"><h1>Anzeige aufgeben</h1></div></section>
      <div className="container">
        <form onSubmit={handleSubmit} className="form-box">
          <h2>{currentUser ? `Hallo, ${currentUser.email}` : "Bitte einloggen"}</h2>
          <div className="filter-field">
            <label>Kategorie</label>
            <select id="type" value={formData.type} onChange={handleChange}>
              <option value="wohnung">Wohnung</option>
              <option value="job">Job</option>
              <option value="dating">Dating</option>
            </select>
          </div>
          <div className="filter-field">
            <label>Titel</label>
            <input id="title" required onChange={handleChange} placeholder="Was bietest du an?" />
          </div>
          <div className="filter-field">
            <label>Stadt</label>
            <input id="city" required onChange={handleChange} placeholder="Ort" />
          </div>
          <div className="filter-field">
            <label>Preis / Lohn (€)</label>
            <input id="price" type="number" onChange={handleChange} placeholder="0" />
          </div>
          <div className="filter-field">
            <label>Beschreibung</label>
            <textarea id="description" rows="4" required onChange={handleChange}></textarea>
          </div>
          <button type="submit" className="card-button" disabled={loading}>
            {loading ? "Wird gespeichert..." : "Veröffentlichen"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default PostAdPage;