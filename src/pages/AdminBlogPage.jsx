import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { translations } from "../translations";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const AdminBlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const lang = localStorage.getItem("lifehub_lang") || "ru";
  const t = translations[lang];

  useEffect(() => {
    const checkSessionAndFetch = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        setPosts(data || []);
      }

      setLoading(false);
    };

    checkSessionAndFetch();
  }, [navigate]);

  const handleDelete = async (post) => {
    const confirmDelete = window.confirm(t.adminBlog.confirmDelete);
    if (!confirmDelete) return;

    if (post.cover_image) {
      try {
        const filePath = post.cover_image.split("/blog/")[1];
        if (filePath) {
          await supabase.storage.from("blog").remove([filePath]);
        }
      } catch (err) {
        console.error(err);
      }
    }

    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", post.id);

    if (!error) {
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    }
  };

  if (loading) return null;

  return (
    <main className="page-main">
      <div className="container">
        <div className="admin-header">
          <h1>{t.adminBlog.manage}</h1>

          <Link to="/admin/blog/new" className="btn-primary">
            + {t.adminBlog.new}
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
                  {t.adminBlog.edit}
                </Link>

                <button
                  onClick={() => handleDelete(post)}
                  className="admin-delete-btn"
                >
                  {t.adminBlog.delete}
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
