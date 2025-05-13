import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Exame = {
  id: number;
  nome: string;
};

type Usuario = {
  id: number;
  nome: string;
  email: string;
};

type ExameAgendado = {
  id: number;
  id_exame: number;
  informacao: string;
  data_exame: string;
  nome_exame: string;
};

const Home: React.FC = () => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [exames, setExames] = useState<Exame[]>([]);
  const [exameSelecionado, setExameSelecionado] = useState<Exame | null>(null);
  const [examesAgendados, setExamesAgendados] = useState<ExameAgendado[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/hometeste');
      return;
    }

    const { email } = JSON.parse(userData);

    async function fetchUsuario() {
      try {
        const response = await fetch(`http://localhost:3000/usuario?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        localStorage.setItem('id', data.id);
        setUser(data); 
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        navigate('/hometeste2');
      }
    }

    async function fetchExames() {
      try {
        const response = await fetch('http://localhost:3000/exames');
        const data = await response.json();
        setExames(data);
      } catch (error) {
        console.error('Erro ao buscar exames:', error);
      }
    }

    async function fetchExamesAgendados() {
      try {
        const responseUser = await fetch(`http://localhost:3000/usuario?email=${encodeURIComponent(email)}`);
        const data = await responseUser.json();
        localStorage.setItem('id', data.id);
        const userId = localStorage.getItem('id');
        if (userId) {
          const response = await fetch(`http://localhost:3000/examesAgendados?idUsuario=${userId}`);
          const data = await response.json();
          setExamesAgendados(data);
        }
      } catch (error) {
        console.error('Erro ao buscar exames agendados:', error);
      }
    }

    fetchExames();
    fetchUsuario();
    fetchExamesAgendados();
  }, []);

  const handleSelect = (exame: Exame) => {
    setExameSelecionado(exame);
    navigate(`/agendar/${exame.id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

const handleExcluir = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:3000/excluirexame/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (response.ok) {
      alert('Exame excluído com sucesso!');
      setExamesAgendados(prev => prev.filter(exame => exame.id !== id));
    } else {
      alert(result.message || 'Erro ao excluir exame.');
    }
  } catch (error) {
    console.error('Erro ao excluir exame:', error);
    alert('Erro na conexão com o servidor.');
  }
};

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Bem-vindo(a), {user?.nome}</h1>
      <p style={{ textAlign: 'center', color: '#555' }}>Email: {user?.email}</p>
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: '#FF6347',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          margin: '20px 0',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        Sair
      </button>

      <hr style={{ margin: '40px 0' }} />

      <h2 style={{ color: '#333' }}>Lista de Exames</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {exames.map((exame) => (
          <li
            key={exame.id}
            style={{
              padding: '10px',
              backgroundColor: '#f4f4f4',
              border: '1px solid #ddd',
              marginBottom: '10px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: exameSelecionado?.id === exame.id ? 'bold' : 'normal',
              color: exameSelecionado?.id === exame.id ? '#FF6347' : '#000',
              transition: 'all 0.3s ease',
            }}
            onClick={() => handleSelect(exame)}
          >
            {exame.nome} (ID: {exame.id})
          </li>
        ))}
      </ul>

      {exameSelecionado && (
        <div style={{ marginTop: '30px', padding: '10px', backgroundColor: '#f4f4f4', borderRadius: '5px' }}>
          <h3 style={{ color: '#333' }}>Exame Selecionado:</h3>
          <p><strong>ID:</strong> {exameSelecionado.id}</p>
          <p><strong>Nome:</strong> {exameSelecionado.nome}</p>
        </div>
      )}

      <hr style={{ margin: '40px 0' }} />

      <h2 style={{ color: '#333' }}>Exames Agendados</h2>
      {examesAgendados.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#FF6347', color: '#fff' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Exame</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Data</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Informações</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {examesAgendados.map((exame) => (
              <tr key={exame.id} style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{exame.id}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{exame.nome_exame}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{exame.data_exame}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{exame.informacao}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}><button
                  style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleExcluir(exame.id)}
                >
                  Excluir
                </button></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Você não tem exames agendados.</p>
      )}
    </div>
  );
};

export default Home;
