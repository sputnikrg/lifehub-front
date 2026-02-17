import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { translations } from "../translations";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const AdminBlogNew = () => {
  const navigate = useNavigate();

  const lang = localStorage.getItem("lifehub_lang") || "ru";
  const t = translations[lang];

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [coverFile, setCoverFile] = useState(null);

  // Исправленная функция генерации Slug с транслитерацией
  const generateSlug = (text) => {
    const map = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
      'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
      'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
      'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
      'і': 'i', 'ї': 'yi', 'є': 'ye', 'ґ': 'g'
    };

    return text
      .toLowerCase()
      .split('')
      .map(char => map[char] || char)
      .join('')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const generateExcerpt = (text) => {
    const plainText = text
      .replace(/[#*`_~]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .trim();
    return plainText.slice(0, 150) + (plainText.length > 150 ? "..." : "");
  };

  const handleTitleChange = (value) => {
    setTitle(value);
    setSlug(generateSlug(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let coverUrl = null;

    if (coverFile) {
      const fileExt = coverFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("blog")
        .upload(fileName, coverFile);

      if (!uploadError) {
        const { data } = supabase.storage
          .from("blog")
          .getPublicUrl(fileName);

        coverUrl = data.publicUrl;
      }
    }

    await supabase.from("blog_posts").insert([
      {
        title,
        slug,
        excerpt,
        content,
        published,
        cover_image: coverUrl,
      },
    ]);

    navigate("/admin/blog");
  };

  return (
    <main className="page-main">
      <div className="container">
        <h1>{t.adminBlog.new}</h1>

        <form onSubmit={handleSubmit} className="admin-form">
          <label>{t.adminBlog.title}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />

          <label>{t.adminBlog.slug}</label>
          <input type="text" value={slug} readOnly />

          <label>{t.adminBlog.excerpt}</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />

          <label>{t.adminBlog.newCover}</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
          />

          <label>{t.adminBlog.content}</label>
          <textarea
            rows="10"
            value={content}
            onChange={(e) => {
              const value = e.target.value;
              setContent(value);
              if (!excerpt) {
                setExcerpt(generateExcerpt(value));
              }
            }}
            required
          />

          <label style={{ marginTop: '20px', color: '#666' }}>Предпросмотр:</label>
          <div className="markdown-preview" style={{
            border: '1px solid #ddd',
            padding: '15px',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
            minHeight: '200px'
          }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
          </div>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            {t.adminBlog.publish}
          </label>

          <button type="submit" className="btn-primary">
            {t.adminBlog.save}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminBlogNew;