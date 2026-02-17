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
    const fetchPost = async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      setPost(data);
    };

    fetchPost();
  }, [slug]);

  if (!post) return <div className="container">Loading...</div>;

  return (
    <main className="page-main">
      {/* 🚀 Секция SEO для соцсетей и мессенджеров */}
      <Helmet>
        {/* Заголовок страницы во вкладке браузера */}
        <title>{post.title} | LifeHub</title>
        <meta name="description" content={post.excerpt || ""} />

        {/* Настройки Open Graph (для Telegram, WhatsApp, Facebook) */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ""} />
        <meta property="og:image" content={post.cover_image || ""} />
        <meta property="og:url" content={window.location.href} />

        {/* Настройки для Twitter */}
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