import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const PostAdPage = ({ currentUser, t }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    type: 'wohnung', title: '', city: '', address: '', price: '', description: '', kontaktdaten: '', images: []
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchListing = async () => {
        const { data } = await supabase.from('listings').select('*').eq('id', id).single();
        if (data) setFormData({ ...data });
      };
      fetchListing();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setFiles(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let uploadedUrls = [...formData.images];
      for (const file of files) {
        const filePath = `${Date.now()}-${file.name}`;
        await supabase.storage.from('listing-images').upload(filePath, file);
        const { data } = supabase.storage.from('listing-images').getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      }

      const finalData = {
        ...formData,
        images: uploadedUrls,
        price: Number(formData.price),
        user_id: currentUser.id
      };

      if (isEditMode) {
        await supabase.from('listings').update(finalData).eq('id', id);
      } else {
        await supabase.from('listings').insert([finalData]);
      }
      navigate('/my-listings');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-main">
      <div className="container">
        <div className="form-box">
          <h2>{isEditMode ? t.form_title_edit : t.form_title_new}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="filter-field">
              <label>{t.label_cat}</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="wohnung">Wohnung</option>
                <option value="job">Job</option>
                <option value="dating">Dating</option>
              </select>
            </div>
            <div className="filter-field">
              <label>{t.label_title}</label>
              <input name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="filter-field">
              <label>{t.label_city}</label>
              <input name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div className="filter-field">
              <label style={{ color: '#3498db', fontWeight: 'bold' }}>{t.label_address}</label>
              <input name="address" value={formData.address} onChange={handleChange} placeholder="z.B. Alexanderplatz, Berlin" />
            </div>
            <div className="filter-field">
              {/* Если выбран дейтинг — пишем "Возраст", иначе — стандартную "Цену" */}
              <label>{formData.type === 'dating' ? 'Alter (Jahre)' : t.label_price}</label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder={formData.type === 'dating' ? 'z.B. 25' : ''}
              />
            </div>
            <div className="filter-field">
              <label>{t.label_desc}</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="5" required />
            </div>
            <div className="filter-field">
              <label>Kontaktdaten</label>
              <textarea
                name="kontaktdaten"
                value={formData.kontaktdaten}
                onChange={handleChange}
                rows={3}
                placeholder="Telefon, E-Mail, WhatsApp…"
              />
            </div>
            <div className="filter-field">
              <label>{t.photos}</label>
              <input type="file" multiple onChange={handleFileChange} />
            </div>
            <button type="submit" className="card-button" disabled={loading}>
              {loading ? "..." : (isEditMode ? t.btn_save : t.btn_publish)}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default PostAdPage;