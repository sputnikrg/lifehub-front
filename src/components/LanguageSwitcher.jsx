import React, { useEffect, useRef, useState } from 'react';

const LANG_OPTIONS = [
  { code: 'de', label: 'Deutsch', shortLabel: '🇩🇪 DE' },
  { code: 'ru', label: 'Русский', shortLabel: '🇷🇺 RU' },
  { code: 'ua', label: 'Українська', shortLabel: '🇺🇦 UA' }
];

const LanguageSwitcher = ({ lang, onLangChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, []);

  const currentLanguage = LANG_OPTIONS.find((option) => option.code === lang) ?? LANG_OPTIONS[0];

  const handleSelectLanguage = (code) => {
    onLangChange(code);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher" ref={containerRef}>
      <button
        type="button"
        className="language-switcher__trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {currentLanguage.code.toUpperCase()} ▾
      </button>

      {isOpen && (
        <ul className="language-dropdown" role="menu">
          {LANG_OPTIONS.map((option) => (
            <li key={option.code}>
              <button
                type="button"
                className={`language-dropdown__item ${lang === option.code ? 'is-active' : ''}`}
                onClick={() => handleSelectLanguage(option.code)}
                role="menuitem"
              >
                <span className="language-dropdown__label language-dropdown__label--desktop">{option.label}</span>
                <span className="language-dropdown__label language-dropdown__label--mobile">{option.shortLabel}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
