import React, { useState } from 'react';
import axios from 'axios';

const DeleteExam: React.FC = () => {
    const [examId, setExamId] = useState('');
    const [message, setMessage] = useState('');

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:3000/excluirexame/${examId}`);
            setMessage(response.data.message);
        } catch (error: any) {
            if (error.response) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Erro ao conectar com o servidor.');
            }
        }
    };
    return (
        <div>
            <h2>Excluir Exame</h2>
            <input
                type="text"
                placeholder="ID do exame"
                value={examId}
                onChange={(e) => setExamId(e.target.value)}
            />
            <button onClick={handleDelete}>Excluir</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default DeleteExam;