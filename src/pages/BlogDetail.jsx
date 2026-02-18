import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Helmet } from "react-helmet-async"; 
import '../blog.css';

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    // 1. Сбрасываем флаг готовности при каждом переходе на новую статью
    window.prerenderReady = false;

    const fetchPost = async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (data) {
        setPost(data);
        // 2. 🚀 Сообщаем Prerender, что данные загружены и Helmet может подставить теги
        // Даем небольшую задержку в 100мс, чтобы Helmet успел обновить DOM
        setTimeout(() => {
          window.prerenderReady = true;
        }, 100);
      }
    };

    fetchPost();
  }, [slug]);

  if (!post) return <div className="container">Loading...</div>;

  return (
    <main className="page-main">
      <Helmet>
        <title>{post.title} | LifeHub</title>
        <meta name="description" content={post.excerpt || ""} />

        {/* Open Graph / Facebook / Telegram */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ""} />
        <meta property="og:image" content={post.cover_image || ""} />
        <meta property="og:url" content={window.location.href} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || ""} />
        <meta name="twitter:image" content={post.cover_image || ""} />
      </Helmet>

      <div className="container blog-container">
        <h1 className="blog-title">{post.title}</h1>

        {post.cover_image && (
          <img src={post.cover_image} alt="" className="blog-cover" />
        )}

        <div className="blog-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </main>
  );
};

export default BlogDetail;