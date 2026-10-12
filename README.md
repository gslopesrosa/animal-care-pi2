# Animal Care — Backend

Backend da aplicação **Animal Care**, desenvolvido como parte do Projeto Integrador II da UNIVESP.

O projeto tem como objetivo ajudar tutores a organizar os cuidados dos seus animais de estimação, centralizando informações cadastrais e possibilitando a evolução para o gerenciamento de vacinas, medicamentos, consultas veterinárias e lembretes.


## Tecnologias

* Node.js
* TypeScript
* Express
* PostgreSQL
* Prisma ORM
* Zod — validação de dados
* bcrypt — hash de senhas
* JSON Web Token (JWT) — autenticação
* Swagger / OpenAPI — documentação da API

## Pré-requisitos

Antes de executar o projeto, instale:

1. Node.js e npm.
2. PostgreSQL.
3. Git.

Verifique as instalações pelo terminal:

```bash
node --version
npm --version
git --version
```

## Instalação e configuração

### 1. Clonar o repositório

Caso ainda não tenha o projeto localmente:

```bash
git clone <URL_DO_REPOSITORIO>
cd animal-care-pi2/backend
```

Se o projeto já estiver clonado, basta acessar a pasta `backend`.

### 2. Instalar as dependências

```bash
npm install
```

O `package.json` e o `package-lock.json` devem ser mantidos no Git para que as dependências possam ser instaladas de maneira reproduzível.

### 3. Criar o banco de dados

No PostgreSQL, crie um banco chamado `animal_care`:

```sql
CREATE DATABASE animal_care;
```

O nome pode ser alterado, desde que a variável `DATABASE_URL` seja ajustada de acordo.

### 4. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz de `backend`, ao lado do `package.json`:

```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/animal_care?schema=public"
JWT_SECRET="SUBSTITUA_POR_UM_SEGREDO_LONGO_E_ALEATORIO"
PORT=3000
```

Substitua `USUARIO` e `SENHA` pelas credenciais locais do PostgreSQL.

O `JWT_SECRET` deve ser um segredo forte, aleatório e exclusivo para cada ambiente.

**Importante:** o arquivo `.env` não deve ser enviado ao Git, pois contém credenciais e segredos. Nunca utilize os valores de exemplo em produção.

### 5. Preparar o Prisma

O projeto utiliza Prisma 7, com o schema localizado em `prisma/schema.prisma` e a configuração em `prisma.config.ts`.

Gere o Prisma Client:

```bash
npx prisma generate
```

Se o repositório possuir migrações versionadas em `prisma/migrations`, aplique-as em um banco novo com:

```bash
npx prisma migrate deploy
```

Se ainda não houver migrações, confira o procedimento de sincronização adotado pela equipe antes de modificar o banco. Evite comandos de reset ou sincronização sem verificar o impacto sobre os dados existentes.

Para consultar os registros do banco usando uma interface visual:

```bash
npx prisma studio
```

O endereço padrão do Prisma Studio é `http://localhost:5555`.

## Executar a aplicação

Na pasta `backend`, execute o script de desenvolvimento configurado no `package.json`. Se houver um script `dev`, normalmente será:

```bash
npm run dev
```

Caso o script tenha outro nome, consulte a seção `scripts` do `package.json`.

Com a API em execução, o endereço local esperado é:

* API: `http://localhost:3000`
* Swagger: `http://localhost:3000/api-docs`

A porta pode mudar conforme a configuração da variável `PORT`.

## Documentação Swagger

A documentação interativa está disponível em:

**http://localhost:3000/api-docs**

O Swagger permite visualizar os endpoints, consultar os parâmetros e executar requisições sem precisar de um cliente HTTP separado.

Para testar uma rota protegida:

1. Execute `POST /sessions` para autenticar um usuário.
2. Copie o token JWT retornado.
3. Clique em **Authorize** no Swagger.
4. Informe o token no formato solicitado. Se necessário, utilize `Bearer SEU_TOKEN`.
5. Execute o endpoint desejado.

O token de autenticação tem validade configurada no serviço de login. Atualmente, a validade é de um dia.

## Endpoints disponíveis

Os seguintes endpoints foram implementados e testados manualmente pelo Swagger.

| Método | Endpoint    | Autenticação | Descrição                          |
| ------ | ----------- | ------------ | ---------------------------------- |
| POST   | `/users`    | Não          | Cadastrar usuário                  |
| POST   | `/sessions` | Não          | Autenticar usuário e obter JWT     |
| GET    | `/users/me` | Sim          | Consultar o usuário autenticado    |
| POST   | `/pets`     | Sim          | Cadastrar pet                      |
| GET    | `/pets`     | Sim          | Listar pets do usuário autenticado |
| GET    | `/pets/:id` | Sim          | Consultar pet por ID               |
| PUT    | `/pets/:id` | Sim          | Atualizar dados de um pet          |
| DELETE | `/pets/:id` | Sim          | Excluir um pet                     |

### Exemplos de requisição

**Cadastro de usuário — `POST /users`**

```json
{
  "name": "Usuário Teste",
  "email": "teste@animalcare.com",
  "password": "123456"
}
```

**Login — `POST /sessions`**

```json
{
  "email": "teste@animalcare.com",
  "password": "123456"
}
```

**Cadastro de pet — `POST /pets`**

Essa requisição exige um token JWT válido.

```json
{
  "name": "Rex",
  "species": "Cachorro",
  "breed": "Labrador",
  "sex": "Macho",
  "birthDate": "2023-05-10T00:00:00.000Z",
  "weight": 12.5
}
```

**Atualização de pet — `PUT /pets/:id`**

É possível enviar apenas os campos que precisam ser alterados.

