import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
/* Para o login nao estou usando senha apenas confirmacao do cadastro de email
Ou seja, ao preecher o email se nao tiver na base sera cadastrado automaticamente
Se ja houver casdastro vai logar
*/
const Login: React.FC = () => {

  const [dsNome, setNome] = useState('');
  const [dsEmail, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dsNome || !dsEmail) {
      setMensagem('Preencha todos os campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dsNome, dsEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('id', data.id);
        navigate('/home');
      } else {
        setMensagem(data.message || 'Erro no login.');
      }
    } catch (error) {
      console.error(error);
      setMensagem('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '400px',
      margin: '100px auto',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
      textAlign: 'center'
    }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Nome"
          value={dsNome}
          onChange={(e) => setNome(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
        />
        <input
          type="email"
          placeholder="Email"
          value={dsEmail}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#FF6347',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
        >
          Entrar
        </button>
      </form>

      {mensagem && (
        <p style={{
          marginTop: '15px',
          color: mensagem.includes('Erro') || mensagem.includes('erro') ? 'red' : 'green',
          fontSize: '14px'
        }}>
          {mensagem}
        </p>
      )}
    </div>
  );
};

export default Login;
