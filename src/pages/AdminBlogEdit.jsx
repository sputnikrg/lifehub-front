import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import { translations } from "../translations";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const AdminBlogEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const lang = localStorage.getItem("lifehub_lang") || "ru";
    const t = translations[lang];

    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [published, setPublished] = useState(false);
    const [coverFile, setCoverFile] = useState(null);
    const [existingCover, setExistingCover] = useState(null);

    // 📦 Загрузка поста
    useEffect(() => {
        const fetchPost = async () => {
            const { data, error } = await supabase
                .from("blog_posts")
                .select("*")
                .eq("id", id)
                .single();

            if (!error && data) {
                setTitle(data.title);
                setSlug(data.slug);
                setExcerpt(data.excerpt);
                setContent(data.content);
                setPublished(data.published);
                setExistingCover(data.cover_image);
            }

            setLoading(false);
        };

        fetchPost();
    }, [id]);

    const generateSlug = (text) =>
        text
            .toLowerCase()
            .replace(/[^a-z0-9а-яё\s-]/gi, "")
            .replace(/\s+/g, "-");

    const handleTitleChange = (value) => {
        setTitle(value);
        setSlug(generateSlug(value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let coverUrl = existingCover;

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

        await supabase
            .from("blog_posts")
            .update({
                title,
                slug,
                excerpt,
                content,
                published,
                cover_image: coverUrl,
                updated_at: new Date(),
            })
            .eq("id", id);

        navigate("/admin/blog");
    };

    if (loading) return null;

    return (
        <main className="page-main">
            <div className="container">
                <h1>{t.adminBlog.edit}</h1>

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

                    {existingCover && (
                        <>
                            <label>{t.adminBlog.currentCover}</label>
                            <img
                                src={existingCover}
                                alt=""
                                style={{ maxWidth: "300px", marginBottom: "10px" }}
                            />
                        </>
                    )}

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
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />

                    {/* Окно предпросмотра */}
                    <label style={{ marginTop: '20px', display: 'block', color: '#666', fontWeight: 'bold' }}>
                        Предпросмотр:
                    </label>
                    <div className="markdown-preview" style={{
                        border: '1px solid #ddd',
                        padding: '15px',
                        borderRadius: '8px',
                        backgroundColor: '#fdfdfd',
                        minHeight: '200px',
                        marginTop: '10px',
                        marginBottom: '20px'
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
                        {t.adminBlog.saveChanges}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default AdminBlogEdit;
