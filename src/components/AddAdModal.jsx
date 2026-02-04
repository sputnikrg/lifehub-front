import { Link } from 'react-router-dom';

const AddAdModal = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>{t.add_ad_title}</h3>

        <div className="modal-actions">
          <Link to="/post-ad" onClick={onClose}>
            {t.add_ad_general}
          </Link>

          <Link to="/immo/offer/post" onClick={onClose}>
            {t.add_ad_immo_offer}
          </Link>

          <Link to="/immo/search/post" onClick={onClose}>
            {t.add_ad_immo_search}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddAdModal;
