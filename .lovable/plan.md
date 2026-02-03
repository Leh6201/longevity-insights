
# Plano: Resumo Inteligente para a Aba de Insights

## Visao Geral

O Resumo Inteligente sera uma nova secao no topo da aba "Insights" que apresenta um texto curto, personalizado e acolhedor, sintetizando o estado de saude do usuario com base em todos os seus dados disponiveis.

---

## 1. Objetivo do Resumo Inteligente

O Resumo Inteligente tem como proposito:

- Fornecer uma visao consolidada e humanizada do estado de saude do usuario
- Evitar que o usuario precise interpretar multiplas metricas isoladamente
- Destacar conquistas positivas para motivar o usuario
- Apontar areas que merecem atencao de forma gentil e nao-alarmista
- Conectar os dados do perfil (onboarding) com os resultados dos exames laboratoriais
- Servir como ponto de entrada para insights mais detalhados

---

## 2. Dados Utilizados

### Fontes de Dados

```text
+------------------+     +-------------------+     +----------------------+
|  onboarding_data |     |    lab_results    |     | detected_biomarkers  |
+------------------+     +-------------------+     +----------------------+
| - age            |     | - biological_age  |     | - name               |
| - weight/height  |     | - metabolic_risk  |     | - value              |
| - health_goals   |     | - inflammation    |     | - is_normal          |
| - sleep_quality  |     | - ai_recommend.   |     | - category           |
| - training_freq  |     | - upload_date     |     | - explanation        |
| - water_intake   |     +-------------------+     +----------------------+
| - mental_health  |
| - alcohol        |
+------------------+
```

### Dados do Onboarding (perfil)
- Idade cronologica
- Peso e altura (para calculo de IMC)
- Metas de saude selecionadas
- Qualidade do sono
- Frequencia de atividade fisica
- Ingestao diaria de agua
- Nivel de saude mental (1-10)
- Consumo de alcool
- Sexo biologico

### Dados dos Exames Laboratoriais
- Idade biologica calculada
- Score de risco metabolico (baixo/moderado/alto)
- Score de inflamacao (baixo/moderado/alto)
- Recomendacoes geradas pela IA
- Biomarcadores detectados (normais vs. atencao)
- Data do ultimo exame

---

## 3. Regras de Priorizacao das Informacoes

### Hierarquia de Destaque

1. **Conquistas positivas primeiro** - Celebrar o que esta funcionando
2. **Comparacao idade biologica vs. cronologica** - Insight central de longevidade
3. **Areas de atencao moderada** - Pontos que podem melhorar
4. **Alertas importantes** - Apenas se houver biomarcadores criticos
5. **Conexao com metas** - Relacionar insights com objetivos do usuario

### Regras de Prioridade

| Prioridade | Condicao | Exemplo de Texto |
|------------|----------|------------------|
| Alta | Idade biologica < cronologica | "Seu corpo esta funcionando como de alguem mais jovem!" |
| Alta | Todos biomarcadores normais | "Todos os seus resultados estao dentro do esperado." |
| Media | IMC saudavel + boa hidratacao | "Seu peso e hidratacao estao em bom equilibrio." |
| Media | Sono bom + atividade regular | "Seus habitos de sono e exercicio estao contribuindo..." |
| Baixa | Biomarcadores de atencao | "Alguns marcadores merecem um olhar mais atento." |

### Logica de Selecao

```text
SE (todos_biomarcadores_normais E idade_bio <= idade_crono):
    tom = "muito_positivo"
    focar_em = "manutencao e celebracao"
    
SE (maioria_normal E poucos_atencao):
    tom = "encorajador"
    focar_em = "progressos + areas de melhoria leve"
    
SE (varios_atencao OU risco_alto):
    tom = "acolhedor_cuidadoso"
    focar_em = "orientacao gentil + proximos passos"
```

---

## 4. Tom de Linguagem

### Principios

- **Claro**: Sem jargoes medicos complexos
- **Humano**: Como um amigo que entende de saude falando com voce
- **Simples**: Frases curtas, diretas ao ponto
- **Acolhedor**: Nunca alarmista ou julgador

### Exemplos de Tom

| Evitar | Preferir |
|--------|----------|
| "Seus niveis de colesterol LDL estao elevados" | "Seu colesterol merece um pouco de atencao" |
| "Voce precisa perder peso" | "Ajustar o peso pode trazer beneficios para sua energia" |
| "Resultado anormal detectado" | "Esse marcador esta um pouco fora da faixa ideal" |
| "Risco metabolico alto" | "Alguns indicadores sugerem cuidar mais da alimentacao" |

### Frases de Abertura por Cenario

**Cenario Muito Positivo:**
> "Otimas noticias! Seus resultados mostram que voce esta no caminho certo."

**Cenario Equilibrado:**
> "Voce tem bons habitos que estao refletindo nos seus resultados."

**Cenario com Atencao:**
> "Seus exames trazem informacoes importantes. Vamos entender juntos?"

---

## 5. Estrutura do Resumo

### Layout Visual

```text
+---------------------------------------------------------------+
|  [icone Sparkles]  Seu Resumo de Saude                        |
+---------------------------------------------------------------+
|                                                               |
|  TITULO PRINCIPAL (1 linha)                                   |
|  "Voce esta cuidando bem do seu corpo!"                       |
|                                                               |
|  CORPO DO RESUMO (2-3 frases)                                 |
|  "Sua idade biologica esta 3 anos mais jovem que sua idade    |
|   real, um sinal de que seus habitos estao funcionando.       |
|   Seus biomarcadores principais estao saudaveis."             |
|                                                               |
|  +------------------+  +------------------+                    |
|  | [check] 8 Normais|  | [alert] 2 Atencao|                   |
|  +------------------+  +------------------+                    |
|                                                               |
|  DESTAQUE (se aplicavel)                                      |
|  [icone Target] Meta: Melhorar energia                        |
|  "Sua hidratacao e sono estao contribuindo para esse objetivo"|
|                                                               |
+---------------------------------------------------------------+
```

