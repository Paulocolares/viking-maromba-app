
import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore';

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
const db = getFirestore(app);

const treinosSemana = {
  0: "Descanso",
  1: "Peito + Tríceps",
  2: "Costas + Bíceps",
  3: "Perna",
  4: "Ombro + Abdômen",
  5: "Posterior + Glúteos",
  6: "Cardio leve / Core"
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [concluido, setConcluido] = useState(false);
  const [hoje] = useState(new Date());

  const diaSemana = hoje.getDay();
  const treinoDoDia = treinosSemana[diaSemana];

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

  const salvarTreino = async () => {
    if (!user) return;
    try {
      const docRef = await addDoc(collection(db, "treinos"), {
        uid: user.uid,
        treino: treinoDoDia,
        data: Timestamp.fromDate(hoje),
      });
      setConcluido(true);
    } catch (err) {
      console.error("Erro ao salvar treino:", err);
    }
  };

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
      <h2>Olá, {user.email}</h2>
      <p>Treino de hoje ({["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][diaSemana]}): <strong>{treinoDoDia}</strong></p>
      {!concluido ? (
        <button onClick={salvarTreino}>✅ Marcar como concluído</button>
      ) : (
        <p style={{ color: "green" }}>✔ Treino marcado como concluído!</p>
      )}
      <br /><br />
      <button onClick={sair}>Sair</button>
    </div>
  );
}
