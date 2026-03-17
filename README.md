# 🏢 Cliente API

API REST para gerenciamento de clientes.

## 🛠️ Tecnologias

- Java 8
- Spring Boot 2.7
- Spring Security + JWT
- Spring Data JPA / Hibernate
- PostgreSQL
- Maven

## 🚀 Como rodar

### Pré-requisitos
- JDK 8+
- PostgreSQL rodando
- Maven 3.6+

### Configuração

1. Clone o repositório:
   \`\`\`bash
   git clone https://github.com/GustavoScot/cliente-api.git
   cd cliente-api
   \`\`\`

2. Crie o banco de dados:
   \`\`\`sql
   CREATE DATABASE clientedb;
   \`\`\`

3. Configure `src/main/resources/application.yml` com suas credenciais.

4. Execute:
   \`\`\`bash
   mvn spring-boot:run
   \`\`\`

API disponível em: `http://localhost:8080`

## 🔐 Autenticação

| Usuário | Senha | Permissão |
|---------|-------|-----------|
| admin | 123qwe!@# | CRUD completo |
| user | 123qwe123 | Apenas leitura |

Faça login em `POST /auth/login` e use o token no header:
`Authorization: Bearer <token>`

## 📋 Endpoints

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| POST | /auth/login | Autenticar | Público |
| GET | /clientes | Listar | USER/ADMIN |
| GET | /clientes/{id} | Buscar | USER/ADMIN |
| POST | /clientes | Criar | ADMIN |
| PUT | /clientes/{id} | Atualizar | ADMIN |
| DELETE | /clientes/{id} | Deletar | ADMIN |

## 🏗️ Arquitetura

O projeto segue arquitetura em camadas:
`Controller → Service → Repository → Entity`

Com DTOs para entrada/saída e Mapper para conversão.