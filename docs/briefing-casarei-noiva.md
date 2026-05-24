r Casarei — Brief técnico para construção do app (lado noiva)

> **Como usar este documento**
> Cole o conteúdo inteiro como prompt inicial do Codex (ou qualquer agente de código).
> Em seguida, peça para começar pela **Fase 1 (MVP)** — não tente construir tudo de uma vez.
> Cada seção é independente e pode ser referenciada por número (ex.: "implemente 5.6 — Cotações com IA").

---

## 1. Contexto do produto

**Casarei** é um app SaaS de planejamento de casamento para o mercado brasileiro. O público-alvo é a noiva (90% dos usuários), que assume o papel de gestora do casamento. O produto combina:

- Ferramentas operacionais (tarefas, orçamento, convidados, fornecedores)
- Marketplace de fornecedores geolocalizado com take rate de 10–15%
- IA "Sofia" que analisa PDFs de cotação, recomenda fornecedores, organiza mesas e responde dúvidas
- RSVP automático via link único por convidado (sem login)

**Tom da marca:** elegante, feminino, premium, brasileiro. Tipografia serifada para momentos emocionais, sans-serif limpa para UI funcional. Paleta dominante rose/pink com acentos âmbar e verde.

**Modelo de receita:** Freemium (grátis básico) + Premium R$ 29,90/mês + Take rate marketplace + Anúncios destacados de fornecedores + White label para cerimonialistas.

---

## 2. Stack técnica recomendada

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Frontend web | **Next.js 14** (App Router) + TypeScript | SSR + interatividade rica |
| Mobile (futuro) | React Native + Expo | Reaproveita componentes da web |
| Estilização | **Tailwind CSS** + **shadcn/ui** + Radix UI | Velocidade + consistência |
| Tipografia | `next/font` com **Playfair Display** (serif) + **Inter** (sans) | Casamento estético + performance |
| Backend / DB | **Supabase** (PostgreSQL + Auth + Storage + Realtime + Edge Functions) | Tudo integrado, escala bem |
| ORM | **Drizzle ORM** ou Supabase client | Type-safe |
| Estado | **TanStack Query** + **Zustand** | Servidor + UI |
| Forms | **react-hook-form** + **zod** | Validação |
| IA (Sofia) | **OpenAI GPT-4o** ou **Claude Sonnet 4** via API | Chat + análise de PDF |
| OCR de PDF | **pdf-parse** + **GPT-4o vision** (fallback) | Extrai dados estruturados |
| WhatsApp | **WhatsApp Business Cloud API** (Meta) ou **Z-API** | Envio de RSVP e notificações |
| Pagamentos | **Stripe** (assinatura Premium) | Recorrente |
| Imagens | **Cloudinary** ou **Supabase Storage** + transformações on-the-fly | Mural de inspirações e galerias de fornecedores |
| E-mail | **Resend** | RSVP por e-mail, recibos |
| SMS fallback | **Twilio** ou **Zenvia** (BR) | Para quem não tem WhatsApp |
| Mapas | **Mapbox** | Local do casamento |
| Push | **OneSignal** ou Supabase + FCM | Notificações de RSVP |
| Hospedagem | **Vercel** (web) + **Supabase Cloud** | Zero-ops |
| Observabilidade | **Sentry** + **Posthog** | Erros + analytics de produto |

---

## 3. Design system

### 3.1 Tokens de cor (CSS variables)

```css
:root {
  /* Brand */
  --casarei-primary: #D4537E;          /* pink-400 — botões, links, ativo */
  --casarei-primary-dark: #993556;     /* pink-600 — hover, texto sobre claro */
  --casarei-primary-deep: #72243E;     /* pink-700 — títulos sobre claro */
  --casarei-primary-light: #F4C0D1;    /* pink-200 — acentos suaves */
  --casarei-primary-bg: #FBEAF0;       /* pink-50 — fundos de seção */

  /* Neutros */
  --neutral-ink: #1a1a1a;              /* texto principal e backgrounds escuros */
  --neutral-text: #444441;             /* texto secundário */
  --neutral-muted: #888780;            /* texto terciário */
  --neutral-border: #D3D1C7;           /* bordas */
  --neutral-border-soft: #E5E3DA;      /* bordas suaves */
  --neutral-bg: #F1EFE8;               /* cinza claro */
  --neutral-cream: #FAF3E7;            /* creme — fundo de seções warm */
  --neutral-white: #FFFFFF;

  /* Funcionais */
  --success: #1D9E75;                  /* confirmações, pagamento ok */
  --success-bg: #E1F5EE;
  --success-text: #085041;
  --warning: #BA7517;                  /* atenção, pendente */
  --warning-bg: #FAEEDA;
  --warning-text: #633806;
  --danger: #E24B4A;                   /* erro, recusado, atrasado */
  --danger-bg: #FCEBEB;
  --danger-text: #791F1F;

  /* Marca de terceiros */
  --whatsapp: #25D366;                 /* botões "abrir WhatsApp" */
}
```

