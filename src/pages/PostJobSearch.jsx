import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const PostJobSearch = ({ onAddListing, currentUser, t }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '', // Ожидаемая зарплата
    city: '',
    bundesland: '',
    contact_info: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("Пожалуйста, войдите в систему");
    setLoading(true);

    const newListing = {
      ...formData,
      type: 'job',
      mode: 'search', // Указываем, что это поиск (резюме)
      user_id: currentUser.id,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('listings')
      .insert([newListing])
      .select();

    if (error) {
      console.error(error);
      alert("Ошибка при сохранении");
    } else {
      onAddListing(data[0]);
      navigate('/job/search'); // Перенаправляем в раздел "Ищу работу"
    }
    setLoading(false);
  };

  return (
    <main className="page-main">
      <section className="container" style={{ maxWidth: '600px', padding: '40px 0' }}>
        <h2>{t.job_search || 'Arbeit gesucht (Lebenslauf)'}</h2>
        <form onSubmit={handleSubmit} className="post-ad-form">
          <input 
            type="text" 
            placeholder={t.label_title} 
            required 
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          <textarea 
            placeholder={t.label_desc} 
            required 
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <input 
            type="number" 
            placeholder={t.label_price + " (Erwartetes Gehalt)"} 
            onChange={(e) => setFormData({...formData, price: e.target.value})}
          />
          <input 
            type="text" 
            placeholder={t.label_city} 
            required 
            onChange={(e) => setFormData({...formData, city: e.target.value})}
          />
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? '...' : t.btn_publish}
          </button>
        </form>
      </section>
    </main>
  );
};

export default PostJobSearch;