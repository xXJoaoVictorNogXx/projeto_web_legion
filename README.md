CRUD de Usuários com Node.js, PostgreSQL e Docker

Este é um projeto full-stack simples que implementa um CRUD (Create, Read, Update, Delete) de usuários. A aplicação é totalmente containerizada usando Docker, facilitando a configuração e execução do ambiente de desenvolvimento.

O projeto é dividido em três serviços principais orquestrados pelo Docker Compose:
Frontend: Uma interface de usuário web estática, construída com HTML, CSS e JavaScript puro, servida por um container Nginx.
Backend: Uma API RESTful construída com Node.js e Express, responsável pela lógica de negócio e comunicação com o banco de dados.
Banco de Dados: Uma instância do PostgreSQL para persistência dos dados dos usuários.

Tecnologias Utilizadas
Backend
Node.js
Express.js: Framework para a construção da API REST.
PostgreSQL (pg): Driver para a conexão com o banco de dados PostgreSQL.
Cors: Para permitir requisições de origens diferentes.
Dotenv: Para gerenciar variáveis de ambiente.
Nodemon: Para reiniciar o servidor automaticamente durante o desenvolvimento.

Frontend
HTML5
CSS3 (inline)

JavaScript (Vanilla): Para manipulação do DOM e requisições à API.

Infraestrutura
Docker
Docker Compose
PostgreSQL 16-alpine
Nginx alpine

Pré-requisitos
Docker
Docker Compose (geralmente já vem com o Docker Desktop)

Como Executar o Projeto
Clone o repositório:
Bash
git clone <URL-DO-SEU-REPOSITORIO>
cd <NOME-DO-SEU-REPOSITORIO>

Variáveis de Ambiente:
O projeto já inclui um arquivo .env com as configurações padrão para o ambiente de desenvolvimento. Nenhuma alteração é necessária para rodar o projeto localmente.

Suba os containers:
Na raiz do projeto, execute o seguinte comando para construir as imagens e iniciar os containers em modo detached (-d):

Bash
docker-compose up -d --build
O Docker Compose irá orquestrar a inicialização do banco de dados, do backend e do frontend na ordem correta, graças às diretivas depends_on e healthcheck.

Acesse a aplicação:
Frontend: Abra seu navegador e acesse http://localhost:8080.
Backend (API): A API estará disponível em http://localhost:3000.
Banco de Dados: A porta do PostgreSQL está mapeada para 5433 na sua máquina local para evitar conflitos, caso você já tenha um Postgres rodando na porta padrão.

Para parar a aplicação:
Para parar todos os containers, execute:
Bash
docker-compose down

Estrutura do Projeto
.
├── backend/
│   ├── Dockerfile          # Define a imagem Docker para a API Node.js
│   ├── package.json        # Dependências e scripts do backend
│   ├── server.js           # Código principal da API Express
│   └── .dockerignore       # Arquivos a serem ignorados no build da imagem
├── db/
│   └── init.sql            # Script SQL para criar a tabela 'users'
├── frontend/
│   ├── Dockerfile          # Define a imagem Docker para o site estático com Nginx
│   ├── index.html          # Estrutura da página
│   └── app.js              # Lógica do frontend
├── .env                    # Variáveis de ambiente
└── docker-compose.yml      # Orquestração dos serviços (db, backend, frontend)

Endpoints da API
A API está rodando em http://localhost:3000/api.

Método	Rota	Descrição
GET	/health	Verifica a saúde da API e a conexão com o banco de dados.
GET	/users	Lista todos os usuários cadastrados.
GET	/users/:id	Busca um usuário específico pelo seu id.
POST	/users	Cria um novo usuário.
PUT	/users/:id	Atualiza os dados de um usuário.
DELETE	/users/:id	Exclui um usuário do banco de dados.
