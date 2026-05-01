# Destak Publicidade

Plataforma profissional para gerenciamento de publicidade sonora (carro de som) para o comércio local.

## Stack Tecnológica

- **Frontend**: React 18 + Vite + TailwindCSS + React Router v6
- **Backend API**: Node.js + Express.js + Prisma ORM
- **IA/Processamento de áudio**: Python 3 + FastAPI
- **Banco de dados**: SQLite (via Prisma)
- **Autenticação**: JWT + bcrypt

## Instalação e Execução

### Pré-requisitos

- Node.js 18+
- Python 3.10+
- pip

### 1. Instalar dependências

```bash
npm run install:all
pip install -r audio-service/requirements.txt
```

### 2. Configurar banco e seed

```bash
npm run setup
```

### 3. Rodar tudo

```bash
npm run dev
```

### Portas

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001 |
| Audio Service | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

### Login padrão (seed)

- **Email**: admin@destak.com
- **Senha**: destak2025

## Estrutura do Projeto

```
destak-publicidade/
├── frontend/           # React + Vite
├── backend/            # Node.js + Express + Prisma
├── audio-service/      # Python + FastAPI
└── package.json        # Scripts root
```

## Funcionalidades

- 🎙️ Estúdio de Locução com IA (TTS, Clone de Voz, Upload, Mixer)
- 📅 Agendamento de campanhas
- 👥 Gestão de clientes
- 💰 Módulo financeiro completo
- 📄 Emissão de NF-e MEI
- 📊 Relatórios e dashboards
- 🎵 Integração com YouTube para músicas

## Licença

MIT
