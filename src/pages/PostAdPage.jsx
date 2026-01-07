import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PostAdPage = ({ onAddListing }) => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    type: 'wohnung',
    title: '',
    city: '',
    price: '',
    description: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setImages(prev => [...prev, reader.result].slice(0, 4));
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAd = {
      ...formData,
      id: Date.now(),
      image: images[0] || "/assets/img/placeholder.jpg",
      images: images,
      price: Number(formData.price)
    };
    onAddListing(newAd);
    navigate(`/${formData.type}`);
  };

  return (
    <main className="page-main">
      <section className="page-hero">
        <div className="container">
          <h1>Anzeige aufgeben</h1>
        </div>
      </section>

      <div className="container">
        {/* Форма теперь будет центрирована благодаря CSS классу form-box и контейнеру */}
        <form onSubmit={handleSubmit} className="form-box">
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
            <label>Fotos (max. 4)</label>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} />
            <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
              {images.map((img, i) => (
                <img key={i} src={img} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
              ))}
            </div>
          </div>

          <div className="filter-field">
            <label>Beschreibung</label>
            <textarea id="description" rows="4" required onChange={handleChange}></textarea>
          </div>

          <button type="submit" className="card-button" style={{ border: 'none', cursor: 'pointer' }}>
            Veröffentlichen
          </button>
        </form>
      </div>
    </main>
  );
};

export default PostAdPage;