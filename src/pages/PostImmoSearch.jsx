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

  const [loading, setLoading] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert('Bitte einloggen oder registrieren');
      return;
    }

    if (!privacyAccepted) return;

    setLoading(true);

    try {
      const finalData = {
        type: 'wohnung',
        mode: 'search',
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

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('listings')
          .insert([finalData]);

        if (error) throw error;
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

            <label>{t.label_title}</label>
            <input name="title" value={formData.title} onChange={handleChange} required />

            <label>{t.label_city}</label>
            <input name="city" value={formData.city} onChange={handleChange} required />

            <label>{t.label_bundesland}</label>
            <select name="bundesland" value={formData.bundesland} onChange={handleChange} required>
              <option value="">{t.select_bundesland}</option>
              {bundeslaender.map(bl => (
                <option key={bl.value} value={bl.value}>{bl.label}</option>
              ))}
            </select>

            <label>{t.label_budget}</label>
            <input name="budget" type="number" value={formData.budget} onChange={handleChange} required />

            <label>{t.label_desc}</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />

            <label>Kontaktdaten</label>
            <textarea name="kontaktdaten" value={formData.kontaktdaten} onChange={handleChange} />

            <label style={{ fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                required
              />{' '}
              {t.consent_privacy}
            </label>

            <button type="submit" disabled={!privacyAccepted || loading}>
              {loading ? '...' : t.btn_publish}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default PostImmoSearch;
