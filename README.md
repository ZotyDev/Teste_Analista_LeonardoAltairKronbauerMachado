# Desafio Técnico - Analista de Sistemas

Este repositório contém duas entregas: um **dashboard de vendas** em Angular e **queries SQL** para análise de dados de clientes.

**Demo:** https://zotydev.github.io/Teste_Analista_LeonardoAltairKronbauerMachado/

---

## Como Executar

### Dashboard

```bash
cd dashboard
npm install
npm start
```

Acesse em `http://localhost:4200`. Para rodar os testes: `npm test`.

### SQL

As queries estão na pasta `/sql` e seguem o padrão ANSI SQL — funcionam em PostgreSQL, MySQL, SQLite e outros. Basta executá-las no SGBD de sua preferência.

---

## Decisões Técnicas

### Dashboard Angular

O dashboard foi construído com Angular 21 usando a nova API de Signals combinada com RxJS. Essa escolha permite que filtros e ordenação sejam reativos sem necessidade de refresh manual, e o `shareReplay` garante que a requisição HTTP seja feita apenas uma vez, mantendo os dados em cache.

Todos os componentes são standalone (sem NgModules), o que simplifica a estrutura e melhora o bundle final. A separação segue o padrão onde o `DashboardComponent` concentra a lógica de estado, enquanto os demais componentes (tabela, filtros, paginação, cards de KPI) são apenas apresentacionais.

Um detalhe importante: os cálculos de valores monetários são feitos em centavos (multiplicando por 100 e trabalhando com inteiros) para evitar os erros clássicos de ponto flutuante do JavaScript. A conversão para reais acontece só na hora de exibir. Para garantir a formatação brasileira (R$ 1.000,00) independente do locale do navegador, foi criado um pipe customizado (`BrlCurrencyPipe`) que usa `Intl.NumberFormat` com locale fixo em `pt-BR`.

A busca por cliente ignora acentos e maiúsculas/minúsculas, facilitando a experiência do usuário.

As cores utilizadas na interface foram baseadas na identidade visual da Pirahy Alimentos, buscando manter consistência visual e reforçar um aspecto mais realista de aplicação corporativa. Além disso, foram implementados testes unitários (.spec.ts) para validar os principais comportamentos da aplicação e garantir o funcionamento correto do sistema.

### Queries SQL

A query de **churn** identifica clientes que já fizeram compras mas estão inativos há mais de 90 dias. Usa `EXISTS` e `NOT EXISTS` ao invés de `IN` com subquery, que tende a performar melhor em bases maiores.

A query de **performance** retorna um ranking de clientes por valor total gasto, tratando casos onde o cliente nunca fez pedidos com `COALESCE` para evitar nulos.

---

## Estrutura do Projeto

```
├── dashboard/
│   └── src/app/
│       ├── components/      # Componentes visuais (tabela, filtros, cards, etc)
│       ├── models/          # Interfaces TypeScript
│       ├── pipes/           # Pipes customizados (BrlCurrencyPipe)
│       └── services/        # Serviço de vendas com estado reativo
│
└── sql/
    ├── churn_clientes.sql        # Clientes inativos há 90+ dias
    └── performance_clientes.sql  # Ranking por valor gasto
```

---

## Tecnologias

**Frontend:** Angular 21, TypeScript, TailwindCSS, RxJS, Vitest

**SQL:** ANSI SQL (testado em PostgreSQL)