### 3.2 Tipografia

- **Serif (Playfair Display, peso 400/500):** títulos de seção, nomes do casal, valores monetários em destaque
- **Sans (Inter, pesos 400/500):** UI geral, body, labels, botões
- **Letterspacing decorativo (3–4px):** small caps em headers de capítulo

### 3.3 Espaçamento e bordas

- Border-radius padrão: `16px` (cards), `12px` (inputs/botões), `10px` (pills internos), `999px` (badges)
- Sombras evitadas — usar bordas `0.5px solid var(--neutral-border-soft)` para separação
- Spacing scale Tailwind padrão (4, 8, 12, 16, 20, 24)

### 3.4 Componentes-chave (shadcn/ui + custom)

- `<PhoneFrame>` — wrapper visual de preview mobile (admin/protótipo)
- `<StatCard>` — número grande + label
- `<ProgressBar>` — com label e percentual
- `<VendorCard>` — avatar + nome + categoria + status + ações
- `<TaskItem>` — checkbox + título + meta + categoria
- `<TimelineMarker>` — bolinha colorida + linha vertical
- `<SofiaCard>` — fundo rosa-claro + ícone sparkles + sugestão
- `<WhatsAppButton>` — verde #25D366, abre `wa.me/...` com mensagem pré-preenchida
- `<MoodCard>` — usado no onboarding, gradiente + ícone + label

---

## 4. Modelos de dados (PostgreSQL)

