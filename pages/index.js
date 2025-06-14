
import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "FAKE_API_KEY",
  authDomain: "viking-maromba.firebaseapp.com",
  projectId: "viking-maromba",
  storageBucket: "viking-maromba.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
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
      <div style={{ padding: 20 }}>
        <h2>Login Viking Maromba</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        /><br /><br />
        <button onClick={entrar}>Entrar</button>
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Bem-vindo, {user.email}</h2>
      <p>Área de treino em breve...</p>
      <button onClick={sair}>Sair</button>
    </div>
  );
}
