import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom'; // Добавили Link сюда
import { bundeslaender } from '../data/bundeslaender';
import CityAutocomplete from '../components/CityAutocomplete';

const PostJobOffer = ({ onAddListing, currentUser, t }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        city: '',
        bundesland: '',
        kontaktdaten: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!privacyAccepted) return;
        setLoading(true);

        const { data, error } = await supabase.from('listings').insert([{
            ...formData,
            type: 'job',
            mode: 'offer',
            user_id: currentUser.id,
            created_at: new Date().toISOString()
        }]).select();

        if (error) {
            alert("Ошибка: " + error.message);
        } else {
            onAddListing(data[0]);
            setIsSubmitted(true);
        }
        setLoading(false);
    };

    if (isSubmitted) {
        return (
            <main className="page-main">
                <div className="container">
                    <div className="form-box" style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '40px' }}>✅</h2>
                        <h2>{t.post_success_title || 'Erfolgreich!'}</h2>
                        <p style={{ marginBottom: '20px' }}>{t.post_success_text}</p>
                        <button className="card-button" onClick={() => navigate('/job/offer')}>
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
                    <h2 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        {t.job_offer}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="filter-field">
                            <label>{t.label_title}</label>
                            <input required placeholder={t.placeholder_job_title || "z.B. Küchenhilfe"} value={formData.title} maxLength={40} onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value.slice(0, 40) })
                            }
                            />
                            <div style={{ fontSize: '12px', color: '#999', textAlign: 'right' }}>
                                {formData.title.length}/40
                            </div>
                        </div>

                        <div className="filter-field">
                            <label>{t.label_desc}</label>
                            <textarea
                                required
                                rows="6"
                                placeholder={t.placeholder_job_desc || "Aufgaben, Anforderungen..."}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="form-row-mobile">
                            <div className="filter-field price-field">
                                <label>{t.label_price} (€)</label>
                                <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div className="filter-field city-field">
                                <label>{t.label_city}</label>
                                <CityAutocomplete
                                    value={formData.city}
                                    onChange={(val) => setFormData({ ...formData, city: val.slice(0, 35) })}
                                    placeholder={t.placeholder_city || t.label_city}
                                />
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
                                rows="3"
                                placeholder={t.placeholder_contact || 'Telefon, E-Mail oder Telegram'}
                                value={formData.kontaktdaten}
                                onChange={(e) => setFormData({ ...formData, kontaktdaten: e.target.value })}
                            />
                        </div>

                        {/* Исправленный блок с чекбоксом и ссылками */}
                        <div style={{ marginTop: '25px', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
                            <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={privacyAccepted}
                                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                                    required
                                    style={{ marginTop: '4px' }}
                                />
                                <span style={{ fontSize: '13px', lineHeight: '1.4', color: '#444' }}>
                                    {t.consent_privacy}{' '}
                                    <Link to="/datenschutz" target="_blank" style={{ color: '#3498db', textDecoration: 'underline' }}>
                                        {t.link_privacy || 'Datenschutz'}
                                    </Link>.
                                </span>
                            </label>
                            <div style={{ marginTop: '10px', fontSize: '12px', paddingLeft: '24px' }}>
                                <Link to="/impressum" target="_blank" style={{ color: '#888' }}>{t.link_impressum || 'Impressum'}</Link>
                                <span style={{ margin: '0 8px', color: '#ccc' }}>|</span>
                                <Link to="/agb" target="_blank" style={{ color: '#888' }}>{t.link_terms || 'AGB'}</Link>
                            </div>
                        </div>

                        <button type="submit" className="card-button" disabled={loading || !privacyAccepted} style={{ marginTop: '20px' }}>
                            {loading ? '...' : t.btn_publish}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default PostJobOffer;