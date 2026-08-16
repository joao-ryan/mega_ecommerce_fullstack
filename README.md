# ╔═══════════════════════════════════════════════════════════════════════════════════════════════╗
# ║   ⚡ GUIA TÉCNICO COMPLETO DA STACK FULL-STACK — JOÃO RYAN                                  ║
# ║   Documentação de Engenharia, Padrões Arquiteturais e Resiliência Enterprise                ║
# ╚═══════════════════════════════════════════════════════════════════════════════════════════════╝

```
   ███████╗██╗   ██╗██╗     ██╗     ███████╗████████╗ █████╗  ██████╗██╗  ██╗
   ██╔════╝██║   ██║██║     ██║     ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
   █████╗  ██║   ██║██║     ██║     ███████╗   ██║   ███████║██║     █████═╝ 
   ██╔══╝  ██║   ██║██║     ██║     ╚════██║   ██║   ██╔══██║██║     ██╔═██╗ 
   ██║     ╚██████╔╝███████╗███████╗███████║   ██║   ██║  ██║╚██████╗██║  ██╗
   ╚═╝      ╚═════╝ ╚══════╝╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 ─────────────────────────────────────────────────────────────────────────────────
   Engenharia de Software de Alto Desempenho • Tolerância a Falhas • Clean Architecture
```

---

## 🎨 1. Camada de Frontend (UI & Design System)

A camada de apresentação foi construída com foco em interfaces imersivas de padrão internacional, unindo design cinematográfico e performance extrema.

```
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                           ⚛️ FRONTEND CORE ARCHITECTURE                     │
  ├─────────────────────────────────────────────────────────────────────────────┤
  │                                                                             │
  │   [React 18] ──▶ [TypeScript 5] ──▶ [Tailwind CSS] ──▶ [Context / Hooks]    │
  │       │                │                   │                   │            │
  │   Renderização     Tipagem         Design System       Estado Global        │
  │   Reativa          Estrita         Luxury & Motion     Reativo & Limpo      │
  │                                                                             │
  └─────────────────────────────────────────────────────────────────────────────┘
```

### 📌 Tecnologias e Decisões de Frontend

* **⚛️ React 18:** Arquitetura atômica baseada em componentes funcionais e hooks customizados.
* **🔷 TypeScript 5:** Contratos de interfaces estritas em `src/types/index.ts`, garantindo imunidade a erros `undefined` em tempo de compilação.
* **🍃 Tailwind CSS:** Estilização com design tokens, suporte a paleta *Luxury Light*, micro-interações e layouts responsivos para qualquer dispositivo.
* **⚡ Vite Bundler:** Transpilação ultrarrápida com Rollup sob o capô, geração de chunks otimizados e zero latência de desenvolvimento.
* **🛡️ Axios Interceptors:** Camada centralizada de comunicação HTTP com injeção automática de `Authorization: Bearer <token>` e recuperação de erros.

---

## ⚙️ 2. Camada de Backend & APIs RESTful

```
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                         🚂 ARQUITETURA MODULAR EXPRESS                      │
  ├─────────────────────────────────────────────────────────────────────────────┤
  │                                                                             │
  │   [HTTP Request] ──▶ [API Interceptor] ──▶ [Controllers] ──▶ [Services]    │
  │                            │                      │               │         │
  │                     Injeção de JWT          Validação DTO   Regras Negócio  │
  │                                                                             │
  │   [Services] ──▶ [Repository Pattern] ──▶ [Connection Pool] ──▶ [MySQL/SQL] │
  │                                                                             │
  └─────────────────────────────────────────────────────────────────────────────┘
```

### 📌 Práticas e Segurança de Backend

* **🟩 Node.js (LTS):** Runtime assíncrono baseado no motor V8, com suporte a alta concorrência e processamento não-bloqueante.
* **🚂 Express.js:** Estruturação modular com roteamento desacoplado (`/api/products`, `/api/cart`, `/api/orders`, `/api/users/sync`).
* **🛡️ Tratamento Global de Falhas:** Interceptação centralizada de erros com respostas uniformes no padrão `{ success: false, message: string }`.
* **📦 Suporte a Grandes Payloads:** Middleware configurado com limites estendidos (`50mb`) para suportar uploads de catálogos ricos e imagens em alta resolução.

---

## 🗄️ 3. Persistência de Dados & Modelagem Híbrida

```
                ┌──────────────────────────────────────────────┐
                │          🐬 MODELAGEM RELACIONAL             │
                │        MySQL 8.0 / InnoDB Engine             │
                └──────────────────────┬───────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        │                              │                              │
        ▼                              ▼                              ▼
  ┌────────────┐                ┌────────────┐                ┌────────────┐
  │  PRODUCTS  │                │   ORDERS   │                │ CART_ITEMS │
  │  Catálogo  │                │  Histórico │                │  Carrinho  │
  │  Indexado  │                │  Transação │                │  Sincrono  │
  └────────────┘                └────────────┘                └────────────┘
```

### 📌 Destaques de Banco de Dados

* **🐬 MySQL 8 (Aiven Cloud):** Suporte completo a transações ACID, índices compostos em colunas críticas (`category`, `price`, `user_id`, `status`) para consultas instantâneas.
* **🔓 Desacoplamento Polimórfico:** A coluna `user_id` suporta IDs numéricos nativos, IDs alfanuméricos do Clerk (`user_2...`) e identificadores anônimos (`usr_guest`), garantindo checkout ininterrupto para visitantes.
* **📜 Snapshot em JSON:** Coluna `shipping_address JSON` para armazenamento imutável do endereço de envio no momento exato da compra.

---

## 🚀 4. DevOps, Resiliência e Workflow

```
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                           🔄 PIPELINE DE DEPLOY & CI/CD                     │
  ├─────────────────────────────────────────────────────────────────────────────┤
  │                                                                             │
  │   [Git Commit] ──▶ [Type Check & Lint] ──▶ [Vite Build] ──▶ [Render/Vercel] │
  │      (Conventional)     (tsc --noEmit)        (Dist Chunks)     (Edge CDN)  │
  │                                                                             │
  └─────────────────────────────────────────────────────────────────────────────┘
```

* **☁️ Cloud Hosting:** Deploy contínuo do backend no **Render** e frontend em redes de borda (**Vercel / Cloudflare**).
* **💾 Resiliência L1/L2:** Espelhamento automático de dados entre memória local (`localStorage`) e banco de dados em nuvem.
* **🏷️ Conventional Commits:** Histórico de versionamento limpo e auditável (`feat:`, `fix:`, `refactor:`, `docs:`, `perf:`).

---

<div align="center">

**⚡ Documentação mantida e padronizada por João Ryan — Senior Full-Stack Engineer**

</div>
