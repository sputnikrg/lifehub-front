import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';

const CityAutocomplete = ({ value, onChange, placeholder }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const wrapperRef = useRef(null);

  useEffect(() => { setSearchTerm(value || ''); }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('name, zip_code')
        // Поиск и по названию, и по индексу
        .or(`name.ilike.%${searchTerm}%,zip_code.ilike.${searchTerm}%`)
        .limit(8);

      if (!error && data) {
        setSuggestions(data);
        setIsOpen(true);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSelect = (city) => {
    const finalValue = `${city.zip_code} ${city.name}`;
    setSearchTerm(finalValue);
    setIsOpen(false);
    onChange(finalValue); 
  };

  return (
    <div ref={wrapperRef} className="autocomplete-wrapper" style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        autoComplete="off"
        required
      />
      {isOpen && suggestions.length > 0 && (
        <ul className="autocomplete-dropdown">
          {suggestions.map((s, idx) => (
            <li key={idx} onClick={() => handleSelect(s)} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee', background: '#fff' }}>
              <span style={{ fontWeight: 'bold', color: '#1a73e8' }}>{s.zip_code}</span> {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityAutocomplete;