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
- **Cryptographically signable**
- **Composable with HTML5**
- **Ignorable by legacy browsers**

### Behavioral Analogies
It behaves like:
- **ARIA (semantic overlay):** Provides a semantic layer.
- **CSP (policy declaration):** Declares governance rules.
- **RDFa (metadata layer):** Functions as a metadata layer.

However, it is specialized specifically for LLM transformation control.

## III. The LLMPM Namespaces

The markup is composed of exactly three orthogonal namespaces, each treated differently by the User Agent:

### 1. LLM-Policy (Hard Constraints - Browser Enforced)
These constraints MUST be mechanistically enforced by the User Agent. The UA acts as a guardrail, physically preventing the LLM from violating these rules (e.g., by withholding data, blocking write access, or discarding non-compliant generations).
- `immutable`
- `allowed-actions`
- `forbidden-actions`
- `license`
- `regulatory`
- `integrity-hash`
- `require-attribution`
- `require-diff`

### 2. LLM-Intent (Soft Constraints - Deterministic Context Construction)
These constraints guide optimization. The User Agent's responsibility is to **deterministically parse** these attributes and construct a predictable context or system prompt for the LLM.
- **Deterministic Parsing:** The UA MUST map `<div llm-intent="summarize">` to a standardized context object (e.g., `{"role": "summary_target", "id": "..."}`) in a predictable way.
- **Probabilistic Execution:** While the input signal provided by the UA is deterministic, the LLM's generation based on that signal remains probabilistic.

Common Intents:
- `type`
- `audience`
- `rhetorical-role`
- `domain`
- `priority`
- `tone`
- `reading-level`

### 3. LLM-Provenance (Audit Metadata)
This metadata is used for tracking and audit purposes.
- `author`
- `signature`
- `model-origin`
- `transformation-history`
- `timestamp`

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

7. **Provenance Layer (Authorship & Authority)**
   - Authorship, Licensing, Integrity, Regulatory Classification.