```json
{
  "weight": 13.2
}
```

### Regras de segurança

* As senhas são armazenadas utilizando hash com bcrypt.
* O login retorna um token JWT.
* Os endpoints protegidos exigem autenticação.
* As operações sobre pets verificam o vínculo entre o pet e o usuário autenticado.
* A exclusão de um pet é definitiva e, devido aos relacionamentos configurados com `onDelete: Cascade`, também remove os registros dependentes associados.

## Estrutura do projeto

Estrutura principal do backend:

```text
backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/
│   ├── database/
│   ├── generated/
│   │   └── prisma/
│   ├── modules/
│   │   ├── users/
│   │   │   ├── controllers/
│   │   │   ├── middlewares/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── schemas/
│   │   │   └── services/
│   │   ├── pets/
│   │   │   ├── controllers/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── schemas/
│   │   │   └── services/
│   │   └── ...
│   ├── app.ts
│   └── server.ts
├── .env
├── package.json
├── package-lock.json
├── prisma.config.ts
└── tsconfig.json
```

A estrutura pode conter outros arquivos auxiliares conforme o desenvolvimento evoluir.

### Responsabilidade das principais pastas

* **`config/`**: configurações da aplicação.
* **`database/`**: conexão e acesso ao banco de dados.
* **`generated/prisma/`**: arquivos gerados pelo Prisma Client; não devem ser editados manualmente.
* **`modules/users/`**: funcionalidades de cadastro, autenticação e consulta de usuários.
* **`modules/pets/`**: funcionalidades de cadastro, consulta, atualização e exclusão de pets.
* **`controllers/`**: recebem requisições e retornam respostas HTTP.
* **`middlewares/`**: executam verificações intermediárias, como a autenticação JWT.
* **`repositories/`**: concentram as operações de persistência usando Prisma.
* **`routes/`**: definem os endpoints e seus middlewares.
* **`schemas/`**: validam os dados recebidos, utilizando Zod.
* **`services/`**: concentram as regras de negócio.
* **`app.ts`**: configura a aplicação Express, suas rotas e seus middlewares.
* **`server.ts`**: inicializa o servidor.
* **`prisma/schema.prisma`**: define os modelos e relacionamentos do banco.
* **`prisma.config.ts`**: configura o Prisma.

## Modelo de dados

O schema atual possui os seguintes modelos:

| Modelo                  | Finalidade                        |
| ----------------------- | --------------------------------- |
| `User`                  | Usuários da aplicação             |
| `Pet`                   | Animais cadastrados por usuários  |
| `Feeding`               | Registros de alimentação          |
| `Medication`            | Medicamentos e informações de uso |
| `Vaccination`           | Vacinas e datas de aplicação      |
| `VeterinaryAppointment` | Consultas veterinárias            |
| `Activity`              | Atividades e duração              |
| `Grooming`              | Registros de higiene e cuidados   |
| `Reminder`              | Lembretes associados aos pets     |
| `Clinic`                | Clínicas associadas a usuários    |
| `Service`               | Serviços disponíveis              |

Os modelos já definidos no Prisma não significam que todos os módulos tenham endpoints implementados. No estado atual, o CRUD de pets e as operações básicas de usuários estão disponíveis; os módulos de cuidados serão desenvolvidos nas próximas etapas.

## Arquitetura

O código segue uma separação de responsabilidades inspirada na arquitetura em camadas.

```text
Requisição HTTP
      ↓
Routes / Middleware
      ↓
Controller
      ↓
Schema (validação)
      ↓
Service (regras de negócio)
      ↓
Repository
      ↓
Prisma / PostgreSQL
```

### Como funciona cada camada

1. **Routes:** definem os caminhos HTTP e os middlewares utilizados.
2. **Controller:** recebe a requisição, coordena a operação e monta a resposta HTTP.
3. **Schema:** valida os dados de entrada antes de executar a operação.
4. **Service:** aplica as regras de negócio.
5. **Repository:** consulta e altera os dados persistidos no banco.

Essa organização facilita a manutenção, os testes e a evolução dos módulos.

## Validação e testes

Para verificar se o TypeScript compila sem gerar arquivos de saída:

```bash
npx tsc --noEmit
```

Os endpoints foram testados manualmente pelo Swagger. Também devem ser verificados cenários como:

* Dados inválidos.
* E-mail já cadastrado.
* Senha incorreta.
* Token ausente ou expirado.
* Pet inexistente.
* Tentativa de acessar um pet pertencente a outro usuário.

Os testes automatizados com Jest e Supertest podem ser adicionados e documentados quando estiverem configurados no projeto.

## Git e boas práticas

Antes de realizar o commit, confira os arquivos modificados:

```bash
git status
git diff
```

Garanta que o `.gitignore` contenha regras adequadas, por exemplo:

```gitignore
node_modules/
dist/
.env
.env.*
!.env.example
coverage/
```

Não envie senhas, tokens JWT ou o arquivo `.env` para o repositório. Se algum segredo já tiver sido publicado, ele deve ser substituído.

Depois de conferir as alterações e executar `npx tsc --noEmit`, prepare o commit:

```bash
git add README.md
git add src prisma package.json package-lock.json
git status
git diff --cached
git commit -m "docs: adiciona README e documenta backend"
git push
```

Confira o conteúdo preparado para o commit antes de confirmar. Adicione outros arquivos apenas depois de revisar as alterações. Não inclua o `.env`.

## Próximas etapas

* Implementar o módulo de vacinação.
* Implementar medicamentos, alimentação, consultas, atividades, higiene e lembretes.
* Criar testes automatizados com Jest e Supertest.
* Integrar o backend ao frontend React.
* Revisar as configurações de segurança e preparar o deploy.
