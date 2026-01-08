import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const PostAdPage = ({ onAddListing, currentUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    type: 'wohnung',
    title: '',
    city: '',
    price: '',
    description: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).slice(0, 4); // Берем максимум 4 фото
    setFiles(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("Пожалуйста, войдите в аккаунт!");

    setLoading(true);
    const uploadedUrls = [];

    try {
      // 1. Загрузка фотографий в Supabase Storage
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${currentUser.id}/${Date.now()}-${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Получаем публичную ссылку на файл
        const { data: urlData } = supabase.storage
          .from('listing-images')
          .getPublicUrl(filePath);
        
        uploadedUrls.push(urlData.publicUrl);
      }

      // 2. Сохранение данных в таблицу listings
      const { data, error } = await supabase
        .from('listings')
        .insert([{
          ...formData,
          price: Number(formData.price),
          user_id: currentUser.id,
          images: uploadedUrls.length > 0 ? uploadedUrls : ["/assets/img/placeholder.jpg"]
        }])
        .select();

      if (error) throw error;

      if (data && data[0]) onAddListing(data[0]);
      alert("Объявление успешно опубликовано!");
      navigate(`/${formData.type}`);

    } catch (err) {
      console.error("Ошибка:", err.message);
      alert("Произошла ошибка: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-main">
      <section className="page-hero"><div className="container"><h1>Anzeige aufgeben</h1></div></section>
      <div className="container">
        <form onSubmit={handleSubmit} className="form-box">
          <h2>{currentUser ? `Hallo, ${currentUser.email}` : "Anmelden erforderlich"}</h2>
          
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
            <label>Fotos (max. 4)</label>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} />
            <p style={{fontSize: '0.8rem', color: '#666'}}>Выбрано файлов: {files.length}</p>
          </div>

          <div className="filter-field">
            <label>Stadt</label>
            <input id="city" required onChange={handleChange} placeholder="Ort" />
          </div>

          <div className="filter-field">
            <label>Preis / Lohn (€)</label>
            <input id="price" type="number" required onChange={handleChange} placeholder="0" />
          </div>

          <div className="filter-field">
            <label>Beschreibung</label>
            <textarea id="description" rows="4" required onChange={handleChange}></textarea>
          </div>

          <button type="submit" className="card-button" disabled={loading || !currentUser}>
            {loading ? "Wird hochgeladen..." : "Veröffentlichen"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default PostAdPage;