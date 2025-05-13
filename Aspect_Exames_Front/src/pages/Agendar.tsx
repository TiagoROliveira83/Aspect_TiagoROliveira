import 'react-datepicker/dist/react-datepicker.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import '../estilo/agendar.css'; 
import { useNavigate } from 'react-router-dom';

const Agendar: React.FC = () => {
  const { id } = useParams();
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [dataHora, setDataHora] = useState<Date | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [dsInformacao, setInformacao] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const idUsuarioaux = localStorage.getItem('id');
    if (idUsuarioaux) {
      setIdUsuario(parseInt(idUsuarioaux, 10));
    }
  }, []);

  const handleAgendar = async () => {
    if (!dataHora) {
      setMensagem('Por favor, selecione data e hora.');
      return;
    }

    const idExame = parseInt(id as string, 10);

    try {
      const response = await fetch('http://localhost:3000/agendaexame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idExame,
          idUsuario,
          dsInformacao,
          data_exame: dataHora.toISOString(),
        }),
      });

      let resultado;
      try {
        resultado = await response.json();
      } catch {
        resultado = await response.text(); 
      }

      if (response.ok) {
        setMensagem('Agendamento realizado com sucesso!');

      } else {
        setMensagem(typeof resultado === 'string' ? resultado : resultado.message || 'Erro ao agendar.');
      }
    } catch (err) {
      console.error(err);
      setMensagem('Erro na conexão com o servidor.');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Agendar Exame (ID: {id})</h2>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <DatePicker
          selected={dataHora}
          onChange={(date) => setDataHora(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={30}
          timeCaption="Horário"
          dateFormat="dd/MM/yyyy HH:mm"
          placeholderText="Selecione data e hora"
          className="datepicker-input"
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Digite uma observação"
          value={dsInformacao}
          onChange={(e) => setInformacao(e.target.value)}
          style={{
            padding: '10px',
            width: '100%',
            maxWidth: '400px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            marginTop: '10px',
            marginBottom: '20px',
            fontSize: '16px',
          }}
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleAgendar}
          style={{
            backgroundColor: '#FF6347',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s ease',
          }}
        >
          Agendar
        </button>
      </div>

      {mensagem && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ color: mensagem.includes('Erro') ? 'red' : 'green', fontSize: '16px' }}>
            {mensagem}
          </p>
          {mensagem === 'Agendamento realizado com sucesso!' && (
            <button onClick={() => navigate('/home')}>
              Voltar para a Home
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Agendar;
