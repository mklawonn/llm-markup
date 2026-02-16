# LLM Markup (LLMPM)

**A Policy and Intent Overlay for HTML**

LLM Markup (LLMPM) is a proposal for a declarative transformation contract between servers and **LLM-Infused User Agents (Browsers)**. It provides a machine-readable layer to specify transformation constraints, semantic intent, and governance rules without altering the primary content layer.

**Key Distinction:** This standard places conformance requirements on the **Browser (User Agent)**, not the underlying Language Model.
- **Policies (Hard Constraints):** The Browser MUST mechanistically enforce these rules (e.g., preventing modification of `immutable` text).
- **Intent (Deterministic Context):** The Browser MUST parse these tags deterministically to construct a predictable context object or system prompt (e.g., mapping `<div llm-intent="summarize">` to a standard signal). The *LLM's subsequent generation* remains probabilistic, but the *Browser's input* to it is standardized.

## Repository Structure

```text
/
├── README.md               # High-level introduction and project roadmap
├── CONTRIBUTING.md         # W3C IPR policies, code of conduct, contribution guides
├── LICENSE                 # W3C Software and Document License
│
├── spec/                   # Normative Specification (The "Standard")
│   ├── index.bs            # The single-source spec document (Bikeshed format)
│   ├── definitions.md      # Glossary of terms (Content, Presentation, Structure layers)
│   └── images/             # Diagrams for the spec
│
├── explainer/              # Non-normative context (The "Why")
│   ├── index.md            # The "Explainer" document (problem statement, user stories)
│   ├── security-privacy.md # Security & Privacy Questionnaire responses
│   └── use-cases/          # Specific detailed scenarios (e.g., "Medical Advice", "News")
│
├── namespaces/             # Formal Namespace Definitions
│   ├── policy/             # llm-policy: (Hard Constraints)
│   ├── intent/             # llm-intent: (Soft Constraints)
│   └── provenance/         # llm-provenance: (Audit Metadata)
│
├── schemas/                # Machine-readable definitions
│   ├── json-schema/        # JSON schemas for Header Payloads
│   └── webidl/             # WebIDL for DOM interfaces (if extending the DOM API)
│
├── examples/               # Reference usage
│   ├── basic/              # Simple HTML files with markup
│   └── complex/            # Full page examples (News article, e-commerce)
│
└── tests/                  # Conformance Tests
    └── web-platform-tests/ # WPT-style tests to verify browser/agent behavior
```

## Development Roadmap

1.  **Explainer Phase:** Define the problem space, user stories, and high-level mechanics.
2.  **Specification Phase:** Draft the formal normative text using Bikeshed.
3.  **Technical Definition:** Formalize JSON schemas for global policies and WebIDL for DOM integration.
4.  **Implementation & Validation:** Build reference examples and conformance tests to ensure interoperability.

For more details on the core proposal, see the [Explainer](./explainer/index.md).
