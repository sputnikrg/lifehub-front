import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddAdModal = ({ isOpen, onClose, t }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <h2 className="modal-title">{t.add_ad_title || 'Anzeige aufgeben'}</h2>
        
        <div className="modal-categories">
          
          {/* IMMO */}
          <div className="modal-category-group">
            <h3>{t.cat_wohnung}</h3>
            <div className="modal-buttons">
              <button 
                className="btn-modal-action" 
                onClick={() => { navigate('/immo/offer/post'); onClose(); }}
              >
                ➕ {t.add_ad_immo_offer}
              </button>
              <button 
                className="btn-modal-action" 
                onClick={() => { navigate('/immo/search/post'); onClose(); }}
              >
                🔍 {t.add_ad_immo_search}
              </button>
            </div>
          </div>

          {/* JOB */}
          <div className="modal-category-group">
            <h3>{t.cat_job}</h3>
            <div className="modal-buttons">
              <button 
                className="btn-modal-action" 
                onClick={() => { navigate('/job/offer/post'); onClose(); }}
              >
                ➕ {t.btn_post_job_offer}
              </button>
              <button 
                className="btn-modal-action" 
                onClick={() => { navigate('/job/search/post'); onClose(); }}
              >
                🔍 {t.btn_post_job_search}
              </button>
            </div>
          </div>

          {/* DATING */}
          <div className="modal-category-group">
            <h3>{t.cat_dating}</h3>
            <div className="modal-buttons">
              <button 
                className="btn-modal-action" 
                onClick={() => { navigate('/post-ad?type=dating'); onClose(); }}
              >
                ➕ {t.add_ad_general}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddAdModal;