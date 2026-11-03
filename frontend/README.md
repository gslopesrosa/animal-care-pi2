# Animal Care - Front-end (React + Vite + Tailwind CSS)

Interface web do projeto **Animal Care (PI-2)**, desenvolvida em React.js com Tailwind CSS v4 para gestão de pets, acompanhamento do histórico vacinal e visualização de indicadores de cuidados em tempo real.

---

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado na sua máquina:
* [Node.js](https://nodejs.org/) (Versão 18.x ou superior)
* [npm](https://www.npmjs.com/) (Gerenciador de pacotes padrão)
* A API Backend do projeto executando localmente (por padrão na porta `http://localhost:3000`)

---

## Instalação e Configuração

### 1. Clonar o Repositório
```bash
git clone https://github.com/samibaleeiro-lgtm/animal-care-pi2.git
cd animal-care-pi2/frontend
```

### 2. Instalar as Dependências
Execute o comando abaixo para instalar as bibliotecas do projeto:
```bash
npm install
```

Caso precise validar as bibliotecas de interface e estilos instaladas:
```bash
npm install lucide-react axios
npm install -D tailwindcss @tailwindcss/postcss postcss autoprefixer
```

### 3. Configurar Variáveis de Ambiente
Crie o arquivo `.env` na raiz da pasta `frontend`:

* **No Windows PowerShell:**
  ```powershell
  Copy-Item .env.example .env
  ```
* **No Linux / Mac / Git Bash:**
  ```bash
  cp .env.example .env
  ```

Edite o arquivo `.env` para apontar para a URL da API Node.js:
```env
VITE_API_URL=http://localhost:3000/api
```

---

## Arquivos de Configuração do Tailwind CSS v4

### `postcss.config.js`
Garante a compilação do Tailwind v4 com o Vite:
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### `src/styles/global.css` (ou `src/index.css`)
Importação direta do motor do Tailwind:
```css
@import "tailwindcss";
```

---

## Estrutura de Pastas

```text
frontend/
├── public/                # Favicon e recursos estáticos
├── src/
│   ├── assets/            # Imagens e ícones estáticos
│   ├── components/        # Componentes reutilizáveis de UI
│   ├── services/          # Cliente Axios e chamadas à API (api.js)
│   ├── styles/            # Estilos globais (global.css)
│   ├── App.jsx            # Componente principal contendo as telas e estado
│   └── main.jsx           # Ponto de entrada da aplicação no React/Vite
├── .env                   # Variáveis de ambiente
├── index.html             # Estrutura HTML base
├── postcss.config.js      # Configuração do PostCSS
├── tailwind.config.js     # Configuração das rotas de scan do Tailwind
└── package.json           # Dependências e scripts da aplicação
```

---

## Como Executar a Aplicação

1. Certifique-se de que a API do Backend está em execução no Terminal 1.
2. No Terminal 2 (dentro do diretório `frontend`), execute:

```bash
npm run dev
```

3. Acesse o endereço local exibido no terminal (geralmente `http://localhost:5173`).

---

## Build de Produção

Para gerar a versão compilada e minificada para produção:

```bash
npm run build
```

Para visualizar a build de produção localmente:

```bash
npm run preview
```
