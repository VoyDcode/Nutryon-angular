# Nutryon Angular - Frontend

Interface moderna e responsiva para o sistema **Nutryon**, focada no acompanhamento nutricional dinâmico, planejamento de refeições e visualização de macronutrientes.

## 👥 Integrantes
- **Renato** (RM560928)
- **Victor** (RM560087)
- **Luan Noqueli Klochko** (RM560313)
- **Lucas Higuti Fontanezi** (RM561120)

---

## 🔗 Projeto Conectado (Backend)
Esta aplicação consome a API desenvolvida em Java Spring Boot disponível em:
👉 [https://github.com/VoyDcode/Nutryon](https://github.com/VoyDcode/Nutryon)

---

## 🚀 Instruções de Instalação e Execução

### Pré-requisitos
- **Node.js**: v18 ou superior.
- **Angular CLI**: v19+.
- **Backend Nutryon**: Deve estar rodando na porta `8080` (ou conforme configurado no proxy).

### 1. Instalação de Dependências
Abra o terminal na pasta raiz do projeto e execute:
```bash
npm install
```

### 2. Configuração de Proxy (CORS)
O projeto está configurado para utilizar um proxy reverso para evitar problemas de CORS com o backend. O arquivo `proxy.conf.json` direciona as chamadas `/api` e `/auth` para `http://localhost:8080`.

### 3. Execução do Servidor de Desenvolvimento
Para iniciar a aplicação, utilize o comando:
```bash
npm run start
```
ou
```bash
ng serve
```

### 4. Acesso à Aplicação
Após o build inicial, a aplicação estará disponível no endereço:
👉 **[http://localhost:4200/](http://localhost:4200/)**

---

## 🛠️ Tecnologias Utilizadas
- **Angular 19+** (Standalone Components)
- **Tailwind CSS v4** (Design System & Estilização)
- **Lucide Angular** (Ícones)
- **RxJS** (Comunicação Assíncrona via HttpClient)
- **PostCSS** (Processamento de estilos)

---

## 📈 Funcionalidades Implementadas
- **Dashboard Dinâmico**: Visualização de progresso diário de calorias e macros.
- **Registro de Refeições**: Integração com as procedures do backend para criação de ingredientes e vínculos de refeição.
- **Autenticação (JWT)**: Login e Registro integrados com o Spring Security do backend.
- **Onboarding Personalizado**: Coleta de dados físicos e definição de metas salvos localmente.
- **Relatórios**: Histórico semanal e evolução nutricional.
