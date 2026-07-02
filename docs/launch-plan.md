# sotajs/ddd — Launch Plan

## Принцип документации (из обсуждения)

**Show, don't tell. Magic first, reveal later.**

- Первичная цель: показать как использовать. Код-примеры ведут.
- Вторичная цель: «это не магия» — точечные вставки, активируемые естественным вопросом читателя.
- Паттерн: читатель доходит до момента где *должен* возникнуть вопрос → вставка с ответом → ссылка на исходник (`entity.ts:83`).
- Не «Entity поддерживает автосеттеры» в списке фич. А: читатель видит код → думает «а если я напрямую?» → «Не получится. props заморожен. Автосеттеры из schema.shape — [entity.ts:83](link).»

---

## Фаза 1: Foundation (1-2 дня)

**Цель:** библиотека выглядит как продукт, не как эксперимент.

| Задача | Gate |
|---|---|
| README.md в sotajs-ddd | Содержит: что это, пример Entity, пример Aggregate, install, линк на сайт |
| Repo description + topics | `domain-driven-design, typescript, ddd, entity, aggregate, nodejs` |
| Labels на issues | gap, architecture, dx, documentation, entity, aggregate |
| Getting-started с полным циклом | Zod → Entity → Aggregate → Repository → Use Case → Controller. 60 строк сквозного кода |
| «What we don't cover» страница | Честный список: репозитории, event dispatch, TypeORM, optimistic locking |
| Favicon | SVG или минимальный значок |

**Gate check:** Открываешь github.com/kaizin-lab/sotajs-ddd — видишь описание, README, 6 issues с labels. Открываешь сайт — видишь getting-started с полным примером.

---

## Фаза 2: Content (2-3 дня)

**Цель:** разработчик может прийти, прочитать, начать использовать — без вопросов. Документация следует принципу «show, don't tell».

| Задача | Gate |
|---|---|
| API reference: Entity | Код-примеры ведут. «Не магия» вставки на ключевых моментах |
| API reference: Aggregate | invariants, entities, events. Отличие от Entity через пример |
| API reference: ValueObject + BrandedId | Структурное равенство, branded types |
| Repository pattern guide | Как писать репозиторий с Prisma / Drizzle / Knex. 3 примера |
| ORM integration page | Честная таблица: Prisma ✓, Drizzle ✓, Knex ✓, TypeORM ✗ (почему) |
| npm publish `@sotajs/ddd` v0.1.0 | `npm install @sotajs/ddd` работает |

**Gate check:** Разработчик заходит на сайт → getting-started → копирует пример → работает. Идёт в docs → находит ответ на вопрос «как с моим ORM».

---

## Фаза 3: Launch (1 день)

**Цель:** сигнал «мы открыты, заходите».

| Задача | Gate |
|---|---|
| Twitter/X announcement | Тред: проблема (DDD дорого в Node), решение (4 функции), код-пример, ссылка |
| GitHub repo pinned/featured | Stars ready |
| Reddit / r/node, r/typescript | Честный пост: «сделали библиотеку, вот gaps, вот планы, приходите» |
| Ответы на issues | Первые issues получить response в течение дня |

**Gate check:** Тред на X опубликован, ссылка на сайт, ссылка на репо. Репо готово принимать звёзды.

---

## Что НЕ делаем перед запуском

- ❌ Entity invariants (issue #6) — спринт после релиза
- ❌ ORM auto-mapping — спринт после релиза
- ❌ Логотип/брендинг сложный — ◇ достаточно для v0.1
- ❌ 100% покрытие тактического DDD — не цель v0.1
