import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import '../blog.css';
import { translations } from "../translations";


const BlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); // Чтобы показывать надпись "Загрузка..."
    const [page, setPage] = useState(1);           // Начинаем с первой страницы
    const itemsPerPage = 6;                       // По 6 постов на страницу

    const lang = localStorage.getItem("lifehub_lang") || "ru";
    const t = translations[lang];

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true); // Начинаем загрузку

            // Считаем, какие посты тянуть из базы
            const from = (page - 1) * itemsPerPage;
            const to = from + itemsPerPage - 1;

            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('published', true) // Показываем только опубликованные
                .order('created_at', { ascending: false }) // Сначала новые
                .range(from, to); // Берем только нужный диапазон (например, с 0 по 5)

            if (!error) {
                setPosts(data || []);
            }

            setLoading(false); // Загрузка окончена
        };

        fetchPosts();
    }, [page]); // Программа будет заново качать данные каждый раз, когда меняется номер страницы


    return (
        <main className="page-main">
            <div className="container blog-container">
                <h1 className="blog-title">{t.blogTitle}</h1>

                <div className="blog-grid">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            to={`/blog/${post.slug}`}
                            className="blog-card"
                        >
                            {post.cover_image && (
                                <img
                                    src={post.cover_image}
                                    alt={post.title}
                                    className="blog-card-image"
                                />
                            )}

                            <div className="blog-card-body">
                                <h2 className="blog-card-title">
                                    {post.title}
                                </h2>

                                {post.excerpt && (
                                    <p className="blog-card-excerpt">
                                        {post.excerpt}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
                {/* Блок переключения страниц */}
                <div className="pagination" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '20px',
                    marginTop: '40px'
                }}>
                    <button
                        className="btn-secondary"
                        onClick={() => setPage(p => p - 1)}
                        disabled={page === 1}
                    >
                        ← {t.adminBlog.prev || "Назад"}
                    </button>

                    <span style={{ fontWeight: 'bold' }}>{page}</span>

                    <button
                        className="btn-secondary"
                        onClick={() => setPage(p => p + 1)}
                        disabled={posts.length < itemsPerPage}
                    >
                        {t.adminBlog.next || "Вперед"} →
                    </button>
                </div>

            </div>
        </main>
    );
};

export default BlogPage;