```sql
-- Casais (uma conta = um casamento)
CREATE TABLE couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  bride_name TEXT NOT NULL,
  partner_name TEXT,
  wedding_date DATE,
  city TEXT,
  state TEXT,
  venue_name TEXT,
  budget_total NUMERIC(10,2),
  guest_estimate INT,
  style TEXT[],                        -- ['romantico', 'rustico']
  tier TEXT,                           -- 'economico', 'intermediario', 'premium', 'luxo'
  premium BOOLEAN DEFAULT false,
  rsvp_deadline DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Convidados
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  group_tag TEXT,                      -- "Família noiva", "Amigos noivo", "Trabalho"
  plus_ones_allowed INT DEFAULT 0,
  plus_ones_confirmed INT DEFAULT 0,
  rsvp_status TEXT DEFAULT 'pending',  -- pending | confirmed | declined
  rsvp_token TEXT UNIQUE NOT NULL,     -- token aleatório usado no link
  rsvp_responded_at TIMESTAMPTZ,
  dietary_restriction TEXT,
  table_id UUID,
  invitation_sent_at TIMESTAMPTZ,
  reminders_sent INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tarefas
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT,
  due_date DATE,
  priority TEXT DEFAULT 'normal',      -- urgent | normal | low
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  auto_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Orçamento — categorias
CREATE TABLE budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  planned NUMERIC(10,2),
  color TEXT
);

-- Transações
CREATE TABLE budget_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  category_id UUID REFERENCES budget_categories(id),
  vendor_id UUID,
  description TEXT,
  amount NUMERIC(10,2),
  paid_at DATE,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Fornecedores fechados pela noiva
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  marketplace_id UUID,                 -- referência ao fornecedor no marketplace (nullable)
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  total_value NUMERIC(10,2),
  contract_status TEXT DEFAULT 'pending',
  contract_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Cotações recebidas (PDFs analisados pela IA)
CREATE TABLE vendor_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  price NUMERIC(10,2),
  rating NUMERIC(2,1),
  ai_pros TEXT[],
  ai_cons TEXT[],
  ai_recommended BOOLEAN DEFAULT false,
  ai_summary TEXT,
  raw_extracted_text TEXT,
  status TEXT DEFAULT 'analyzing',     -- analyzing | ready | closed
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Pagamentos por fornecedor
CREATE TABLE vendor_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  amount NUMERIC(10,2),
  due_date DATE,
  paid BOOLEAN DEFAULT false,
  paid_at DATE,
  receipt_url TEXT
);

-- Marcos do fornecedor (timeline)
CREATE TABLE vendor_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_date DATE,
  completed BOOLEAN DEFAULT false,
  notes TEXT
);

-- Chat com o fornecedor (in-app)
CREATE TABLE vendor_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,                -- 'couple' | 'vendor'
  content TEXT,
  attachment_url TEXT,
  attachment_type TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Mesas
CREATE TABLE tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  capacity INT DEFAULT 10,
  x INT,
  y INT
);

ALTER TABLE guests ADD FOREIGN KEY (table_id) REFERENCES tables(id);

-- Mural de inspirações da noiva (substitui parte do que era a galeria do site)
CREATE TABLE inspirations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  source TEXT,                         -- 'upload' | 'instagram' | 'pinterest' | 'marketplace'
  source_url TEXT,
  category TEXT,                       -- 'vestido', 'decoracao', 'bolo', 'cabelo'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Marketplace — fornecedores cadastrados (lado B)
CREATE TABLE marketplace_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  category TEXT NOT NULL,
  city TEXT,
  state TEXT,
  starting_price NUMERIC(10,2),
  rating NUMERIC(2,1),
  reviews_count INT DEFAULT 0,
  cover_image_url TEXT,
  gallery_urls TEXT[],
  description TEXT,
  whatsapp TEXT,
  is_sponsored BOOLEAN DEFAULT false,
  sponsorship_tier TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ações da Sofia (histórico para aprendizado e auditoria)
CREATE TABLE ai_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id),
  action_type TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 5. Telas e funcionalidades

### 5.1 Onboarding (6 telas)

**Rota:** `/onboarding`
**Acesso:** primeiro login, redireciona automaticamente.

| Tela | Conteúdo | Inputs persistidos |
|---|---|---|
| 1. Splash | Logo Casarei + CTA "Começar" + link "já tenho conta" | — |
| 2. Quem é você | Nome da noiva + nome do parceiro | `couples.bride_name`, `couples.partner_name` |
| 3. Quando &amp; onde | Calendário + cidade autocomplete | `wedding_date`, `city`, `state` |
| 4. Vibe (multi-select) | Grid 2×3 de gradient cards com 6 estilos | `style[]` |
| 5. Porte | Slider de orçamento + slider de convidados, mostra ticket médio | `budget_total`, `guest_estimate`, `tier` |
| 6. Sofia se apresenta | Cards mostrando o que a Sofia já fez | Dispara jobs no backend (ver §6) |

**Detalhe visual da tela 4:** cada estilo tem um gradiente próprio (romântico=rosa, rústico=âmbar, boho=terracota, moderno=cinza, clássico=azul-marinho, praia=azul→areia). Card selecionado tem círculo branco com check no canto superior direito.

**Bottom indicator:** dots no rodapé indicando 1 de 6.

### 5.2 Dashboard (Início)

**Rota:** `/app`

1. **Header:** "Olá, Mariana ♡" + ícone de sino com badge de notificações
2. **Hero countdown:** gradiente rosa→âmbar, "142 dias" em serif grande + data + local
3. **Progress bar:** "Progresso geral 67%" com barra pink
4. **Grid 2×2 de stat tiles:** Tarefas (23/48), Orçamento (62%), Confirmados (87/140), Fornecedores (9/14)
5. **Card Sofia:** fundo rosa-claro, ícone sparkles, sugestão proativa
6. **Bottom nav fixo:** Início, Tarefas, Orçamento, Convidados, Mais

### 5.3 Tarefas

**Rota:** `/app/tarefas`

- Filtros (pills horizontais): Todas (count) · Atrasadas · Feitas
- Grupos por timeline: **URGENTE · ESTA SEMANA** / **PRÓXIMO MÊS** / **MAIS TARDE**
- Tarefa urgente tem destaque visual: fundo `#FCEBEB`, borda-esquerda 3px vermelha
- Tarefa concluída: checkbox preenchido verde + texto riscado
- FAB "+" canto inferior direito
- Tarefas auto-geradas pela Sofia têm ícone sparkles pequeno

### 5.4 Orçamento

