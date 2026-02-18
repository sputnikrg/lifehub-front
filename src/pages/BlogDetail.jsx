import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Helmet } from "react-helmet-async";
import '../blog.css';

const BlogDetail = ({ currentUser }) => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  // Состояния для комментариев
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const ADMIN_EMAIL = "vpovolotskyi25@gmail.com"; // Твой email из App.jsx

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
      // Берем имя из метаданных или обрезаем почту
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
    if (!window.confirm("Удалить комментарий?")) return;

    const { error } = await supabase
      .from('blog_comments')
      .delete()
      .eq('id', commentId);

    if (!error) {
      setComments(prev => prev.filter(c => c.id !== commentId));
    }
  };

  if (!post) return <div className="container" style={{ padding: '50px' }}>Loading...</div>;

  return (
    <main className="page-main">
      <Helmet>
        <title>{post.title} | LifeHub</title>
        <meta name="description" content={post.excerpt || ""} />
        <meta property="og:title" content={post.title} />
        <meta property="og:image" content={post.cover_image || ""} />
      </Helmet>

      <div className="container blog-container">
        <h1 className="blog-title">{post.title}</h1>
        {post.created_at && (
          <div style={{ fontSize: '14px', color: '#888', marginBottom: '20px' }}>
            {new Date(post.created_at).toLocaleDateString()} {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

        <hr className="blog-divider" style={{ margin: '40px 0' }} />

        {/* СЕКЦИЯ КОММЕНТАРИЕВ */}
        <section className="comments-section">
          <h3 style={{ marginBottom: '20px' }}>Комментарии ({comments.length})</h3>

          {currentUser ? (
            <div className="comment-form" style={{ marginBottom: '30px' }}>
              <textarea
                style={{ width: '100%', minHeight: '100px', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                placeholder="Напишите комментарий..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                onClick={handleSendComment}
                disabled={commentLoading || !newComment.trim()}
                style={{ marginTop: '10px', padding: '10px 25px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                {commentLoading ? '...' : 'Отправить'}
              </button>
            </div>
          ) : (
            <p style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '30px' }}>
              Чтобы оставить комментарий, пожалуйста, <Link to="/login">войдите</Link>.
            </p>
          )}

          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item" style={{ background: '#f9f9f9', padding: '15px', borderRadius: '10px', marginBottom: '15px', position: 'relative' }}>
                <div className="comments-list">
                  {comments.map((comment) => (
                    <div key={comment.id} className="comment-item" style={{ background: '#f9f9f9', padding: '15px', borderRadius: '10px', marginBottom: '15px', position: 'relative' }}>

                      {/* Исправленный блок заголовка комментария */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                        fontSize: '13px',
                        color: '#666',
                        paddingRight: '35px'
                      }}>
                        <strong>{comment.user_name}</strong>
                        <span>
                          {new Date(comment.created_at).toLocaleDateString()} {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p style={{ margin: 0, color: '#333' }}>{comment.content}</p>

                      {/* Кнопка удаления */}
                      {(currentUser?.id === comment.user_id || currentUser?.email === ADMIN_EMAIL) && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '18px' }}
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p style={{ margin: 0, color: '#333' }}>{comment.content}</p>

                {/* Кнопка удаления для автора или админа */}
                {(currentUser?.id === comment.user_id || currentUser?.email === 'vpovolotskyi25@gmail.com') && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'none',
                      border: 'none',
                      color: '#ff4d4f',
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            {comments.length === 0 && <p>Пока нет комментариев. Будьте первым!</p>}
          </div>
        </section>
      </div>
    </main>
  );
};

export default BlogDetail;