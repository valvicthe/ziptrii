'use client';
import { useState } from 'react';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

export const metadata = {
  title: 'Sign-Up', // This will result in "Avatar Shop | Ziptrii"
};

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ username, password, type: 'signup' }),
    });
    const data = await res.json();

    if (data.success) {
      alert("Account created!");
      window.location.href = '/login';
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="content">
      <form onSubmit={handleSignup}>
        <h1>Sign Up</h1>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Create Account</button>
        <p>Already have an account? <a href="/login">Login here</a></p>
      </form>
    </div>
  );
}
