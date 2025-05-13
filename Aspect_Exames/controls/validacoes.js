import { AgendaExame, TsUsuarios } from '../models/tabelas.js';
const agExames = AgendaExame;
const usuarios = TsUsuarios;


const validarDataExame = async (idExame, dtExame) => {
    try {
        const exame = await agExames.findOne({
            where: {
                ID_EXAME: idExame,
                DT_EXAME: dtExame
            }
        });

        return !!exame; 
    } catch (erro) {
        console.error("Erro ao verificar data do exame:", erro);
        throw erro;
    }
};



const validarUsuario = async (email) => {
    try {
        const usuario = await usuarios.findOne({
            where: {
                DS_EMAIL: email
            }
        });

        return !!usuario; 

    } catch (erro) {
        console.error("Erro ao verificar usuário:", erro);
        throw erro;
    }
};

const getUsuario = async (email) => {
    try {
        const usuario = await usuarios.findOne({
            where: {
                DS_EMAIL: email
            }
        });

        return usuario; 

    } catch (erro) {
        console.error("Erro ao localizar usuário:", erro);
        throw erro;
    }
};

const exvalidarExame = async (idExame) => {
    try {
        const exame = await agExames.findByPk(idExame);

        return !!exame; 
    } catch (erro) {
        console.error("Erro ao verificar data do exame:", erro);
        throw erro;
    }
};


export  {
    validarDataExame,
    validarUsuario,
    exvalidarExame,
    getUsuario
};