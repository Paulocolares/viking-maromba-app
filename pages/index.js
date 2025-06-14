
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDNoeQgidtMFrIkmF2x0RomyPBMqmTfrD4",
  authDomain: "viking-maromba.firebaseapp.com",
  projectId: "viking-maromba",
  storageBucket: "viking-maromba.firebasestorage.app",
  messagingSenderId: "196808951505",
  appId: "1:196808951505:web:8c8dd4b3f7c1155c1727f0",
  measurementId: "G-YVZP02NH5V"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  const entrar = () => {
    signInWithEmailAndPassword(auth, email, senha)
      .then(() => setErro(''))
      .catch(() => setErro('Falha no login'));
  };

  const sair = () => signOut(auth);

  if (!user) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center text-green-400 font-sans">
        <img src="/logo.png" alt="Viking Maromba" className="w-32 mb-6 animate-bounce" />
        <h1 className="text-3xl font-bold mb-4">Viking Maromba</h1>
        <input
          className="bg-gray-800 text-white px-4 py-2 mb-3 rounded w-64"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="bg-gray-800 text-white px-4 py-2 mb-3 rounded w-64"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button
          className="bg-green-400 text-black font-bold px-6 py-2 rounded hover:bg-green-300"
          onClick={entrar}
        >
          Entrar
        </button>
        {erro && <p className="text-red-400 mt-4">{erro}</p>}
      </div>
    );
  }

  return (
    <div className="bg-black text-green-400 min-h-screen flex flex-col items-center justify-center font-sans">
      <h2 className="text-2xl mb-4">Bem-vindo, {user.email}</h2>
      <p className="mb-4">Área de treino e histórico virão a seguir...</p>
      <button
        className="bg-green-400 text-black font-bold px-6 py-2 rounded hover:bg-green-300"
        onClick={sair}
      >
        Sair
      </button>
    </div>
  );
}
