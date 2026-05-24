# Design System Oficial — Casarei v1.0

Este documento é a referência obrigatória para novas telas, módulos, componentes e fluxos do Casarei.

## Princípio Central

O Casarei é mobile-first. A versão mobile é a fonte da verdade do produto.

Desktop apenas expande a experiência mobile com mais respiro e leitura. Ele não deve reorganizar o fluxo, criar dashboards, mudar hierarquia ou transformar a experiência em sistema administrativo.

## Personalidade

O Casarei deve transmitir sofisticação, leveza, clareza, acolhimento, feminilidade madura e organização elegante.

A sensação desejada é: “Meu casamento está tomando forma com leveza.”

O Casarei não deve parecer ERP, CRM, SaaS, painel administrativo, sistema financeiro, gerenciador corporativo de tarefas ou marketplace genérico.

## Paleta Oficial

| Função | Cor |
| --- | --- |
| Fundo principal | `#F8F4F1` |
| Superfície/cards | `#FFFDFC` |
| Texto principal | `#4B2E2B` |
| Texto secundário | `#8A716D` |
| Rosa principal | `#D96C8A` |
| Rosa hover | `#C85D7B` |
| Fundo rosa suave | `#F8E7EC` |
| Verde principal | `#9CAF88` |
| Fundo verde suave | `#EEF3EA` |
| Terracotta alerta | `#D28B6E` |
| Azul suave informação | `#A8B7C7` |
| Dourado premium | `#C6A77D` |

## Uso Das Cores

Rosa: CTAs, Sofia, ações principais, progresso emocional e destaques pontuais.

Verde: concluído, contrato assinado, pago, fechado e resolvido.

Terracotta: pendências suaves, atenção e aguardando.

Azul suave: informação neutra, contexto e detalhes.

Dourado: detalhes premium e pequenos destaques.

Não usar rosa em tudo.

## UI

Cards devem usar fundo `#FFFDFC`, raio suave, sombra muito leve, respiro generoso e bordas discretas. Evitar bordas fortes, bordas azuis, cards pesados e efeitos exagerados.

Botão principal usa rosa com texto branco. Botão secundário usa fundo claro, texto marrom e borda suave.

Tabs devem parecer navegação editorial: pills suaves, pouco contraste agressivo e comportamento simples.

Calendários devem ser leves e elegantes, sem aparência de Google Agenda.

Timelines do casamento são verticais e representam jornada, progresso e caminho.

Tarefas devem parecer próximos passos e lembretes elegantes, nunca tickets corporativos.

## Sofia

Sofia é acolhedora, elegante, humana, calma e guia da jornada. Ela reduz ansiedade, simplifica e orienta.

Tom: “Vamos por partes 💕”

## Progressive Disclosure

Mostrar o necessário primeiro. Detalhes complexos e opções secundárias devem aparecer aos poucos.

Cada tela responde uma pergunta principal:

- Início: “O que preciso saber hoje?”
- Cronograma: “O que preciso fazer agora?”
- Convidados: “Quem vai?”
- Fornecedores: “Com quem já fechamos e o que falta?”
- Sofia: “Me ajuda a decidir?”

## Implementação

Use os tokens globais em `src/app/globals.css` e os aliases Tailwind `casarei-*`.

Preferir classes semânticas reutilizáveis:

- `casarei-app-shell`
- `casarei-surface`
- `casarei-card`
- `casarei-primary-button`
- `casarei-secondary-button`
- `casarei-tabs`
- `casarei-tab-active`
- `casarei-tab`

Antes de criar qualquer tela, verificar este documento e preservar a hierarquia mobile.
