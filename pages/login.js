import { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const router = useRouter();

  const handle = async e => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      router.push('/admin');
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-50">
      <form onSubmit={handle} className="bg-white p-8 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        <input type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)} className="mb-2 p-2 border rounded w-full" required />
        <input type="password" placeholder="Password" value={pass}
          onChange={e => setPass(e.target.value)} className="mb-4 p-2 border rounded w-full" required maxLength="10"/>
        <button type="submit" className="bg-blue-600 text-white py-2 rounded w-full">Login</button>
      </form>
    </div>
  );
}