import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// ТУТ ВПИШИ СВОЙ EMAIL, который ты используешь для входа через Google
const ADMIN_EMAIL = "vpovolotskyi25@gmail.com"; 

const AdminGuard = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Спрашиваем у Supabase: "Кто сейчас вошел?"
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Следим, если пользователь решит выйти или зайти
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Пока мы проверяем пароль/сессию, показываем надпись "Загрузка..."
  if (loading) {
    return <div style={{ padding: "20px" }}>Секунду, проверяю права...</div>;
  }

  // Проверяем: есть ли пользователь И совпадает ли его email с админским
  const isAdmin = session?.user && session.user.email === ADMIN_EMAIL;

  // Если админ — пускаем дальше (Outlet), если нет — выкидываем на главную страницу (Navigate)
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminGuard;