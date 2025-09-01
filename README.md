<p align="center">
  <img src="https://raw.githubusercontent.com/zuamirgoliveira/app-pr-tracker/main/public/banner-pr-tracker.png" alt="Logo Manta Ray Zap AI" width="500" />
</p>

# 🚀 PR Tracker - Pull Request Management Dashboard

> **Nota:** Este projeto foi criado em VibeCoding utilizando a Claude Sonnet 4.

## 📋 Sobre o Projeto

O PR Tracker é uma aplicação web moderna desenvolvida em React/TypeScript para gerenciamento e monitoramento de Pull Requests do Azure DevOps. A aplicação oferece uma interface intuitiva para visualizar, filtrar e acompanhar o status de PRs em diferentes organizações, projetos e repositórios.

## ✨ Funcionalidades

### 🔐 Autenticação
- Login via Personal Access Token do Azure DevOps
- Suporte a múltiplas organizações

### 📊 Dashboard Hierárquico
- **Projetos**: Listagem e busca de projetos na organização
- **Repositórios**: Visualização de repositórios por projeto com busca
- **Pull Requests**: Lista detalhada de PRs com informações completas

### 🔍 Filtros e Busca
- **Busca por nome**: Projetos e repositórios
- **Filtro por status**: Active, Completed, Abandoned (padrão: Active)
- **Ordenação inteligente**: PRs ativos mais recentes primeiro

### 📈 Informações Detalhadas
- **Status visual**: Ícones e cores por status do PR
- **SLA colorido**: Indicação visual do tempo decorrido
- **Reviewers**: Status de aprovação com ícones intuitivos
- **Branches**: Visualização clara de source → target
- **Ações rápidas**: Abrir PR e copiar URL

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Arquitetura**: Controller + Utils pattern
- **Styling**: CSS Modules com design responsivo
- **State Management**: React Hooks (useState, useMemo)
- **API**: Azure DevOps REST API

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── LoginForm.tsx
│   ├── PullRequestList.tsx
│   ├── RepositoryList.tsx
│   └── ProjectList.tsx
├── controllers/         # Lógica de negócio
│   └── PullRequestController.ts
├── utils/              # Utilitários e formatação
│   ├── cache.ts
│   └── PullRequestUtils.ts
├── types/              # Definições TypeScript
│   └── index.ts
└── styles/             # Estilos CSS
    ├── checkbox.css
    ├── search.css
    ├── status-filter.css
    ├── title-validation.css
    └── typography.css
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+
- NPM ou Yarn
- Personal Access Token do Azure DevOps

### Instalação
```bash
# Clone o repositório
git clone [repository-url]
cd app-pr-tracker

# Instale as dependências
npm install

# Execute o projeto local navegador
npm run dev

# Execute o projeto local tauri (precisa ter rust e tauri cli instalados)
npx run tauri dev

# Crie o executável (src-tauri\target\release\app-pr-tracker.exe)
npx run tauri build
```

### Configuração
1. Obtenha um Personal Access Token do Azure DevOps
2. Faça login na aplicação usando:
   - **Organization**: Nome da sua organização
   - **Token**: Seu Personal Access Token

## 💡 Funcionalidades Principais

### 🎯 Sistema de Status
- **Active** ⏱️: PRs em andamento
- **Completed** ✅: PRs finalizados
- **Abandoned** ❌: PRs abandonados

### ⏱️ SLA Visual
- **Verde**: Até 24h (Fresh)
- **Amarelo**: 24-72h (Moderate)
- **Laranja**: 3-7 dias (Old)
- **Vermelho**: +7 dias (Critical)

### 👥 Status de Reviewers
- **⏳**: Aguardando revisão
- **✓**: Aprovado
- **✗**: Rejeitado

## 🎨 Design Patterns Utilizados

### Controller Pattern
- Separação clara entre lógica de negócio e UI
- Reutilização de código entre componentes
- Facilita testes unitários

### Utils Pattern
- Funções utilitárias centralizadas
- Formatação de dados consistente
- Operações de clipboard e validações

### Component Composition
- Componentes reutilizáveis e modulares
- Props tipadas com TypeScript
- Hooks personalizados para estado

## 🔧 Arquitetura

```
View (React Components)
    ↓
Controller (Business Logic)
    ↓
Utils (Data Processing & Formatting)
    ↓
Azure DevOps API
```

## 📱 Responsividade

- Design mobile-first
- Breakpoints otimizados
- Layout adaptativo para todos os dispositivos

## 🚧 Próximas Funcionalidades

- [ ] Dashboard de métricas
- [ ] Notificações em tempo real
- [ ] Exportação de dados
- [ ] Temas customizáveis
- [ ] Filtros avançados por autor/reviewer
- [ ] Integração com outros provedores Git

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir melhorias
- Enviar pull requests
- Compartilhar ideias

---

**Desenvolvido com ❤️ usando VibeCoding e Claude Sonnet 4**
