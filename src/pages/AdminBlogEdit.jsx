import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

const AdminBlogEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [published, setPublished] = useState(false);
    const [coverFile, setCoverFile] = useState(null);
    const [existingCover, setExistingCover] = useState(null);

    useEffect(() => {
        const checkAccess = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session || session.user.email !== "vpovolotskyi25@gmail.com") {
                navigate("/");
            }
        };

        checkAccess();
    }, [navigate]);


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

    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9а-яё\s-]/gi, "")
            .replace(/\s+/g, "-");
    };

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

            if (uploadError) {
                console.error(uploadError);
                return;
            }

            const { data } = supabase.storage
                .from("blog")
                .getPublicUrl(fileName);

            coverUrl = data.publicUrl;
        }

        const { error } = await supabase
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

        if (!error) {
            navigate("/admin/blog");
        } else {
            console.error(error);
        }
    };

    if (loading) return null;

    return (
        <main className="page-main">
            <div className="container">
                <h1>Редактирование</h1>

                <form onSubmit={handleSubmit} className="admin-form">
                    <label>Заголовок</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        required
                    />

                    <label>Slug</label>
                    <input
                        type="text"
                        value={slug}
                        readOnly
                    />

                    <label>Краткое описание</label>
                    <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                    />

                    {existingCover && (
                        <>
                            <label>Текущая обложка</label>
                            <img
                                src={existingCover}
                                alt=""
                                style={{ maxWidth: "300px", marginBottom: "10px" }}
                            />
                        </>
                    )}

                    <label>Новая обложка</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverFile(e.target.files[0])}
                    />

                    <label>Контент (Markdown)</label>
                    <textarea
                        rows="10"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />

                    <label className="checkbox">
                        <input
                            type="checkbox"
                            checked={published}
                            onChange={(e) => setPublished(e.target.checked)}
                        />
                        Опубликовать
                    </label>

                    <button type="submit" className="btn-primary">
                        Сохранить изменения
                    </button>
                </form>
            </div>
        </main>
    );
};

export default AdminBlogEdit;
