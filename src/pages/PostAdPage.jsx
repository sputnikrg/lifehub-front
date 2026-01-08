import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const PostAdPage = ({ onAddListing, currentUser }) => {
  const { id } = useParams(); // Извлекаем ID из ссылки /edit/:id
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    type: 'wohnung',
    title: '',
    city: '',
    price: '',
    description: '',
    images: []
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode); // Состояние загрузки данных для редактирования

  // ЭФФЕКТ ДЛЯ ПОДТЯГИВАНИЯ ДАННЫХ
  useEffect(() => {
    if (isEditMode) {
      const fetchListing = async () => {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error("Ошибка при загрузке данных для редактирования:", error.message);
          setFetching(false);
        } else if (data) {
          setFormData({
            type: data.type || 'wohnung',
            title: data.title || '',
            city: data.city || '',
            price: data.price || '',
            description: data.description || '',
            images: data.images || []
          });
          setFetching(false);
        }
      };
      fetchListing();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Пожалуйста, войдите в систему");
      return;
    }

    setLoading(true);

    try {
      let uploadedUrls = [...formData.images];

      // Загрузка новых файлов, если они выбраны
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${Date.now()}-${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('listing-images')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from('listing-images')
            .getPublicUrl(filePath);
          
          uploadedUrls.push(urlData.publicUrl);
        }
      }

      const listingData = {
        type: formData.type,
        title: formData.title,
        city: formData.city,
        price: Number(formData.price),
        description: formData.description,
        images: uploadedUrls,
        user_id: currentUser.id
      };

      if (isEditMode) {
        // ОБНОВЛЕНИЕ СУЩЕСТВУЮЩЕГО
        const { error } = await supabase
          .from('listings')
          .update(listingData)
          .eq('id', id);
        
        if (error) throw error;
        alert("Объявление успешно обновлено!");
      } else {
        // СОЗДАНИЕ НОВОГО
        const { data, error } = await supabase
          .from('listings')
          .insert([listingData])
          .select();

        if (error) throw error;
        if (onAddListing) onAddListing(data[0]);
        alert("Объявление успешно создано!");
      }

      navigate('/my-listings');
    } catch (error) {
      alert("Ошибка: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="container"><h3>Laden данных для редактирования...</h3></div>;

  return (
    <main className="page-main">
      <div className="container form-container" style={{ maxWidth: '600px', margin: '40px auto', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>
          {isEditMode ? "Anzeige bearbeiten ✏️" : "Neue Anzeige erstellen"}
        </h1>
        
        <form onSubmit={handleSubmit} className="ad-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Kategorie</label>
            <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
              <option value="wohnung">Wohnung</option>
              <option value="job">Job</option>
              <option value="dating">Dating</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Titel</label>
            <input name="title" value={formData.title} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Stadt</label>
              <input name="city" value={formData.city} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                {formData.type === 'dating' ? 'Alter' : 'Preis (€)'}
              </label>
              <input name="price" type="number" value={formData.price} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Beschreibung</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="5" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Fotos hinzufügen</label>
            <input type="file" multiple onChange={handleFileChange} accept="image/*" style={{ width: '100%' }} />
            {isEditMode && formData.images.length > 0 && (
              <p style={{ fontSize: '12px', color: '#2ecc71', marginTop: '5px' }}>
                ✅ У объявления уже есть {formData.images.length} фото. Вы можете добавить еще.
              </p>
            )}
          </div>

          <button type="submit" disabled={loading} style={{ 
            marginTop: '20px', 
            padding: '15px', 
            background: isEditMode ? '#f1c40f' : '#3498db', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            {loading ? "Wird gespeichert..." : (isEditMode ? "Änderungen speichern" : "Veröffentlichen")}
          </button>
        </form>
      </div>
    </main>
  );
};

export default PostAdPage;