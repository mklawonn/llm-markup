# LLM Markup Web Platform Tests

This directory contains conformance tests for the LLM Markup (LLMPM) specification.

## Test Coverage

| Namespace | Test Files | Coverage |
|-----------|------------|----------|
| Policy (parsing) | 4 | Input tokens, output tokens, memory tokens, license profiles |
| Policy (enforcement) | 4 | Mutation validation, inheritance, Shadow DOM, context representation |
| Intent | 2 | Attribute parsing, prompt construction |
| Provenance | 2 | Attribute parsing, ledger integrity |
| Global Policy | 4 | Delivery, defaults, constraints, dependencies |
| Integration | 1 | Cross-namespace interactions |
| **Total** | **17** | |

## Test Organization

```
web-platform-tests/
├── index.html              # Test suite index page
├── resources/              # Test harness and helper utilities
│   └── llm-markup-helpers.js
│
├── policy/                 # llm-policy-* namespace tests
│   ├── parsing/
│   │   ├── input-tokens.html      # Visibility token parsing
│   │   ├── output-tokens.html     # Mutation token parsing
│   │   ├── memory-tokens.html     # Retention token parsing
│   │   └── license.html           # SPDX license profile parsing
│   └── enforcement/
│       ├── mutation-validation.html   # Token-based enforcement
│       ├── inheritance.html           # Policy inheritance
│       ├── shadow-dom.html            # Shadow DOM boundaries
│       └── context-representation.html # Context format
│
├── intent/                 # llm-intent-* namespace tests
│   ├── parsing/
│   │   └── attributes.html        # All intent attributes
│   └── prompt/
│       └── construction.html      # Prompt generation
│
├── provenance/             # llm-provenance-* namespace tests
│   ├── parsing/
│   │   └── attributes.html        # Provenance attributes
│   └── integrity/
│       └── ledger.html            # Ledger and diff tracking
│
├── global-policy/          # Document-level policy tests
│   ├── delivery/
│   │   └── policy-delivery.html   # HTTP header / meta tag
│   ├── defaults/
│   │   └── policy-defaults.html   # Default values
│   ├── constraints/
│   │   └── category-rules.html    # Block selectors, rules
│   └── dependencies/
│       └── resolution.html        # Dependency algorithm
│
└── integration/            # Cross-namespace tests
    └── cross-namespace.html       # Combined behavior
```

## Running Tests

### With Web Platform Tests Infrastructure

If you have WPT set up:

```bash
./wpt run chrome llm-markup/
./wpt run firefox llm-markup/
./wpt run safari llm-markup/
```

### Local Development

For local development without full WPT infrastructure:

```bash
# Start a local server
cd /path/to/llm-markup
python -m http.server 8000

# Or with Node.js
npx serve .
```

Then navigate to:
- **Test index**: http://localhost:8000/tests/web-platform-tests/
- **Individual test**: http://localhost:8000/tests/web-platform-tests/policy/parsing/input-tokens.html

### Browser Console

You can also load tests directly in a browser DevTools console to debug:

```javascript
// Load helper functions
const script = document.createElement('script');
script.src = '/tests/web-platform-tests/resources/llm-markup-helpers.js';
document.head.appendChild(script);

// Create test elements
const el = createLLMElement('div', {
  'llm-policy-input': 'structure text',
  'llm-policy-output': 'annotation'
});

// Inspect policy
console.log(el.llmPolicy.effectiveInputTokens);
console.log(el.llmPolicy.hasOutputPermission('annotation'));
```

## Test Categories

### 1. Parsing Tests

Verify correct parsing of:
- Space-separated token lists
- Enumerated values
- URI attributes
- Compound license expressions
- Confidence scores (0.0-1.0)

### 2. Enforcement Tests

Verify that the User Agent:
- Correctly allows/blocks mutations based on policy tokens
- Applies intersection semantics for inheritance
- Respects Shadow DOM boundaries
- Generates correct context representation

### 3. Prompt Construction Tests

Verify that intent attributes generate expected prompts:
- Lexicon category → optimized prompt
- Custom value → fallback template
- Importance level → prioritization instructions
- Custom instruction → override behavior

### 4. Integrity Tests

Verify provenance ledger:
- Tracks all LLM mutations
- Detects unauthorized modifications
- Fires appropriate events
- Maintains entry uniqueness

### 5. Global Policy Tests

Verify document-level policies:
- HTTP header delivery and parsing
- Meta tag fallback
- Precedence rules (header > meta > attribute)
- Block selector matching
- Dependency resolution algorithm

## Writing New Tests

### Basic Test Structure

```javascript
test(() => {
  const el = createLLMElement('div', {
    'llm-policy-output': 'style annotation'
  });

  assert_true(el.llmPolicy.hasOutputPermission('style'));
  assert_true(el.llmPolicy.hasOutputPermission('annotation'));
  assert_false(el.llmPolicy.hasOutputPermission('content'));
}, 'Multiple output tokens are parsed correctly');
```

### Async Tests

```javascript
async_test(t => {
  document.onllmprovenancechange = t.step_func_done(event => {
    assert_equals(event.layer, 'content');
    assert_true(event.explanation.length > 0);
  });

  // Trigger a provenance change...
}, 'Provenance change event fires with correct data');
```

### Using Helper Functions

```javascript
// Create elements with LLM attributes
const el = createLLMElement('div', {
  'llm-policy-input': 'structure text',
  'llm-intent-category': 'summary'
});

// Create nested structures
const fragment = createNestedStructure([
  { tag: 'section', attrs: {'llm-policy-output': 'content'}, children: [
    { tag: 'p', text: 'Nested content' }
  ]}
]);

// Assert effective policy
assert_effective_policy(el, {
  input: ['structure', 'text'],
  output: ['readonly']  // default
});

// Iterate valid tokens
for (const token of VALID_OUTPUT_TOKENS) {
  // test each token...
}
```

## Test Constants

The helper file provides constants for iteration:

```javascript
VALID_INPUT_TOKENS     // ['none', 'structure', 'text', 'attributes', 'media', 'all']
VALID_OUTPUT_TOKENS    // ['readonly', 'style', 'interaction', ...]
VALID_MEMORY_TOKENS    // ['none', 'session', 'user', 'training']
VALID_IMPORTANCE_LEVELS // ['critical', 'high', 'normal', 'low', 'background']
VALID_PROVENANCE_LAYERS // ['content', 'style', 'interaction', ...]
LICENSE_PROFILES       // { 'MIT': {...}, 'CC-BY-4.0': {...}, ... }
LEXICON_CATEGORIES     // { 'summary': '...', 'definition': '...', ... }
```

## Specification Reference

Tests reference the normative specification at [spec/index.bs](../../spec/index.bs).

For test methodology questions, see the [Web Platform Tests documentation](https://web-platform-tests.org/writing-tests/).
