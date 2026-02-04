import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import imageCompression from 'browser-image-compression';
import { bundeslaender } from '../data/bundeslaender';

const PostImmoSearch = ({ currentUser, t }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    type: 'wohnung',
    title: '',
    city: '',
    bundesland: '',
    budget: '',
    description: '',
    kontaktdaten: '',
    images: []
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Datenschutz
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // ⬇️ Сжатие изображений
  const [compressing, setCompressing] = useState(false);
  const [compressProgress, setCompressProgress] = useState(0);

  useEffect(() => {
    if (isEditMode) {
      const fetchListing = async () => {
        const { data } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single();
        if (data) {
          setFormData({
            ...data,
            budget: data.price ?? ''
          });
        }
      };
      fetchListing();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compressImage = async (file, index, total) => {
    const options = {
      maxSizeMB: 0.4,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      onProgress: (p) => {
        const overall = Math.round(((index + p / 100) / total) * 100);
        setCompressProgress(overall);
      }
    };

    try {
      return await imageCompression(file, options);
    } catch (err) {
      console.error('Ошибка сжатия:', err);
      return file;
    }
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 6) {
      alert('Можно загрузить максимум 6 фотографий');
      return;
    }

    setCompressing(true);
    setCompressProgress(0);

    const compressed = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      if (file.size > 5 * 1024 * 1024) {
        alert(`Файл ${file.name} слишком большой`);
        continue;
      }

      const compressedFile = await compressImage(file, i, selectedFiles.length);
      compressed.push(compressedFile);
    }

    setFiles(compressed);
    setCompressing(false);
    setCompressProgress(100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert('Bitte einloggen oder registrieren, um eine Anzeige zu erstellen');
      return;
    }

    if (!privacyAccepted) return;

    setLoading(true);

    try {
      const finalData = {
        type: 'wohnung',
        intent: 'search', // ✅ КЛЮЧЕВАЯ ПРАВКА
        title: formData.title,
        city: formData.city,
        bundesland: formData.bundesland,
        description: formData.description,
        kontaktdaten: formData.kontaktdaten,
        price: Number(formData.budget),
        images: [],
        user_id: currentUser.id
      };

      if (isEditMode && id) {
        const { error } = await supabase
          .from('listings')
          .update(finalData)
          .eq('id', id);

        if (error) {
          alert(error.message);
          return;
        }
      } else {
        const { error } = await supabase
          .from('listings')
          .insert([finalData]);

        if (error) {
          alert(error.message);
          return;
        }
      }

      navigate('/my-listings', {
        state: { published: true }
      });

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
              <label>{t.label_title}</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength={52}
                required
              />
            </div>

            <div className="filter-field">
              <label>{t.label_city}</label>
              <input name="city" value={formData.city} onChange={handleChange} required />
            </div>

            <div className="filter-field">
              <label>{t.label_bundesland}</label>
              <select
                name="bundesland"
                value={formData.bundesland}
                onChange={handleChange}
                required
              >
                <option value="">{t.select_bundesland}</option>
                {bundeslaender.map(bl => (
                  <option key={bl.value} value={bl.value}>{bl.label}</option>
                ))}
              </select>
            </div>

            <div className="filter-field">
              <label>{t.label_budget}</label>
              <input
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                required
              />
            </div>

            <div className="filter-field">
              <label>{t.label_desc}</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
              />
            </div>

            <div className="filter-field">
              <label>Kontaktdaten</label>
              <textarea
                name="kontaktdaten"
                value={formData.kontaktdaten}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <label style={{ fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                required
              />{' '}
              {t.consent_privacy}
            </label>

            <button
              type="submit"
              className="card-button"
              disabled={!privacyAccepted || loading || compressing}
            >
              {loading ? '...' : (isEditMode ? t.btn_save : t.btn_publish)}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default PostImmoSearch;
