import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

const AdminBlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSessionAndFetch = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session || session.user.email !== "vpovolotskyi25@gmail.com") {
                navigate("/");
                return;
            }


            const { data, error } = await supabase
                .from("blog_posts")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error) {
                setPosts(data || []);
            } else {
                console.error(error);
            }

            setLoading(false);
        };

        checkSessionAndFetch();
    }, [navigate]);

    const handleDelete = async (post) => {
        const confirmDelete = window.confirm("Удалить материал?");
        if (!confirmDelete) return;

        // 1️⃣ Удаляем файл из Storage (если есть)
        if (post.cover_image) {
            try {
                const filePath = post.cover_image.split("/blog/")[1];

                if (filePath) {
                    await supabase.storage
                        .from("blog")
                        .remove([filePath]);
                }
            } catch (err) {
                console.error("Ошибка удаления изображения:", err);
            }
        }

        // 2️⃣ Удаляем запись из таблицы
        const { error } = await supabase
            .from("blog_posts")
            .delete()
            .eq("id", post.id);

        if (!error) {
            setPosts((prev) => prev.filter((p) => p.id !== post.id));
        } else {
            console.error(error);
        }
    };

    if (loading) return null;

    return (
        <main className="page-main">
            <div className="container">
                <div className="admin-header">
                    <h1>Материалы (управление)</h1>

                    <Link to="/admin/blog/new" className="btn-primary">
                        + Новый материал
                    </Link>
                </div>

                <div className="admin-blog-list">
                    {posts.map((post) => (
                        <div key={post.id} className="admin-blog-card">
                            <div>
                                <h3>{post.title}</h3>
                                <p className="admin-meta">
                                    {post.published ? "Published" : "Draft"} •{" "}
                                    {new Date(post.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            <div style={{ display: "flex", gap: "16px" }}>
                                <Link
                                    to={`/admin/blog/edit/${post.id}`}
                                    className="admin-edit-link"
                                >
                                    Редактировать
                                </Link>

                                <button
                                    onClick={() => handleDelete(post)}
                                    className="admin-delete-btn"
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default AdminBlogPage;