**Rota:** `/app/orcamento`

- **Hero card:** "Total previsto R$ 142.000" em serif, abaixo barra horizontal mostrando Gasto vs Restante
- **Por categoria:** lista de categorias com ícone colorido + nome + valor + barra de progresso
- **Insight Sofia:** "Você economizou R$ 8.200 comparado a casamentos similares" (fundo verde-claro)
- **Floating button "+":** adicionar transação manualmente
- Drill-down por categoria mostrando transações

### 5.5 Convidados &amp; RSVP

**Rota:** `/app/convidados`

#### 5.5.1 Lista
- 3 stat tiles: Confirmados / Pendentes / Recusados
- Card copiável: link público de RSVP individual ou QR code para impressão
- Lista de convidados com avatar (iniciais + cor gerada do hash do nome), grupo, mesa, status badge

#### 5.5.2 Envio de RSVP automático
**Rota:** `/app/convidados/enviar`

- Filtro pré-aplicado: pendentes
- Multi-select de convidados
- Botões de canal: WhatsApp (verde, primário) · E-mail · SMS
- Botão final: "Enviar link para N pendentes"
- Cada link tem `rsvp_token` único: `casarei.app/rsvp/<token>`
- Template WhatsApp aprovado pela Meta: `"Olá {nome}! {casal} convida você para o casamento em {data}. Confirme aqui: {link}"`

#### 5.5.3 Página pública de RSVP
**Rota:** `/rsvp/[token]` (sem login, sem cadastro)

