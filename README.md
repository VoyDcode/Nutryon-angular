# 3º Sprint – 2º Semestre: Java & DevOps Tools e Cloud Computing
## Projeto Nutryon (Frontend Angular)

---

## Integrantes e RMs

| Nome | RM |
|---|---|
| Renato | RM560928 |
| Victor Lima | RM560087 |
| Luan Noqueli Klochko | RM560313 |
| Lucas Higuti Fontanezi | RM561120 |

---

## 1. Objetivo

Interface moderna e responsiva do sistema **Nutryon** — plataforma de planejamento nutricional e controle de macronutrientes. O frontend consome a API REST do backend Java Spring Boot.

Este repositório contém o **frontend** em Angular. O backend Java está em: [Nutryon](https://github.com/VoyDcode/Nutryon)

---

## 2. Repositórios

| Componente | Repositório |
|---|---|
| Frontend Angular | https://github.com/VoyDcode/Nutryon-angular |
| Backend Java | https://github.com/VoyDcode/Nutryon |

---

## 3. Feedback anterior e correções aplicadas

| Feedback recebido | Correção aplicada |
|---|---|
| Testes apenas em localhost | Testes documentados em ambiente cloud (seção 13) |
| Banco Oracle FIAP | Backend migrado para Oracle Cloud Autonomous Database |
| README incompleto | README reescrito com testes cloud, arquitetura e links |
| Ausência de DDL | Arquivo `database/ddl.sql` incluído no repositório do backend |

---

## 4. Arquitetura em nuvem

```
Usuário
  ↓ HTTPS
Azure Static Web Apps
Frontend Angular (este repositório)
  ↓ HTTPS/JSON  
Azure Web App
Backend Nutryon API - Spring Boot
  ↓ JDBC
Oracle Cloud Autonomous Database
```

---

## 5. Serviços e tecnologias

| Tecnologia | Versão | Função |
|---|---|---|
| Angular | 21.1.0 | Framework principal (Standalone Components) |
| TypeScript | 5.9.2 | Linguagem |
| Tailwind CSS | 4.2.2 | Estilização |
| Lucide Angular | 1.0.0 | Ícones |
| RxJS | 7.8.0 | HttpClient assíncrono |
| Azure Static Web Apps | — | Hosting em nuvem |
| Azure DevOps Pipelines | — | CI/CD com approval gate (build + deploy) |

---

## 6. Configuração de ambientes

### Desenvolvimento local (environment.ts)

```typescript
export const environment = {
  production: false,
  apiUrl: '/api',   // proxy redireciona para localhost:8080
  authUrl: '/auth'
};
```

### Produção / Nuvem (environment.prod.ts)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://nutryon-f8h2e8bqa0d7gjbx.southafricanorth-01.azurewebsites.net/api',
  authUrl: 'https://nutryon-f8h2e8bqa0d7gjbx.southafricanorth-01.azurewebsites.net/api/auth'
};
```

O Angular usa automaticamente `environment.prod.ts` no build de produção (`ng build`).

---

## 7. Como rodar localmente

### Pré-requisitos

- Node.js 18+
- Backend Nutryon rodando em `localhost:8080`

### Passo 1: Instalar dependências

```bash
npm install
```

### Passo 2: Iniciar servidor de desenvolvimento

```bash
npm run start
# ou: ng serve
```

O proxy em `proxy.conf.json` redireciona `/api` e `/auth` para `http://localhost:8080` automaticamente.

### Passo 3: Acessar

```
http://localhost:4200
```

---

## 8. Como realizar deploy em nuvem (Azure Static Web Apps)

O deploy é automático via **Azure DevOps Pipelines** ao fazer push para `main` (`azure-pipelines.yml`):

```
push → main
  ↓
Azure DevOps CI stage
  1. NodeTool@0 (Node 22)
  2. npm ci → instala dependências
  3. npm run build → gera dist/nutryon-app/browser/ (environment.prod.ts)
  4. PublishBuildArtifacts → artefato "frontend-dist"
  ↓
Azure DevOps CD stage (environment "producao" — requer aprovação manual)
  5. AzureCLI@2 → obtém token SWA via az staticwebapp secrets list
  6. SWA CLI v1.1.7 → deploy do artefato no Azure Static Web Apps
```

