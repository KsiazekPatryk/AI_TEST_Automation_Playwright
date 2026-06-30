# AI Test Automation — Playwright + TypeScript

Repozytorium demonstracyjne prezentujące **w pełni zautomatyzowany pipeline testów** dla aplikacji Bookstore (REST API + interfejs webowy), zbudowany z użyciem Playwright i TypeScript. Projekt służy jako wzorcowy szablon architektury testów oraz jako laboratorium integracji narzędzi AI (GitHub Copilot Agents) w cykl wytwarzania testów.

---

## Spis treści

- [Opis projektu](#opis-projektu)
- [Stack technologiczny](#stack-technologiczny)
- [Architektura projektu](#architektura-projektu)
- [Testowana aplikacja](#testowana-aplikacja)
- [Typy testów](#typy-testów)
- [Rozwiązania AI — GitHub Copilot Agents](#rozwiązania-ai--github-copilot-agents)
- [Uruchomienie projektu](#uruchomienie-projektu)
- [Konwencje i standardy kodu](#konwencje-i-standardy-kodu)
- [Zmienne środowiskowe](#zmienne-środowiskowe)

---

## Opis projektu

Projekt implementuje trójwarstwowe testy automatyczne:

| Warstwa | Zakres |
|---------|--------|
| **API** | Testy kontraktowe, pozytywne i negatywne dla REST API (Authors, Books) |
| **UI** | Testy funkcjonalne interfejsu webowego w oparciu o Page Object Model |
| **E2E** | Hybrydowe scenariusze łączące przygotowanie przez API, akcje przez UI i weryfikację przez API |

Kluczową cechą projektu jest **w pełni zaimplementowany ekosystem agentów AI**, który prowadzi QA inżyniera przez cały cykl życia testu — od planowania, przez pisanie, aż po refaktoryzację i review kodu — bez opuszczania środowiska VS Code.

---

## Stack technologiczny

| Narzędzie | Wersja | Rola |
|-----------|--------|------|
| **Playwright Test** | ^1.60.0 | Framework testowy (UI, API, E2E) |
| **TypeScript** | strict | Statyczne typowanie, brak `any` |
| **@faker-js/faker** | ^10.4.0 | Generowanie dynamicznych danych testowych |
| **zod** | ^4.4.3 | Walidacja schematów odpowiedzi API w runtime |
| **chalk** | ^4.1.2 | Kolorowane, strukturalne logi HTTP w konsoli |
| **dotenv** | ^17.4.2 | Zarządzanie zmiennymi środowiskowymi |
| **Node.js** | ES2023 | Środowisko uruchomieniowe |
| **GitHub Copilot** | Claude Sonnet 4.6 | Agenci AI do planowania i pisania testów |

---

## Architektura projektu

```
src/
├── api/
│   ├── consts/         # Stałe: ścieżki endpointów, kody HTTP
│   ├── models/         # Interfejsy TypeScript dla payloadów i odpowiedzi API
│   ├── factories/      # Generatory payloadów z użyciem faker (np. getRandomAuthorPayload)
│   ├── requests/       # Warstwa HTTP — klasy opakowujące APIRequestContext
│   ├── steps/          # Wieloetapowe operacje API z wbudowanymi asercjami
│   └── schemas/        # Schematy Zod do walidacji kontraktowej
├── ui/
│   ├── pages/          # Page Objects — jedna klasa per strona (*.page.ts)
│   ├── components/     # Wielokrotnego użytku fragmenty UI (modal, panel, toast)
│   ├── models/         # Interfejsy dla danych formularzy UI
│   └── factories/      # Generatory danych formularzy UI z użyciem faker
├── fixtures/           # Rozszerzenia testów Playwright (*.fixture.ts)
├── data/               # Stałe statyczne, enumy, dane seed
└── utils/              # Pomocnicze funkcje (parseResponse, logowanie)

tests/
├── api/                # Testy API (*.spec.ts)
│   ├── authors/        # GET/POST/PUT dla zasobu Authors
│   └── books/          # POST/PUT dla zasobu Books
├── ui/                 # Testy UI (*.spec.ts)
└── e2e/                # Scenariusze E2E (*.spec.ts)

docs/
├── openapi/            # Specyfikacja OpenAPI testowanego API
└── scenarios/
    ├── api/            # Plany scenariuszy API (generowane przez agenta AI)
    ├── ui/             # Plany scenariuszy UI (generowane przez agenta AI)
    └── e2e/            # Plany scenariuszy E2E (generowane przez agenta AI)

.github/
├── agents/             # Definicje agentów AI (*.agent.md)
└── instruction/        # Instrukcje automatyzacji dla Copilot
```

### Aliasy ścieżek (tsconfig.json)

```
@api/consts/*     → src/api/consts/*
@api/requests/*   → src/api/requests/*
@api/factories/*  → src/api/factories/*
@api/models/*     → src/api/models/*
@api/steps/*      → src/api/steps/*
@api/schemas/*    → src/api/schemas/*
@ui/pages/*       → src/ui/pages/*
@ui/components/*  → src/ui/components/*
@ui/models/*      → src/ui/models/*
@ui/factories/*   → src/ui/factories/*
@data/*           → src/data/*
@utils/*          → src/utils/*
@fixtures/*       → src/fixtures/*
```

---

## Testowana aplikacja

Projekt testuje aplikację **Bookstore** składającą się z:

- **REST API** (`https://bookstoreapi.up.railway.app`) — zasoby `Authors` i `Books`
- **Interfejsu webowego** (`https://ksiegarnia.up.railway.app`) — zarządzanie książkami i autorami

Specyfikacja API jest dostępna w pliku [docs/openapi/bookstoreapi.openapi.json](docs/openapi/bookstoreapi.openapi.json).

---

## Typy testów

### Testy API

Każdy endpoint testowany jest w trzech grupach scenariuszy:

| Grupa | Opis | Przykład pliku |
|-------|------|----------------|
| **Schema** | Walidacja kontraktu odpowiedzi (Zod) | `authors-post-schema.spec.ts` |
| **Positive** | Scenariusze poprawne — happy path | `authors-post-positive.spec.ts` |
| **Negative** | Błędne dane wejściowe, kody 4xx | `authors-post-negative.spec.ts` |

Testy API używają **trójwarstwowej architektury**:

```
APIRequest (surowe wywołania HTTP)
    ↓
AuthorsAPIRequest / BooksAPIRequest (endpointy zasobu)
    ↓
AuthorsAPISteps / BooksAPISteps (operacje z asercjami i walidacją Zod)
```

### Testy UI

Implementują **Page Object Model** z wydzielonymi komponentami:

- `AuthorsPage`, `BooksManagementPage`, `BookListingPage` — klasy stron
- `AddNewAuthorFormComponent`, `AddNewBookFormComponent`, `EditBookPanelComponent`, `ToastComponent` — komponenty UI
- Każdy Page Object posiada lokatory zadeklarowane w konstruktorze, metody opisujące akcje użytkownika, brak asercji wewnątrz klas

### Testy E2E

Wzorzec hybrydowy: **API setup → UI action → UI assertion → API assertion → API cleanup**

Przykład (`edit-book-add-second-author.spec.ts`):
1. Tworzenie 2 autorów i książki przez API
2. Weryfikacja stanu początkowego przez API
3. Nawigacja i edycja przez UI (dodanie drugiego autora)
4. Weryfikacja zamknięcia panelu i toast'a sukcesu w UI
5. Weryfikacja zmienionej listy autorów przez API
6. Sprzątanie zasobów przez API w `afterEach`

### Fixture System

Projekt używa kompozycji fixtures:

```typescript
// src/fixtures/test.fixture.ts
export const test = mergeTests(apiLogger, apiRequests, pages);
```

- **`api.logger.fixture.ts`** — interceptuje każde żądanie HTTP i loguje je z kolorami (chalk) do konsoli
- **`api.fixture.ts`** — dostarcza `authorsApiRequest`, `authorsApiSteps`, `booksApiRequest`, `booksApiSteps`
- **`pages.fixture.ts`** — dostarcza wszystkie Page Objects i Components

---

## Rozwiązania AI — GitHub Copilot Agents

To jest kluczowa część projektu. Folder `.github/agents/` zawiera **12 wyspecjalizowanych agentów AI**, które automatyzują cały cykl życia testów automatycznych w VS Code z użyciem GitHub Copilot (model: **Claude Sonnet 4.6**).

### Przegląd agentów

```
.github/agents/
├── 🧠 API Test Planner       — planowanie scenariuszy API z OpenAPI
├── 📝 API Test Writer        — pisanie prostych testów API
├── ♻️  API Test Refactor      — refaktoryzacja do architektury produkcyjnej
├── 🔍 API Test Code Review   — przegląd jakości testów API
├── 🧠 UI Test Planner        — planowanie scenariuszy UI z eksploracji MCP
├── 📝 UI Test Writer         — pisanie prostych testów UI
├── ♻️  UI Test Refactor       — refaktoryzacja do Page Object Model
├── 🔍 UI Test Code Review    — przegląd jakości testów UI
├── 🧠 E2E Test Planner       — planowanie hybrydowych scenariuszy E2E
├── 📝 E2E Test Writer        — pisanie prostych testów E2E
├── ♻️  E2E Test Refactor      — refaktoryzacja architektury E2E
└── 🔍 E2E Test Code Review   — pełny przegląd UI + API + E2E
```

### Jak działają agenci

Każdy agent jest plikiem Markdown z nagłówkiem YAML definiującym:
- `name` — wyświetlana nazwa w Copilot Chat
- `description` — opis kiedy agent powinien być używany (triggery słowne)
- `model` — model LLM (Claude Sonnet 4.6 / GPT-5.3-Codex)
- `tools` — dostępne narzędzia (read, write, edit, browser, execute itd.)

```yaml
---
name: 🧠 API Test Planner - OpenAPI Based
description: "Generate automation-ready API test plans from OpenAPI..."
model: Claude Sonnet 4.6 (copilot)
tools: [read, write, edit, search, vscode, todo]
---
```

### Pipeline AI — pełny cykl wytwarzania testu

```
OpenAPI Spec
     │
     ▼
🧠 [Planner Agent]
Analizuje spec, tworzy scenariusze w docs/scenarios/
     │
     ▼
📝 [Writer Agent]
Czyta scenariusz, używa MCP browser do eksploracji UI,
pisze działający test (.spec.ts), uruchamia go
     │
     ▼
♻️  [Refactor Agent]
Przenosi logikę do Page Objects, Components, Fixtures,
zapewnia zgodność z architekturą projektu
     │
     ▼
🔍 [Code Review Agent]
Analizuje kod pod kątem błędów, anty-wzorców,
flaky patterns, naruszeń architektury
```

### Integracja z Playwright MCP Browser

Agenci `UI Test Planner`, `UI Test Writer` i `E2E Test Planner` używają narzędzi **Playwright MCP** do bezpośredniej eksploracji aplikacji w przeglądarce:

- `mcp_playwright_browser_navigate` — otwieranie stron
- `mcp_playwright_browser_snapshot` — odczyt struktury DOM (preferowane nad screenshotami)
- `mcp_playwright_browser_click`, `browser_type`, `browser_fill_form` — interakcje z UI

Dzięki temu agenci **nigdy nie zgadują lokatorów** — zawsze bazują na rzeczywistym DOM. Wyeliminowane są błędy wynikające z nieaktualnej dokumentacji czy zgadywania selektorów.

### Instrukcja projektowa dla Copilot

Plik [AGENTS.md](AGENTS.md) jest ładowany automatycznie przez GitHub Copilot do kontekstu każdej sesji. Zawiera:
- Kompletny stack technologiczny
- Strukturę projektu z opisami katalogów
- Wszystkie aliasy ścieżek
- Konwencje nazewnictwa plików
- Zasady UI, API i E2E testowania
- Preferowany porządek lokatorów Playwright
- Zasady asercji (web-first, auto-retrying)

Plik `.github/instruction/setup-playwright-project.instructions.md` pozwala agentowi `Copilot` na jednorazowe automatyczne **tworzenie całego szkieletu projektu** od zera zgodnie z architekturą opisaną w tym README.

### API Test Code Review — model GPT-5.3-Codex

Agenci do Code Review (`API`, `UI`, `E2E`) używają modelu **GPT-5.3-Codex** (zamiast Claude) i integrują się z **SonarLint** (rozszerzenie VS Code):

- `sonarqube_analyzeFile` — analiza bezpieczeństwa i jakości kodu
- `sonarqube_listPotentialSecurityIssues` — wykrywanie podatności OWASP

### Zasady agentów — zabezpieczenia przed halucynacjami

Każdy agent posiada listę twardych reguł (`Hard Rules`) zapobiegającą typowym problemom LLM:

**Planner Agents:**
- `NEVER invent endpoints, fields, validations not in OpenAPI`
- `NEVER write automation code` — tylko plany scenariuszy
- `Ask First` — zawsze weryfikuj brakujące dane z użytkownikiem

**Writer Agents:**
- `NEVER generate tests without executing them`
- `NEVER declare success before tests pass`
- `NEVER use waitForTimeout` — tylko auto-retrying locators
- `NEVER guess locators without inspecting DOM via Playwright MCP`

**Refactor Agents:**
- `NEVER break working tests`
- `NEVER declare success before tests pass TWICE IN A ROW`
- `ONLY refactor files explicitly attached to the prompt`

**Code Review Agents:**
- `Assume every test contains problems until proven otherwise`
- `Every finding MUST include: description, why it is a problem, BEFORE/AFTER example`
- `Never say "Looks good"`

---

## Uruchomienie projektu

### Wymagania wstępne

- Node.js 20+
- Dostęp do testowanej aplikacji Bookstore

### Instalacja

```bash
npm install
npx playwright install chromium
```

### Konfiguracja środowiska

Skopiuj i uzupełnij plik zmiennych środowiskowych:

```bash
cp .env.example .env
```

Uzupełnij wartości w `.env`:

```env
UI_URL=https://ksiegarnia.up.railway.app
API_URL=https://bookstoreapi.up.railway.app
LOGGER=true
OPENAPI_SPEC=docs/openapi/bookstoreapi.openapi.json
```

### Uruchamianie testów

| Komenda | Opis |
|---------|------|
| `npm test` | Wszystkie testy (domyślny projekt) |
| `npm run test:api` | Tylko testy API |
| `npm run test:ui` | Tylko testy UI |
| `npm run test:e2e` | Tylko testy E2E |
| `npm run test:all` | Wszystkie projekty (api + ui + e2e) |
| `npm run test:headed` | Testy UI z widoczną przeglądarką |
| `npm run test:debug` | Playwright Inspector (tryb debugowania) |
| `npm run test:report` | Otwarcie raportu HTML |
| `npm run test:list` | Listowanie wszystkich wykrytych testów |

### Tagowanie testów

Testy są tagowane dla łatwego filtrowania:

```bash
# Tylko testy smoke
npx playwright test --grep @smoke

# Tylko testy związane z books
npx playwright test --grep @books-management

# Tylko testy API autorów
npx playwright test --grep "@api @authors"
```

---

## Konwencje i standardy kodu

### Nazewnictwo plików

| Typ | Wzorzec |
|-----|---------|
| Page Object | `*.page.ts` |
| Component Object | `*.component.ts` |
| Fixture | `*.fixture.ts` |
| Spec file | `*.spec.ts` |
| Model / interfejs | `*.model.ts` |
| Factory / builder | `*.factory.ts` |
| API request helper | `*.api.request.ts` |
| API steps | `*.api.steps.ts` |
| Constants file | `*.const.ts` |

### Kluczowe zasady

1. **Strict TypeScript** — brak `any`, explicite typy zwracane przez publiczne metody, `readonly` dla niezmiennych pól
2. **Lokatory** — priorytet: `getByRole` > `getByLabel` > `getByPlaceholder` > `getByText` > `getByTestId` > CSS (tylko jeśli żaden semantyczny nie pasuje)
3. **Asercje** — wyłącznie web-first auto-retrying assertions (`toBeVisible`, `toHaveText`, `toHaveURL` itp.)
4. **Brak `waitForTimeout`** — nigdy, bez wyjątków
5. **Import testu** — zawsze `import { test, expect } from '@fixtures/test.fixture'`, nigdy bezpośrednio z `@playwright/test`
6. **Czyszczenie danych** — każdy test E2E/API musi sprzątać po sobie w `afterEach`
7. **Dane dynamiczne** — generowane przez faker, nie hardkodowane

### Struktura testu E2E

```typescript
test('scenario name', async ({ fixtures... }) => {
  // ── ARRANGE ──────────────────────────────────────────
  // Przygotowanie przez API

  // ── ACT ──────────────────────────────────────────────
  // Akcje przez UI

  // ── ASSERT ───────────────────────────────────────────
  // Weryfikacja UI + API
});
```

---

## Zmienne środowiskowe

| Zmienna | Opis | Przykład |
|---------|------|---------|
| `UI_URL` | Base URL interfejsu webowego | `https://ksiegarnia.up.railway.app` |
| `API_URL` | Base URL REST API | `https://bookstoreapi.up.railway.app` |
| `LOGGER` | Włącz/wyłącz logowanie HTTP w konsoli | `true` / `false` |
| `OPENAPI_SPEC` | Ścieżka do pliku OpenAPI (używana przez agentów AI) | `docs/openapi/bookstoreapi.openapi.json` |

> Nigdy nie commituj pliku `.env`. Plik `.env.example` należy aktualizować przy dodawaniu nowych zmiennych.

---

## Licencja

ISC
