import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
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
