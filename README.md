# Aspect - Sistema de Agendamento de Exames

## Instruções de Execução

### Pré-requisitos

Antes de iniciar a aplicação, certifique-se de que os seguintes requisitos estejam atendidos:

- Node.js instalado
- XAMPP instalado e configurado
- Apache e MySQL ativos via XAMPP
- Banco de dados MySQL criado conforme especificado abaixo

### Configuração do Banco de Dados

1. Acesse o **phpMyAdmin** via XAMPP.
2. Crie um banco de dados com o nome:

   ```
   bd_aspect
   ```

### Estrutura do Projeto

O projeto está dividido em duas pastas principais:

- **Backend**: responsável pela API e conexão com o banco de dados.
- **Frontend**: interface de interação com o usuário.

### Iniciando o Backend

1. Navegue até a pasta do backend no terminal.
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor:

   ```bash
   node src/index.js
   ```

> O backend será executado fixamente na porta **3000**.

### Iniciando o Frontend

1. Navegue até a pasta do frontend no terminal.
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie a aplicação React:

   ```bash
   npm start
   ```

4. Quando solicitado, pressione `Y` para abrir na porta alternativa **3001**.

>  Acesse a aplicação em: [http://localhost:3001](http://localhost:3001)

### Autenticação

O sistema utiliza um login simplificado via e-mail:

- **Sem senha**: o usuário informa apenas o e-mail.
- Se o e-mail **não existir**, o sistema realiza o cadastro automaticamente.
- Se o e-mail **já estiver cadastrado**, o sistema realiza o login automaticamente.

### Observações

- Lembre-se de iniciar o **Apache** e o **MySQL** pelo XAMPP antes de rodar a aplicação.
- O banco será populado com exames padrões automaticamente na primeira execução do backend.

