import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Helmet } from "react-helmet-async"; 
import '../blog.css';

const BlogDetail = ({ currentUser, t }) => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  
  // Комментарии
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const ADMIN_EMAIL = "vpovolotskyi25@gmail.com";

  // Логин через Google (как в Header.jsx)
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: { prompt: 'select_account' }
      }
    });
  };

  useEffect(() => {
    window.prerenderReady = false;

    const fetchPost = async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (data) {
        setPost(data);
        fetchComments(data.id);
        
        setTimeout(() => {
          window.prerenderReady = true;
        }, 100);
      }
    };

    fetchPost();
  }, [slug]);

  const fetchComments = async (postId) => {
    const { data, error } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (!error && data) setComments(data);
  };

  const handleSendComment = async () => {
    if (!newComment.trim() || !currentUser) return;
    setCommentLoading(true);

    const { error } = await supabase.from('blog_comments').insert([{
      post_id: post.id,
      user_id: currentUser.id,
      user_name: currentUser.user_metadata?.full_name || currentUser.email.split('@')[0],
      content: newComment.trim()
    }]);

    if (!error) {
      setNewComment('');
      fetchComments(post.id);
    }
    setCommentLoading(false);
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Удалить коментарий?")) return;
    const { error } = await supabase
      .from('blog_comments')
      .delete()
      .eq('id', commentId);

    if (!error) {
      setComments(prev => prev.filter(c => c.id !== commentId));
    }
  };

  if (!post) return <div className="container" style={{padding: '50px'}}>Loading...</div>;

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

        {post.created_at && (
          <div style={{ fontSize: '14px', color: '#888', marginBottom: '20px' }}>
            {new Date(post.created_at).toLocaleDateString()} {new Date(post.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        )}

        {post.cover_image && (
          <img src={post.cover_image} alt="" className="blog-cover" />
        )}

        <div className="blog-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {post.content}
          </ReactMarkdown>
        </div>

        <hr className="blog-divider" style={{margin: '40px 0'}} />

        {/* СЕКЦИЯ КОММЕНТАРИЕВ */}
        <section className="comments-section">
          <h3 style={{marginBottom: '20px'}}>{t.blog_comments_title} ({comments.length})</h3>

          {currentUser ? (
            <div className="comment-form" style={{marginBottom: '30px'}}>
              <textarea
                style={{width: '100%', minHeight: '100px', padding: '12px', borderRadius: '8px', border: '1px solid #ddd'}}
                placeholder={t.blog_placeholder}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button 
                onClick={handleSendComment} 
                disabled={commentLoading || !newComment.trim()}
                style={{marginTop: '10px', padding: '10px 25px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer'}}
              >
                {commentLoading ? t.blog_sending : t.blog_send}
              </button>
            </div>
          ) : (
            <div className="comment-auth-notice" style={{padding: '20px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '30px'}}>
              {t.blog_auth_pre}
              <button 
                onClick={handleGoogleLogin} 
                style={{background: 'none', border: 'none', color: '#1a73e8', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: 'inherit'}}
              >
                {t.blog_auth_link}
              </button>
            </div>
          )}

          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item" style={{background: '#f9f9f9', padding: '15px', borderRadius: '10px', marginBottom: '15px', position: 'relative'}}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#666', paddingRight: '35px' }}>
                  <strong>{comment.user_name}</strong>
                  <span>
                    {new Date(comment.created_at).toLocaleDateString()} {new Date(comment.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>

                <p style={{ margin: 0, color: '#333' }}>{comment.content}</p>

                {(currentUser?.id === comment.user_id || currentUser?.email === ADMIN_EMAIL) && (
                  <button 
                    onClick={() => handleDeleteComment(comment.id)}
                    style={{position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '18px'}}
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            {comments.length === 0 && <p>{t.blog_no_comments}</p>}
          </div>
        </section>
      </div>
    </main>
  );
};

export default BlogDetail;