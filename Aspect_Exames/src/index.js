import express from 'express';
import { AgendaExame, TsUsuarios, TbExames } from '../models/tabelas.js';
import { validarDataExame, validarUsuario, exvalidarExame, getUsuario } from '../controls/validacoes.js';

import { Op } from 'sequelize';
import cors from 'cors';

const app = express();
const PORT = 3000;
const agExames = AgendaExame;
const usuarios = TsUsuarios;
const listaexames = TbExames;


async function iniciarApp() {
  try {
    const nomesExames = [
      'Hemograma',
      'Colesterol',
      'Diabetes Tipo-1',
      'Diabetes Tipo-2',
      'Raio-X',
      'Eletro-Cardiograma'
    ];

    for (const nome of nomesExames) {
      const [exame, created] = await TbExames.findOrCreate({
        where: { DS_NOME: nome },
        defaults: { DS_NOME: nome }
      });

      if (created) {
        console.log(`Exame '${nome}' criado com sucesso.`);
      } else {
        console.log(`Exame '${nome}' já existia.`);
      }
    }

  } catch (erro) {
    console.error('Erro ao inicializar:', erro);
  }
}

iniciarApp();



app.use(cors());
app.use(express.json());

app.get('/exames', async (req, res) => {
    const { exame } = req.query;

    let where = {};

    if (exame) {
        where.DS_NOME = {
            [Op.like]: `%${exame}%`
        };
    }

    try {
        const exames = await listaexames.findAll({ where });

        const examesFormatados = exames.map(exame => ({
            id: exame.ID,
            nome: exame.DS_NOME
        }));

        return res.status(200).json(examesFormatados);
    } catch (erro) {
        console.error("Erro ao buscar exames:", erro);
        return res.status(500).json({ erro: "Erro ao listar exames" });
    }

});

app.get('/usuario', async (req, res) => {
    const email = req.query.email;  
    
    try {
        const cadUsuario = await getUsuario(email); 

        if (cadUsuario) {
            return res.status(200).json({
                id: cadUsuario.id,
                nome: cadUsuario.DS_NOME,
                email: cadUsuario.DS_EMAIL
            });
        }

        return res.status(401).send(false); 
    } catch (erro) {
        return res.status(500).send("Falha ao cadastrar o usuário: " + erro);
    }
});

app.post('/usuario', async (req, res) => {
    const { dsNome, dsEmail } = req.body;

    try {
        let usuarioOk = await validarUsuario(dsEmail);

        if (!usuarioOk) {
            const novoUsuario = await usuarios.create({
                DS_NOME: dsNome,
                DS_EMAIL: dsEmail
            });
           
            usuarioOk = novoUsuario;
        }

        return res.status(200).json({
            id: usuarioOk.id,
            nome: dsNome,
            email: dsEmail
        });

    } catch (erro) {
        return res.status(500).send("Falha ao cadastrar o usuário: " + erro);
    }
});

app.post('/agendaexame', async (req, res) => {
    const { idExame, idUsuario, dsInformacao, data_exame } = req.body;

    try {
        const indisponivel = await validarDataExame(idExame, data_exame);

        if (indisponivel) {
            return res.status(409).send('Data indisponível');
        }

        await agExames.create({
            ID_EXAME: idExame,
            ID_USUARIO: idUsuario,
            DS_INFORMACAO: dsInformacao,
            DT_EXAME: data_exame
        });

        return res.status(200).json({ message: 'Agendamento criado com sucesso.' });
    } catch (erro) {
        console.error("❌ Erro no agendamento:", erro);
        return res.status(500).send("Falha ao agendar exame: " + erro);
    }

});


app.delete('/excluirexame/:id', async (req, res) => {
    const idExame = req.params.id;

    try {
        
        const exame = await exvalidarExame(idExame);

        if (!exame) {
            return res.status(404).json({ message: 'Exame não encontrado.' });
        }

        await agExames.destroy({
            where: { ID: idExame }
        });

        res.status(200).json({ message: 'Exame excluído com sucesso.' });
    } catch (error) {
        console.error('Erro ao excluir exame:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }

});

app.get('/examesAgendados', async (req, res) => {
    const { idUsuario } = req.query;

    let where = {};

    if (idUsuario) {
        where.ID_USUARIO = idUsuario;
    }

    try {
       
        const examesAG = await AgendaExame.findAll({
            where,
            include: [
                {
                    model: TbExames, 
                    required: true,   
                    attributes: ['DS_NOME'], 
                    as: 'tb_exame'  
                }
            ]
        });


        const examesFormatados = examesAG.map((exame) => ({
            id: exame.ID,
            nome_exame: exame.tb_exame.DS_NOME, 
            informacao: exame.DS_INFORMACAO,
            data_exame: exame.DT_EXAME
        }));

    
        return res.status(200).json(examesFormatados);
    } catch (erro) {
        console.error("Erro ao buscar exames:", erro);
        return res.status(500).json({ erro: "Erro ao listar exames" });
    }
});


app.listen(3000, () => {
    console.log("✅ Servidor rodando em http://localhost:3000");
});