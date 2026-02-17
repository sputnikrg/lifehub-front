import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import '../blog.css';

const BlogPage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*');

            console.log("BLOG DATA:", data);
            console.log("BLOG ERROR:", error);

            setPosts(data || []);
        };

        fetchPosts();
    }, []);


    return (
        <main className="page-main">
            <div className="container blog-container">
                <h1 className="blog-title">Материалы</h1>

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

            </div>
        </main>
    );
};

export default BlogPage;