Layout vertical, mobile-first, fundo creme `#FAF3E7`:
1. Header simples: ícone coração + nomes do casal em serif + data e local
2. Card branco com:
   - "Olá, {nome}!"
   - Pergunta 1: "Você vai comparecer?" → 2 botões grandes (Sim, vou! / Não consigo ir)
   - Pergunta 2 (condicional): "Vai levar acompanhante?" → Só eu / Eu + 1
   - Pergunta 3: "Restrição alimentar?" → input ou dropdown
   - Botão CTA verde (#25D366): "Confirmar presença"
3. Submit → atualiza guest, dispara webhook, push notification para a noiva, mostra tela de obrigado

**Importante:** essa não é uma página de marketing nem tem identidade visual customizável. É funcional, padrão para todos os casais, focada em conversão de resposta.

#### 5.5.4 Atualização em tempo real
- Supabase Realtime canal por `couple_id`
- App da noiva escuta updates de `guests` e mostra toast: "Carla Oliveira confirmou! Vai com +1 · vegetariana · agora"
- Reenvio automático configurável: 7 dias e 3 dias antes da `rsvp_deadline`

### 5.6 Cotações (análise por IA)

**Rota:** `/app/cotacoes`

- Tabs por categoria: Buffet (3) · Foto (2) · DJ (1) · Decoração (2)
- **Card "Sofia recomenda":** gradiente rosa, ícone sparkles, nome do fornecedor + 1 linha de justificativa
- Lista de cotações da categoria selecionada, cada card mostra:
  - Borda 2px rosa se recomendada + badge "RECOMENDADA"
  - Nome + estrelas + número de avaliações
  - Preço em serif grande
  - Chip do PDF anexado (clicável → preview)
  - Lista de prós (✓ verde) e contras (✗ vermelho)
- Dropzone para "Anexar outro PDF"
- Flow ao anexar:
  1. Upload pra Supabase Storage
  2. Edge Function chama `pdf-parse` → texto bruto
  3. Texto bruto + perfil do casal → LLM com prompt da §6.2
  4. Resposta salva em `vendor_quotes.ai_pros/cons/summary`
  5. Recalcular "recomendada" comparando todas as cotações da categoria
- Ação "Fechar com este" → cria registro em `vendors`

### 5.7 Fornecedores

**Rota:** `/app/fornecedores`

- Tabs: **Fechados (9)** · Cotando (3) · Marketplace
- Header summary: "R$ 88.420 contratado · 7 ok · 2 pendentes"
- Lista de cards:
  - Avatar quadrado com ícone da categoria
  - Nome + categoria + valor
  - Badges de status (contrato / pagamento)
  - Linha com próximo marco
  - Dois botões: **WhatsApp** (verde, abre `wa.me/...`) + **Contrato** (outlined, PDF)
- Card de contrato pendente tem borda âmbar e botão primário "Anexar contrato"

### 5.8 Detalhe do fornecedor

**Rota:** `/app/fornecedores/[id]`

Tabs internas: **Perfil** · Chat · Pagamentos · Galeria

#### Perfil
- Banner gradient com avatar + nome + estrelas
- Badges de status
- Grid 4 quick actions: WhatsApp · Ligar · Contrato · Galeria
- Card resumo do contrato (valor, local, itens inclusos)
- Timeline de próximos marcos

#### Chat
- Mensagens estilo WhatsApp/iMessage
- Anexos (PDF mostra ícone + nome)
- Indicador de digitando

#### Pagamentos
- Hero card: valor total + pago + barra de progresso
- Lista de parcelas com status e comprovantes
- Próxima parcela com borda âmbar
- Botão "Registrar pagamento"

#### Galeria
- Grid 3 colunas com primeira foto destacada
- Tabs por contexto: Todos · Cerimônia · Ensaio · Festa
- Lightbox ao tocar

### 5.9 Mesas

**Rota:** `/app/mesas`

- Canvas com fundo creme + borda tracejada
- Mesa dos noivos no topo
- Mesas redondas drag &amp; drop com:
  - Rosa = parcial
  - Verde = completa
  - Cinza tracejada = vazia
- Card Sofia: "Posso distribuir 38 convidados por afinidade" + botão "Auto-organizar"

### 5.10 Mural de inspirações

**Rota:** `/app/inspiracoes`

- Grid masonry estilo Pinterest
- Tabs por categoria: Vestido · Decoração · Bolo · Buquê · Cabelo
- Botões de adicionar: Upload · Importar do Instagram · Salvar do marketplace
- Cada foto pode ser comentada e marcada como referência para um fornecedor específico

---

## 6. Sofia IA — arquitetura

### 6.1 Princípio

Sofia é uma camada de inteligência que roda no backend (Edge Functions) disparada por eventos. Não é um chat. Ela faz ações específicas em momentos específicos. Cada ação fica registrada em `ai_actions` para auditoria.

### 6.2 Análises principais

#### Geração inicial de tarefas (no fim do onboarding)

```typescript
const prompt = `Você é uma especialista em planejamento de casamento no Brasil. 
Para o casamento de ${bride} e ${partner} em ${city}, em ${days} dias (${date}), 
estilo ${styles.join(", ")}, com ${guests} convidados e orçamento R$ ${budget}, 
gere uma lista de 40-50 tarefas distribuídas por mês até a data, no formato JSON:
[{ "title": string, "category": string, "due_offset_days": number, "priority": "urgent"|"normal"|"low" }]
Categorias: buffet, decoracao, foto, dj, vestido, cerimonialista, papelaria, lua_de_mel, documentos, beleza.`
```

#### Análise de cotação em PDF

```typescript
const prompt = `Você analisa orçamentos de fornecedores de casamento. 
Perfil do casal: ${tier}, ${guests} convidados, ${city}, estilo ${styles}, 
orçamento alocado para ${category}: R$ ${categoryBudget}.

Texto bruto do PDF:
"""${pdfText}"""

Retorne JSON estrito:
{
  "vendor_name": string,
  "price": number,
  "summary": string,
  "pros": string[] (3-5 itens curtos),
  "cons": string[] (1-3 itens curtos),
  "above_budget_alert": boolean
}

Regras: pros e cons devem ser específicos do PDF, não genéricos. 
Se mencionar preço acima de R$ ${categoryBudget}, sinalize em cons.`
```

#### Recomendação entre cotações

```typescript
const prompt = `Dadas estas N cotações para ${category} de um casamento ${tier} 
com ${guests} convidados, qual oferece melhor custo-benefício considerando 
preço, avaliações, e adequação ao perfil? Retorne apenas o ID.`
```

### 6.3 Sugestões proativas

Cron diário roda regras simples + LLM:
- Tarefas vencendo em 3 dias → sugere
- Pagamento próximo → sugere
- Categoria do orçamento sub-utilizada e prazo apertado → sugere fornecedor

### 6.4 Distribuição automática de mesas

1. Cluster convidados por `group_tag`
2. Heurística (simulated annealing leve) para maximizar afinidade dentro da capacidade
3. LLM faz pós-ajuste textual ("Sugiro deixar Carla e Julia juntas porque ambas são vegetarianas")

---

## 7. Integrações externas

### 7.1 WhatsApp Business Cloud API (Meta)

- Cadastrar número via Meta Business Manager
- Templates aprovados:
  - `rsvp_invitation` — variáveis: nome, casal, data, link
  - `payment_reminder` — para fornecedores
  - `task_reminder` — para a noiva
- Webhook em `/api/webhooks/whatsapp` para receber confirmações de leitura
- Botões `<WhatsAppButton>` montam URL: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`

### 7.2 OpenAI / Claude

- Variável `AI_PROVIDER` permite trocar (`openai` | `anthropic`)
- Todas as chamadas passam por wrapper `ai.complete()` que normaliza
- Cache de prompts idempotentes em Redis (chave = hash do prompt)

### 7.3 Pagamentos

- **Stripe** para a assinatura Premium (R$ 29,90/mês) — checkout hospedado
- Webhook em `/api/webhooks/payments` atualiza `couples.premium`
- (Pagamento do marketplace e split fornecem-se via Pagar.me; ver brief do lado fornecedor)

### 7.4 Cloudinary

- Upload via signed URLs
- Transformações eager para thumb/web/web@2x
- Auto-melhoramento ativado: `q_auto,f_auto,e_auto_color`
- Presets por contexto: `inspiration_photo`, `vendor_gallery_photo`, `bride_avatar`, `receipt_thumb`

---

## 8. Fases de entrega

### Fase 1 — MVP (4–6 semanas)

Objetivo: noiva consegue planejar, convidar e organizar.

- [ ] Auth + onboarding (§5.1)
- [ ] Dashboard (§5.2)
- [ ] Tarefas (§5.3) — CRUD + geração inicial pela IA
- [ ] Orçamento (§5.4) — CRUD de categorias e transações
- [ ] Convidados (§5.5.1, 5.5.2, 5.5.3, 5.5.4) — RSVP automático é prioridade máxima
- [ ] Fornecedores fechados (§5.7) — sem marketplace
- [ ] Detalhe do fornecedor (§5.8) — sem chat in-app, só WhatsApp deeplink

### Fase 2 — IA, planejamento avançado (4 semanas)

- [ ] Cotações com análise por IA (§5.6)
- [ ] Sofia proativa no dashboard (§6.3)
- [ ] Mesas (§5.9)
- [ ] Mural de inspirações (§5.10)
- [ ] Chat in-app no detalhe do fornecedor

### Fase 3 — Monetização &amp; rede (6 semanas)

- [ ] Marketplace de fornecedores integrado (lado B — ver brief separado)
- [ ] Stripe Premium
- [ ] Anúncios destacados no marketplace
- [ ] White label para cerimonialistas (modo multi-casamento)

### Fase 4 — Mobile nativo (8 semanas)

- [ ] React Native + Expo
- [ ] Push notifications

---

## 9. Critérios de aceite globais

- **Mobile-first:** todas as telas do app funcionam perfeitamente em viewport 375×812
- **i18n preparado:** todos os textos em `pt-BR.json`, nenhuma string hard-coded
- **Acessibilidade:** contraste AA mínimo, navegação por teclado
- **Segurança:**
  - RLS habilitado no Supabase em todas as tabelas
  - `rsvp_token` é o único identificador público de convidado (UUID v4)
  - Página `/rsvp/[token]` valida token, rate-limit por IP, sem indexação por bots
- **Cobertura de teste:** unit tests para lógica de IA (mockando a API) e integration tests para o fluxo de RSVP
- **Versionamento:** Conventional Commits, tags semver

---

## 10. Visual de referência

- Tipografia: títulos em Playfair Display, peso 500, letterspacing -0.5 a -1px
- Botões primários: pink #D4537E, border-radius 12px, padding 12-14px vertical
- Botão WhatsApp: verde #25D366, sempre com ícone `ti-brand-whatsapp` à esquerda
- Cards: borda 0.5px `--neutral-border-soft`, border-radius 14-16px, sem sombra
- Espaçamento entre seções: 24-32px desktop, 18-22px mobile
- Status badges: pílulas com fundo claro da cor + texto escuro (ex.: confirmado = bg `#E1F5EE` + texto `#085041`)

---

**Próximo passo:** comece pela Fase 1, item 1 (Auth + Onboarding). Para cada item, gere antes uma proposta de arquitetura de pastas e modelo de dados específico, valide, depois implemente.