### Por que SWA CLI v1.1.7

O `AzureStaticWebApp@0` (task oficial) roda em container Docker e não acessa o caminho do artefato publicado. A solução foi usar o SWA CLI v1.1.7 diretamente — a versão 1.x usa autenticação clássica por token; a v2.x requer GitHub OIDC.

### SPA Fallback (roteamento Angular)

O arquivo `projects/nutryon-app/public/staticwebapp.config.json` configura o fallback para SPA, garantindo que rotas do Angular (`/dashboard`, `/login`, etc.) funcionem ao recarregar a página:

```json
{
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```

### SPA Fallback (roteamento Angular)

O arquivo `projects/nutryon-app/public/staticwebapp.config.json` configura o fallback para SPA, garantindo que rotas do Angular (`/dashboard`, `/login`, etc.) funcionem ao recarregar a página:

```json
{
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```

---

## 9. Testes realizados em localhost

| Teste | Ação | Resultado esperado | Status |
|---|---|---|---|
| Login | Inserir email/senha e enviar | Token JWT salvo, redirecionamento para dashboard | Aprovado |
| Registro | Criar conta nova | Usuário criado, redirecionamento para login | Aprovado |
| Dashboard | Acessar `/dashboard` | Macros do dia exibidos | Aprovado |
| Registrar refeição | Selecionar tipo e ingredientes | Refeição criada, macros atualizados | Aprovado |
| Excluir refeição | Clicar em excluir | Refeição removida da lista | Aprovado |
| Resumo semanal | Acessar relatórios | Gráfico semanal exibido | Aprovado |
| Acesso sem login | Navegar para `/dashboard` sem token | Redirecionamento para `/login` | Aprovado |

---

## 10. Testes realizados em nuvem

| Teste | URL | Ambiente | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|---|
| Acesso ao frontend | https://ashy-ground-044d2c50f.azurestaticapps.net | Cloud | Interface carregada | Interface carregada | A verificar |
| Rota SPA ao recarregar | https://ashy-ground-044d2c50f.azurestaticapps.net/dashboard | Cloud | Página carregada (não 404) | Carregada | A verificar |
| Login em nuvem | https://ashy-ground-044d2c50f.azurestaticapps.net/login | Cloud | Login funcional com API cloud | Funcional | A verificar |
| Dashboard cloud | https://ashy-ground-044d2c50f.azurestaticapps.net/dashboard | Cloud | Macros exibidos com dados do banco cloud | Exibidos | A verificar |
| Criar refeição cloud | POST via frontend cloud | Cloud | Refeição salva no Oracle Cloud | Salva | A verificar |
| Excluir refeição cloud | DELETE via frontend cloud | Cloud | Refeição removida | Removida | A verificar |

**Nota:** Preencha "Resultado obtido" e status após executar os testes. Inclua capturas no vídeo.

---

## 11. Troubleshooting

### Build falha no GitHub Actions

Verificar se o secret `AZURE_STATIC_WEB_APPS_API_TOKEN_ASHY_GROUND_044D2C50F` está configurado no repositório (Settings → Secrets).

### Rotas dando 404 ao recarregar

O arquivo `staticwebapp.config.json` com `navigationFallback` deve estar presente em `projects/nutryon-app/public/` para ser incluído no build.

### Frontend não consegue chamar o backend em cloud

Verificar se o backend tem `CORS_ALLOWED_ORIGINS` configurado com a URL do frontend:
```
https://ashy-ground-044d2c50f.azurestaticapps.net
```

---

## 12. Links importantes

| Recurso | Link |
|---|---|
| Frontend (GitHub) | https://github.com/VoyDcode/Nutryon-angular |
| Backend (GitHub) | https://github.com/VoyDcode/Nutryon |
| Frontend em nuvem | https://ashy-ground-044d2c50f.azurestaticapps.net |
| Backend em nuvem | https://nutryon-f8h2e8bqa0d7gjbx.southafricanorth-01.azurewebsites.net |
| Swagger UI | https://nutryon-f8h2e8bqa0d7gjbx.southafricanorth-01.azurewebsites.net/swagger-ui/index.html |
| Vídeo de apresentação | [A preencher] |