### Componentes

1. **Cabecalho**: Icone + Titulo "Seu Resumo de Saude"
2. **Frase Principal**: Resumo em 1 linha (headline)
3. **Corpo**: 2-3 frases contextualizando os dados
4. **Indicadores Visuais**: Badges mostrando contagem normal/atencao
5. **Conexao com Metas**: Link entre insights e objetivos do usuario

---

## 6. Onde o Resumo Sera Exibido

### Posicionamento

```text
InsightsTab.tsx
|
+-- [NOVO] SmartSummaryCard  <-- Primeira coisa que o usuario ve
|
+-- Health Goals Section (secao existente)
|
+-- Calculated Insights Section (secao existente)
|
+-- Priority Focus Area (secao existente)
```

### Comportamento

- Aparece **apenas se houver dados** (onboarding completo ou exame enviado)
- Se nao houver dados suficientes, mostra um CTA para completar perfil ou enviar exame
- Animacao suave de entrada (fade + slide)
- Card com destaque visual (gradiente sutil ou borda colorida)

---

## 7. Variacoes do Resumo

### Versao Curta (Padrao)

- 1 frase de destaque
- 2 frases de contexto
- Badges de contagem
- Tempo de leitura: ~10 segundos

**Exemplo:**
> **Voce esta no caminho certo!**
> Sua idade biologica esta 2 anos mais jovem, e 6 dos seus 8 biomarcadores estao saudaveis. Sua hidratacao e atividade fisica estao contribuindo para isso.

### Versao Detalhada (Expansivel)

Ao clicar em "Ver mais", expande para mostrar:

- Analise por categoria (sono, nutricao, atividade)
- Conexao especifica com cada meta
- Sugestoes de proximos passos
- Comparacao com ultimo exame (se houver)

**Estrutura Expandida:**

```text
+-- Secao: Pontos Positivos
|   - Lista de 2-3 conquistas
|
+-- Secao: Areas de Atencao
|   - Lista de 1-2 pontos com orientacao
|
+-- Secao: Conexao com suas Metas
|   - Como cada meta esta progredindo
|
+-- Secao: Proximo Passo Sugerido
|   - 1 acao pratica recomendada
```

---

## 8. Boas Praticas para Nao Sobrecarregar

### Principios de Reducao Cognitiva

1. **Limite de informacao**: Maximo 3 insights principais no resumo curto
2. **Progressividade**: Detalhes so aparecem se o usuario quiser (clique para expandir)
3. **Linguagem simples**: Evitar numeros excessivos no texto
4. **Hierarquia visual**: Usar tamanho de fonte e cores para guiar o olhar
5. **Espacamento generoso**: Respiro visual entre elementos

### O Que Omitir no Resumo Curto

- Valores numericos especificos de cada biomarcador
- Listas longas de recomendacoes
- Detalhes tecnicos sobre calculos
- Comparacoes complexas entre exames

### O Que Destacar

- Tendencia geral (positiva/neutra/atencao)
- Numero absoluto simples (ex: "6 de 8 normais")
- Conexao emocional com metas do usuario
- Proxima acao sugerida (apenas 1)

---

## Detalhes Tecnicos da Implementacao

### Novo Componente

**Arquivo:** `src/components/dashboard/SmartSummaryCard.tsx`

**Props:**
```typescript
interface SmartSummaryCardProps {
  onboardingData: OnboardingData | null;
  labResult: LabResult | null;
  biomarkers: DetectedBiomarker[];
}
```

### Logica de Geracao do Resumo

A geracao sera feita **no frontend** usando logica deterministica (sem chamada de IA adicional), combinando:

1. Contagem de biomarcadores normais vs. atencao
2. Comparacao idade biologica vs. cronologica
3. Analise dos dados de onboarding
4. Metas de saude selecionadas

### Integracao no InsightsTab

Modificar `InsightsTab.tsx` para:
1. Receber `labResult` e `biomarkers` como props adicionais
2. Renderizar `SmartSummaryCard` como primeiro elemento
3. Manter todas as secoes existentes abaixo

### Alteracoes no Dashboard.tsx

Buscar e passar os dados necessarios para InsightsTab:
- labResult (ja disponivel)
- biomarkers (buscar com useDynamicBiomarkers)

### Traducoes

Adicionar novas chaves em `src/lib/i18n.ts`:
- `smartSummaryTitle`
- `smartSummaryPositive`
- `smartSummaryBalanced`
- `smartSummaryAttention`
- `smartSummaryNoData`
- `smartSummaryViewMore`
- (outras variacoes de texto)

---

## Resumo das Alteracoes

| Arquivo | Tipo | Descricao |
|---------|------|-----------|
| `SmartSummaryCard.tsx` | Criar | Novo componente principal do resumo |
| `InsightsTab.tsx` | Modificar | Adicionar props e renderizar SmartSummaryCard |
| `Dashboard.tsx` | Modificar | Passar labResult e biomarkers para InsightsTab |
| `i18n.ts` | Modificar | Adicionar traducoes para textos do resumo |

