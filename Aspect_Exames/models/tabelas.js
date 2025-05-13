import Sequelize from 'sequelize';
import db from './banco.js';

const AgendaExame = db.define('tb_agendaexame', {
    ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ID_EXAME: {
        type: Sequelize.INTEGER
    },
    ID_USUARIO: {
        type: Sequelize.INTEGER
    },
    DS_INFORMACAO: {
        type: Sequelize.TEXT
    },
    DT_EXAME: {
        type: Sequelize.DATE
    },
},
    {
        timestamps: false,
        freezeTableName: true
    },);

const TsUsuarios = db.define('ts_usuarios', {
    DS_NOME: {
        type: Sequelize.STRING
    },
    DS_EMAIL: {
        type: Sequelize.STRING
    },
},
    {
        timestamps: false
    },);

const TbExames = db.define('tb_exames', {
    ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    DS_NOME: {
        type: Sequelize.STRING
    },

},
    {
        timestamps: false
    },);

TbExames.hasMany(AgendaExame, { foreignKey: 'ID_EXAME' });
AgendaExame.belongsTo(TbExames, { foreignKey: 'ID_EXAME' });

AgendaExame.sync()
TbExames.sync()
TsUsuarios.sync()

export { AgendaExame, TsUsuarios, TbExames };