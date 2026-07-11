'use client';
import { useState } from 'react';

export const metadata = {
  title: 'Login', // This will result in "Avatar Shop | Ziptrii"
};

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ username, password, type: 'login' }),
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = data.user.isBanned ? '/banned' : '/';
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="content">
      <form onSubmit={handleLogin}>
        <h1>Login</h1>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Log In</button>
        <p>New to Ziptrii? <a href="/signup">Sign Up!</a></p>
      </form>
    </div>
  );
}
