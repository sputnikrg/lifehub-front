import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import { bundeslaender } from '../data/bundeslaender';

const PostImmoSearch = ({ onAddListing, currentUser, t }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // ДОБАВЛЕНО
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    bundesland: '',
    kontaktdaten: '',
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchListing = async () => {
        const { data } = await supabase.from('listings').select('*').eq('id', id).single();
        if (data) setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          city: data.city,
          bundesland: data.bundesland,
          kontaktdaten: data.kontaktdaten || ''
        });
      };
      fetchListing();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!privacyAccepted) return;
    setLoading(true);

    const finalData = {
      ...formData,
      type: 'wohnung',
      mode: 'search',
      user_id: currentUser.id,
      created_at: new Date().toISOString()
    };

    let result;
    if (isEditMode) {
      result = await supabase.from('listings').update(finalData).eq('id', id).select();
    } else {
      result = await supabase.from('listings').insert([finalData]).select();
    }

    if (result.error) {
      alert("Ошибка: " + result.error.message);
    } else {
      if (onAddListing) onAddListing(result.data[0]);
      setIsSubmitted(true); // ЗАМЕНЕНО с navigate
    }
    setLoading(false);
  };

  // ДОБАВЛЕН БЛОК УСПЕШНОЙ ОТПРАВКИ
  if (isSubmitted) {
    return (
      <main className="page-main">
        <div className="container">
          <div className="form-box" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '40px' }}>✅</h2>
            <h2>{t.post_success_title || 'Erfolgreich!'}</h2>
            <p style={{ marginBottom: '20px' }}>{t.post_success_text}</p>
            <button className="card-button" onClick={() => navigate('/my-listings')}>
              {t.view_listings || 'Zur Liste'}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-main">
      <div className="container">
        <div className="form-box">
          {/* Исправленный блок заголовка */}
          <h2 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            {isEditMode ? (t.form_title_edit || 'Bearbeiten') : (t.immo_search || 'Immobilie gesucht')}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="filter-field">
              <label>{t.label_title}</label>
              {/* ... остальной код формы */}
              <input required placeholder="z.B. Suche 2-Zimmer Wohnung" value={formData.title} maxLength={40} onChange={(e) => setFormData({ ...formData, title: e.target.value.slice(0, 40) })
              }
              />
              <div style={{ fontSize: '12px', color: '#999', textAlign: 'right' }}>
                {formData.title.length}/40
              </div>

            </div>
            <div className="filter-field">
              <label>{t.label_desc}</label>
              <textarea required rows="6" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div className="filter-field" style={{ flex: 1 }}>
                <label>{t.label_budget || 'Budget'} (€)</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div className="filter-field" style={{ flex: 1 }}>
                <label>{t.label_city}</label>
                <input required value={formData.city} maxLength={35} onChange={(e) => setFormData({ ...formData, city: e.target.value.slice(0, 35) })
                  }
                />
                <div style={{ fontSize: '12px', color: '#999', textAlign: 'right' }}>
                  {formData.city.length}/35
                </div>

              </div>
            </div>
            <div className="filter-field">
              <label>{t.label_bundesland}</label>
              <select required value={formData.bundesland} onChange={(e) => setFormData({ ...formData, bundesland: e.target.value })}>
                <option value="">{t.select_bundesland}</option>
                {bundeslaender.map(land => <option key={land.value} value={land.value}>{land.label}</option>)}
              </select>
            </div>
            <div className="filter-field">
              <label>Kontaktdaten</label>
              <textarea
                rows="2"
                placeholder={t.placeholder_contact || 'Telefon, E-Mail oder Telegram'}
                value={formData.kontaktdaten}
                onChange={(e) => setFormData({ ...formData, kontaktdaten: e.target.value })}
              />
            </div>
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} required />
                <span style={{ fontSize: '13px' }}>{t.consent_privacy}</span>
              </label>
            </div>
            <button type="submit" className="card-button" disabled={loading || !privacyAccepted}>
              {loading ? '...' : (isEditMode ? t.btn_save : t.btn_publish)}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default PostImmoSearch;