# 👥 Cliente API — Full Stack

Sistema completo para cadastro e gerenciamento de clientes com autenticação JWT.

![Java](https://img.shields.io/badge/Java-8-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7-green)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue)

---

## 📋 Índice

- [Sobre o projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Como rodar](#-como-rodar)
- [Autenticação](#-autenticação)
- [Endpoints da API](#-endpoints-da-api)
- [Estrutura de pastas](#-estrutura-de-pastas)
- [Funcionalidades](#-funcionalidades)
- [Variáveis de configuração](#-variáveis-de-configuração)

---

## 📌 Sobre o projeto

API REST com interface web para gerenciamento completo de clientes. O sistema permite cadastrar clientes com múltiplos telefones, emails e endereço com preenchimento automático via CEP. O acesso é protegido por autenticação JWT com dois níveis de permissão.

---

## 🛠️ Tecnologias

### Backend
| Tecnologia | Versão | Uso |
|---|---|---|
| Java | 8 | Linguagem principal |
| Spring Boot | 2.7.18 | Framework backend |
| Spring Security | 5.x | Autenticação e autorização |
| Spring Data JPA | 2.7.x | Acesso ao banco de dados |
| Hibernate | 5.x | ORM / mapeamento objeto-relacional |
| JWT (jjwt) | 0.11.5 | Tokens de autenticação |
| Maven | 3.6+ | Gerenciamento de dependências |
| Lombok | 1.18.x | Redução de código boilerplate |
| PostgreSQL | 12+ | Banco de dados relacional |

### Frontend
| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18 | Biblioteca de interface |
| Vite | 5 | Bundler e servidor de desenvolvimento |
| React Router DOM | 6 | Navegação entre páginas |
| Axios | 1.x | Cliente HTTP com interceptores JWT |
| React Hot Toast | 2.x | Notificações de feedback |
| CSS Modules | — | Estilização com escopo por componente |

---

## 🏗️ Arquitetura

O projeto segue o padrão **monorepo** com duas aplicações independentes:

```
cliente-api/
├── backend/    → API REST (Spring Boot)
└── frontend/   → Interface web (React + Vite)
```

### Backend — Camadas

```
Controller → Service → Repository → Entity
               ↕            ↕
             Mapper       PostgreSQL
               ↕
              DTO
```

| Camada | Responsabilidade |
|---|---|
| `controller` | Recebe requisições HTTP e delega ao service |
| `service` | Lógica de negócio e orquestração |
| `repository` | Acesso ao banco via JPA |
| `entity` | Mapeamento das tabelas do banco |
| `dto` | Objetos de entrada e saída da API |
| `mapper` | Conversão entre entity e DTO |
| `security` | JWT, filtros e controle de acesso |
| `config` | Configurações de CORS, WebClient e PasswordEncoder |
| `exception` | Tratamento global de erros |
| `util` | Utilitários de máscara (CPF, CEP, telefone) |

### Frontend — Estrutura

| Pasta | Responsabilidade |
|---|---|
| `api/` | Instância do Axios com interceptores JWT |
| `assets/` | Imagens utilizadas |
| `contexts/` | Estado global de autenticação |
| `hooks/` | Lógica de dados reutilizável (CRUD de clientes) |
| `pages/` | Páginas da aplicação (Login, Lista, Formulário) |
| `components/` | Componentes reutilizáveis (Layout, PrivateRoute) |
| `utils/` | Funções de máscara (CPF, CEP, telefone) |

---

## ✅ Pré-requisitos

| Ferramenta | Versão mínima |
|---|---|
| JDK | 8 |
| Maven | 3.6+ |
| PostgreSQL | 12+ |
| Node.js | 18+ |
| npm | 9+ |

---

## 🚀 Como rodar

### 1. Clone o repositório

```bash
git clone https://github.com/GustavoScot/cliente-api.git
cd cliente-api
```

### 2. Configure o banco de dados

No PostgreSQL, crie o banco:

```sql
CREATE DATABASE clientedb;
```

### 3. Configure o backend

Edite o arquivo `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/clientedb
    username: postgres
    password: SUA_SENHA_AQUI

app:
  jwt:
    secret: "SuaChaveSecretaComNoMinimo32Caracteres2026!"
    expiration: 3600000
```

> ⚠️ O `secret` precisa ter no mínimo 32 caracteres (256 bits) para o algoritmo HS256.

### 4. Inicie o backend

```bash
cd backend
mvn spring-boot:run
```

API disponível em: `http://localhost:8080`

O Hibernate cria as tabelas automaticamente na primeira execução (`ddl-auto: update`).

### 5. Instale as dependências do frontend

```bash
cd frontend
npm install
```

### 6. Inicie o frontend

```bash
npm run dev
```

Interface disponível em: `http://localhost:5173`

> O Vite redireciona `/api/*` para `localhost:8080` via proxy — não é necessário nenhuma configuração adicional.

---

## 🔐 Autenticação

O sistema usa **JWT (JSON Web Token)**. Faça login para receber o token e use-o no header das requisições.

### Usuários disponíveis

| Usuário | Senha | Permissão |
|---|---|---|
| `admin` | `123qwe!@#` | CRUD completo (criar, editar, deletar, consultar) |
| `user` | `123qwe123` | Apenas leitura (consultar) |

### Como autenticar no Postman

**1. Faça login:**
```
POST http://localhost:8080/auth/login
Content-Type: application/json

{
  "login": "admin",
  "senha": "123qwe!@#"
}
```

**2. Use o token retornado:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

---

## 📡 Endpoints da API

### Autenticação

| Método | Endpoint | Descrição | Acesso |
|---|---|---|---|
| POST | `/auth/login` | Autenticar e obter token JWT | Público |

### Clientes

| Método | Endpoint | Descrição | Acesso |
|---|---|---|---|
| GET | `/clientes` | Listar clientes (paginado) | USER / ADMIN |
| GET | `/clientes/{id}` | Buscar cliente por ID | USER / ADMIN |
| POST | `/clientes` | Criar novo cliente | ADMIN |
| PUT | `/clientes/{id}` | Atualizar cliente | ADMIN |
| DELETE | `/clientes/{id}` | Remover cliente | ADMIN |

### Paginação

```
GET /clientes?page=0&size=10&sort=nome,asc
```

### Exemplo de payload — criar/atualizar cliente

```json
{
  "nome": "João da Silva",
  "cpf": "12345678909",
  "endereco": {
    "cep": "01310100",
    "logradouro": "Avenida Paulista",
    "complemento": "Apto 42",
    "bairro": "Bela Vista",
    "cidade": "São Paulo",
    "uf": "SP"
  },
  "telefones": [
    { "tipo": "CELULAR", "numero": "11987654321" },
    { "tipo": "RESIDENCIAL", "numero": "1133334444" }
  ],
  "emails": [
    { "endereco": "joao@email.com" }
  ]
}
```

### Respostas de erro padronizadas

```json
{
  "status": 400,
  "erro": "Erro de Validação",
  "mensagem": "Um ou mais campos estão inválidos",
  "timestamp": "2024-01-15T10:30:00",
  "detalhes": [
    "nome: Nome permite apenas letras, números e espaços",
    "cpf: CPF deve ter 11 dígitos"
  ]
}
```

---

## 📁 Estrutura de pastas

```
cliente-api/
│
├── backend/
│   └── src/main/java/com/seunome/
│       ├── ClienteApiApplication.java
│       ├── config/
│       │   ├── CorsConfig.java
│       │   ├── PasswordConfig.java
│       │   └── WebClientConfig.java
│       ├── controller/
│       │   ├── AuthController.java
│       │   └── ClienteController.java
│       ├── dto/
│       │   ├── request/
│       │   │   ├── ClienteRequest.java
│       │   │   ├── EmailRequest.java
│       │   │   ├── EnderecoRequest.java
│       │   │   ├── LoginRequest.java
│       │   │   └── TelefoneRequest.java
│       │   └── response/
│       │       ├── ClienteResponse.java
│       │       ├── EmailResponse.java
│       │       ├── EnderecoResponse.java
│       │       ├── ErroResponse.java
│       │       ├── LoginResponse.java
│       │       ├── TelefoneResponse.java
│       │       └── ViaCepResponse.java
│       ├── entity/
│       │   ├── Cliente.java
│       │   ├── Email.java
│       │   ├── Endereco.java
│       │   └── Telefone.java
│       ├── exception/
│       │   ├── CepInvalidoException.java
│       │   ├── GlobalExceptionHandler.java
│       │   └── RecursoNaoEncontradoException.java
│       ├── mapper/
│       │   └── ClienteMapper.java
│       ├── repository/
│       │   ├── ClienteRepository.java
│       ├── security/
│       │   ├── JwtFilter.java
│       │   ├── JwtUtil.java
│       │   ├── SecurityConfig.java
│       │   └── UserDetailsServiceImpl.java
│       ├── service/
│       │   ├── AuthService.java
│       │   ├── ClienteService.java
│       │   └── ViaCepService.java
│       └── util/
│           └── MascaraUtil.java
│
├── frontend/
│   └── src/
│       ├── api/
│       │   └── axios.js
│       ├── components/
│       │   ├── Layout/
│       │   │   ├── Layout.jsx
│       │   │   └── Layout.module.css
│       │   └── PrivateRoute/
│       │       └── PrivateRoute.jsx
│       ├── contexts/
│       │   └── AuthContext.jsx
│       ├── hooks/
│       │   └── useClientes.js
│       ├── pages/
│       │   ├── ClienteForm/
│       │   │   ├── ClienteForm.jsx
│       │   │   └── ClienteForm.module.css
│       │   ├── Clientes/
│       │   │   ├── ClientesLista.jsx
│       │   │   └── ClientesLista.module.css
│       │   └── Login/
│       │       ├── Login.jsx
│       │       └── Login.module.css
│       ├── utils/
│       │   └── mascaras.js
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
│
├── .gitignore
└── README.md
```

---

## ⚙️ Funcionalidades

### Backend
- ✅ Autenticação JWT com dois níveis de acesso (ADMIN e USER)
- ✅ CRUD completo de clientes
- ✅ Preenchimento automático de endereço via API ViaCEP
- ✅ Múltiplos telefones e emails por cliente
- ✅ Validação de dados com Bean Validation
- ✅ Tratamento global de erros com respostas padronizadas
- ✅ Paginação e ordenação na listagem
- ✅ CPF, CEP e telefone armazenados sem máscara e exibidos com máscara
- ✅ Auditoria de criação e atualização dos registros
- ✅ Logs detalhados por camada

### Frontend
- ✅ Login com mensagem de erro em tela
- ✅ Rotas protegidas por autenticação e perfil
- ✅ Listagem paginada de clientes
- ✅ Máscara em tempo real para CPF e telefone
- ✅ Preenchimento automático de endereço pelo CEP
- ✅ Formulário de cadastro e edição com validações específicas por campo
- ✅ Confirmação antes de excluir
- ✅ Notificações de sucesso e erro
- ✅ Navbar com identificação do usuário e botão de logout
- ✅ Controle de permissão na interface (botões ocultos para USER)

---

## 🔧 Variáveis de configuração

### Backend — `application.yml`

| Variável | Descrição | Padrão |
|---|---|---|
| `spring.datasource.url` | URL de conexão com o PostgreSQL | `jdbc:postgresql://localhost:5432/clientedb` |
| `spring.datasource.username` | Usuário do banco | `postgres` |
| `spring.datasource.password` | Senha do banco | — |
| `spring.jpa.hibernate.ddl-auto` | Estratégia do schema (`update` / `create-drop`) | `update` |
| `app.jwt.secret` | Chave secreta JWT (mínimo 32 caracteres) | — |
| `app.jwt.expiration` | Expiração do token em ms | `3600000` (1 hora) |
| `app.viacep.url` | URL base da API ViaCEP | `https://viacep.com.br/ws` |

### Frontend — `vite.config.js`

| Variável | Descrição | Padrão |
|---|---|---|
| `server.port` | Porta do servidor de desenvolvimento | `5173` |
| `proxy['/api'].target` | URL do backend | `http://localhost:8080` |

---

### Padrão de commits

| Prefixo | Quando usar |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `chore` | Configuração, dependências |
| `refactor` | Refatoração sem mudança de comportamento |
| `docs` | Documentação |
| `style` | Formatação, sem lógica |
