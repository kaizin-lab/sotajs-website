# Coverage analysis: 5 gaps vs @sotajs/ddd

## Gap 1: Structural typing sabotages Value Objects
**Проблема:** `{value: string}` для Email и `{value: string}` для Username — взаимозаменяемы на уровне компилятора.
**Покрытие:** ЧАСТИЧНОЕ
- ✅ `createBrandedId` даёт compile-time различение ID-типов (UserId ≠ ProductId)
- ❌ `createValueObject` НЕ даёт nominal distinction между Value Objects одинаковой структуры но разной семантики. Email и Username с одинаковыми полями — всё ещё совместимы.
**Что не покрыто:** Branded-типы для Value Objects требуют ручного брендирования.

## Gap 2: No runtime encapsulation
**Проблема:** `JSON.stringify` и ORM-маппинг обходят приватность, агрегат превращается в plain object на границе persistence.
**Покрытие:** СИЛЬНОЕ внутри процесса, НУЛЕВОЕ на границе persistence
- ✅ WeakMap-based state — нет `this` pollution, поля недоступны снаружи
- ✅ `deepFreeze` на каждом `.props` — мутация через присваивание невозможна (TypeError)
- ✅ Actions — единственный путь к изменению состояния
- ✅ Invariants в createAggregate — required field, проверка после каждого action
- ❌ Сериализация: `JSON.stringify(entity)` не даст ничего полезного, нужно явно брать `.props`. Но если кто-то сохраняет сырой объект в БД и восстанавливает минуя `.create()` — инкапсуляция нарушена.
**Что не покрыто:** ORM-маппинг. Библиотека не диктует как хранить. Разработчик сам решает маппинг туда-обратно.

## Gap 3: async/await breaks transactional consistency
**Проблема:** Domain Events собираются за время синхронной транзакции. В Node параллельные запросы к одному агрегату — race condition. Optimistic locking почти никто не делает.
**Покрытие:** НЕТ
- ❌ Библиотека не даёт optimistic locking, version tracking, concurrency control
- ❌ Domain Events в createAggregate — pull-based (возвращаются из action, диспатчит use case), но синхронизация между параллельными запросами — задача инфраструктуры
**Почему не покрыто:** Это слой инфраструктуры (Repository), а не домена. Библиотека сознательно ограничена доменным слоем. В оригинальном SotaJS-фреймворке это решалось через порты/адаптеры, но они не вошли в @sotajs/ddd.

## Gap 4: No ORM supports rich domain models
**Проблема:** Prisma генерирует анемичные DTO. Drizzle — SQL-билдер. Любой Repository pattern требует custom mapping layer.
**Покрытие:** ENABLER (не решение, но делает решение доступным)
- ✅ Библиотека ORM-agnostic — не привязана ни к чему
- ✅ Богатая модель теперь стоит 3 поля конфига, а не 45 строк бойлерплейта. Стоимость «правильного» решения снижена настолько, что custom mapping layer оправдан.
- ❌ Mapping layer всё ещё нужно писать руками. Библиотека его не предоставляет.
**Двухфазный подход из оригинального README:** Фаза 1 — Zod-схемы на анемичных моделях (Prisma DTO). Фаза 2 — когда бизнес-логика усложняется, evolve в createEntity/createAggregate. Mapping пишется один раз при переходе.

## Gap 5: Culture — transformations, not invariants
**Проблема:** Node-комьюнити выросло из functional/pragmatic культуры. Thinking in invariants отсутствует, есть thinking in data transformations. DDD-паттерны ощущаются как карго-культ.
**Покрытие:** СИЛЬНОЕ
- ✅ `createAggregate` требует поле `invariants` — TypeScript не даст создать агрегат без них
- ✅ Invariants проверяются при `.create()` и после каждого action — автоматически, не «надо помнить»
- ✅ `props` всегда frozen — физически нельзя мутировать в обход actions
- ✅ Config-driven DX: разработчик не «пишет класс с инвариантами», он заполняет конфиг. Инвариант — это просто функция в массиве, не архитектурное решение.
**Эффект:** Библиотека не учит «думать инвариантами». Она делает инварианты cheaper than skipping them. Правильное поведение — побочный эффект использования инструмента.

---

## Итого: матрица покрытия

| Gap | Покрытие | Что даёт библиотека | Что остаётся на разработчике |
|---|---|---|---|
| 1. Structural typing | Частичное | BrandedId для ID-типов | Branded-типы для Value Objects |
| 2. No encapsulation | Сильное (in-process) | WeakMap + deepFreeze + actions | Маппинг на границе persistence |
| 3. async consistency | Нет | — | Optimistic locking, транзакции |
| 4. No rich-model ORM | Enabler | Дешёвая rich model | Custom mapping layer |
| 5. Culture mismatch | Сильное | invariants required, props frozen, config-driven DX | Принятие в команде |

## Что показывать на лендинге

Только gaps 1, 2, 4, 5 — те где библиотека реально закрывает разрыв.
Gap 3 (async consistency) — честно не показываем, это не наше.

Для каждого gap показывать НЕ «вот проблема, вот решение» а конкретный код:
- Gap 1: `createBrandedId({ brand: "UserId" })` → `function assignToUser(id: UserId)` не примет ProductId
- Gap 2: `entity.props.bio = "x"` → TypeError. Показать что происходит.
- Gap 4: Таблица «anemic vs rich» с ценами: без библиотеки 900 строк → никто не пишет, с библиотекой 3 поля конфига → пишут
- Gap 5: `createAggregate({ invariants: [...] })` — required, не скомпилируется без
