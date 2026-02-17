# Explainer: LLM Markup Sketch

This document serves as the initial explainer for the LLM Markup Sketch proposal.

## I. Introduction and Proposal

The LLM Markup Sketch is a proposal for a declarative transformation contract, a markup layer that acts as a Policy & Intent Overlay on top of HTML. Its purpose is to enable the construction of contracts between a server and an LLM-infused browser.

Crucially, this is not a new document language; it is a declarative transformation contract embedded in existing HTML.

## II. Formal Definition and Core Properties

### Formal Definition
An LLM Policy Markup (LLMPM) is a namespaced, machine-readable annotation layer over the Document Object Model (DOM). It defines a standard for **LLM-Infused User Agents (Browsers)** to strictly enforce transformation constraints (Policy) and convey semantic guidance (Intent) to an attached Language Model.

**Crucial Distinction:** The *User Agent* is the conforming entity, not the LLM. The User Agent uses deterministic logic to enforce policies and manage the interaction between the content and the probabilistic LLM.

### Core Properties
Our markup is:
- **Declarative**
- **Non-rendering**
- **Orthogonal to content**
- **Machine-enforceable (by the Browser)**
- **Composable with HTML5**
- **Ignorable by legacy browsers**

### Behavioral Analogies
It behaves like:
- **ARIA (semantic overlay):** Provides a semantic layer.
- **CSP (policy declaration):** Declares governance rules.
- **RDFa (metadata layer):** Functions as a metadata layer.

However, it is specialized specifically for LLM transformation control.

## III. The LLMPM Namespaces

The markup is composed of three orthogonal namespaces, with the `LLM-Policy` namespace providing granular control over how the User Agent manages the interaction between the DOM and the LLM.

### 1. LLM-Policy (Hard Constraints - Browser Enforced)

The Policy namespace is divided into three functional attributes that govern the flow of information across the document layers:

- **`llm-policy-input` (Read Control):** Defines what the LLM is allowed to see.
    - `allow`: Full visibility.
    - `block`: Complete redaction from the LLM context.
    - `mask`: Structural visibility but content-masked.
    - `summary`: Abstracted view.
- **`llm-policy-output` (Write Control):** Defines what the LLM is allowed to modify.
    - `readonly`: No mutations permitted.
    - `mutable`: Full modification permitted.
    - `append-only`: Only additions are allowed.
    - `style-only`: Restricts mutations to the Presentation Layer.
    - `content-only`: Restricts mutations to the Content Layer.
- **`llm-policy-memory` (Retention Control):** Defines data privacy and storage rules.
    - `no-store`: Ephemeral processing; no training or retention.
    - `persist`: Long-term memory allowed.

### 2. LLM-Intent (Soft Constraints - Deterministic Context Construction)

These constraints guide optimization. The User Agent's responsibility is to **deterministically parse** these attributes and construct a predictable context or system prompt for the LLM.

...

## IV. Global Policy and Precedence

In addition to HTML attributes (local markup), a system can define a **Global Policy Header** via a JSON payload.

### Precedence Logic
1. **Constraints (Global):** Defined in the header, these are immutable and cannot be overridden by local attributes (e.g., a site-wide block on PII).
2. **Local Attributes:** Define specific overrides for nodes (e.g., making a specific section `mutable` when the site default is `readonly`).
3. **Defaults (Global):** The fallback behavior when no local attribute is present.

### 3. LLM-Provenance (Context Tracking)
This namespace functions as an internal ledger for the User Agent, tracking the origin and reliability of information as it is synthesized from multiple sources.
- `source` (URI Origin)
- `role` (Synthesis Function: primary, secondary, correction)
- `confidence` (Agent Certainty Score)
- `citation` (Display Label)

## IV. Contract Mechanics and Scope

### Contract Formation
Markup from these namespaces can be used to form contracts in two ways:
- **HTML Attributes:** Use HTML attributes when annotating what a specific DOM node is or permits (local markup).
- **Header JSON Payloads:** Use JSON when defining how the system as a whole must behave (global constraints and considerations).

### Operational Layers
These contracts operate across a number of distinct layers within the document model:

1. **Content Layer (Payload Objects)**
   - Textual Units: Raw text nodes, paragraphs, headings, etc.
   - Media Units: Images, audio, video, etc.
   - Structured Content: Tables, figures, JSON blobs, etc.
   - Derived Content Objects: Summaries, translations, etc.

2. **Presentation Layer (Rendering & Visual Form)**
   - CSS Constructs, Layout Systems, Visual Properties, Viewport Behavior.

3. **Structure Layer (Document Topology)**
   - Structural Objects, Hierarchical Semantics, Cross-References.

4. **Interaction Layer (Behavioral Semantics)**
   - Event System, Input Systems, Dynamic Behavior, LLM-Specific Behaviors.

5. **Data Layer (Machine-Readable Information)**
   - Embedded Data (JSON-LD, etc.), API Bindings, State Objects, Analytics.

6. **Semantic / Intent Layer (Meaning Annotations)**
   - Communicative Role, Domain Context, Audience Targeting, Epistemic Status, Rhetorical Function.

7. **Provenance Layer (Source Tracking & Synthesis)**
   - Origin Tracking, Reliability Scoring, Citation Management, Synthesis Roles.
