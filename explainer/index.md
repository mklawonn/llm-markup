# Explainer: Web Agent Markup (WAM)

## Status

This document is the non-normative explainer for the Web Agent Markup specification. For the formal standard, see [spec/index.bs](../spec/index.bs).

## Problem Statement

As LLMs become integrated into web browsers and user agents, there is no standardized way for content authors to:

1. **Control visibility**: Specify what content an LLM can "see" in its context window
2. **Control mutations**: Define what changes an LLM is permitted to make
3. **Control retention**: Declare data privacy and storage rules
4. **Provide semantics**: Guide how content should be interpreted
5. **Track provenance**: Maintain accountability for AI-generated modifications

Without such standards, LLM-infused browsers face a dilemma:
- **Too permissive**: LLMs might expose sensitive data or make unauthorized changes
- **Too restrictive**: LLMs cannot provide useful assistance with web content
- **Inconsistent**: Different implementations handle the same content differently

**Note on Enforcement:** Like `robots.txt`, Web Agent Markup is a cooperative standard that relies on **User Agent compliance**. It is not a cryptographic security measure or a legal enforcement tool. While a conforming User Agent (like a major browser) will strictly and mechanistically enforce these policies, a non-compliant or "rogue" agent could theoretically ignore them. This standard is designed to govern interactions within trusted, compliant software environments.

## Solution: A Declarative Contract

Web Agent Markup provides a declarative contract layer that sits on top of existing HTML. It uses three orthogonal namespaces to address different concerns:

### 1. WAM-Policy (Access & Permissions)

Policy attributes define the **hard boundaries** of the interaction. The User Agent enforces these by **redacting content** from the context window (Input Policy) and ensuring the LLM is **never prompted to mutate** restricted sections (Output Policy). Immutable content passes through the interaction layer unaltered, with the UA acting as a mechanistic barrier to unauthorized changes.

```html
<!-- Visibility Control -->
<div wam-policy-input="none">         <!-- Hidden entirely -->
<div wam-policy-input="structure">    <!-- Tags visible, text redacted -->
<div wam-policy-input="structure text"> <!-- Tags and text, no custom attributes -->
<div wam-policy-input="all">          <!-- Everything visible (default) -->

<!-- Mutation Control -->
<div wam-policy-output="readonly">    <!-- No changes allowed (default) -->
<div wam-policy-output="style">       <!-- Can change class/style only -->
<div wam-policy-output="annotation">  <!-- Can wrap text, not change it -->
<div wam-policy-output="content">     <!-- Can edit text content -->
<div wam-policy-output="mutable">     <!-- Full modification allowed -->

<!-- Retention Control -->
<div wam-policy-memory="none">        <!-- Ephemeral only (default) -->
<div wam-policy-memory="session">     <!-- Session-scoped retention -->
<div wam-policy-memory="user">        <!-- User profile storage -->
<div wam-policy-memory="training">    <!-- Training data authorized -->
```

### 2. WAM-Intent (Prompt Construction)

Intent attributes govern the **deterministic construction of prompts**. The User Agent translates these semantic markers into the framing and instructions seen by the LLM. While mechanistic in its generation, the Intent namespace controls the *context and direction* of the model without redacting content or directly enforcing mutation permissions.

```html
<!-- Semantic Categories -->
<div wam-intent-category="summary">       <!-- Condensed content -->
<div wam-intent-category="legal-disclaimer"> <!-- Do not paraphrase -->
<div wam-intent-category="code-block">    <!-- Preserve formatting -->
<div wam-intent-category="satire">        <!-- Do not interpret literally -->

<!-- Importance Levels -->
<div wam-intent-importance="critical">    <!-- Must preserve if truncating -->
<div wam-intent-importance="background">  <!-- Ignore unless asked -->

<!-- Entity References -->
<span wam-intent-entity="https://wikidata.org/wiki/Q5">Albert Einstein</span>

<!-- Custom Instructions -->
<div wam-intent-instruction="Translate to plain English">
```

### 3. WAM-Provenance (Audit Trail)

Provenance attributes serve as a **dynamic ledger** for the content. They track not only the original source of information but also **record every mutation applied by the LLM**. When an LLM modifies content (e.g., summarizing text, highlighting warnings), the User Agent automatically appends these operations to the provenance history, ensuring full accountability for AI-generated changes.

```html
<!-- Source Attribution -->
<p wam-provenance-source="https://example.com/article"
   wam-provenance-citation="Smith, 2024">

<!-- Confidence Levels -->
<p wam-provenance-confidence="0.95">High-confidence fact</p>
<p wam-provenance-confidence="0.3">Speculative interpretation</p>

<!-- Modification History (Auto-generated by UA) -->
<p wam-provenance-operation="content:summarized style:highlighted">
```

#### Multi-hop & Nested Provenance

The standard handles "chains of custody" (e.g., a summary of a summary) through **node-scoped attribution**:

- **Node Isolation**: Provenance attributes are local to the node they describe. If an LLM-generated summary is embedded within another document, it retains its own `wam-provenance-*` attributes.
- **The Source Chain**: The `wam-provenance-source` attribute links back to the immediate upstream authority. In a multi-hop scenario (Browser -> Gemini -> Original Site), the Gemini-generated fragment points to the Original Site, while the Browser-level summary points to the Gemini-generated URI.
- **Cumulative Operations**: The `wam-provenance-operation` attribute is a space-separated list. As content moves through multiple LLM "hops," each agent appends its rationale to the existing ledger, creating a persistent audit trail.

#### Integrity & Persistence

To ensure trust, the User Agent enforces strict integrity rules on provenance data:

1.  **Baseline Trust**: Provenance tags served with the initial document are treated as the "original state." The User Agent trusts these as the starting point of the ledger.
2.  **Append-Only History**: The User Agent ensures that new operations are **appended** to the history, never overwriting or deleting existing entries.
3.  **Tamper Protection**: The User Agent maintains an internal, parallel ledger of all LLM-initiated changes. If a page script attempts to modify or delete `wam-provenance` attributes to hide AI involvement, the User Agent detects the mismatch and **restores the correct attributes**, ensuring the audit trail remains immutable for the duration of the session.

## Key Design Principles

### 1. User Agent as Authority

The conforming entity is the **User Agent (browser)**, not the LLM. This is crucial because:

- LLMs are probabilistic and may not follow instructions reliably
- Security cannot depend on LLM compliance
- Deterministic enforcement is auditable and testable

The UA intercepts all LLM interactions and enforces policies mechanistically.

### 2. Secure Defaults

- **Input**: `all` (visible by default, authors opt-out)
- **Output**: `readonly` (immutable by default, authors opt-in to mutations)
- **Memory**: `none` (ephemeral by default, authors opt-in to retention)

This follows the principle of least privilege for mutations and data retention.

### 3. Intersection Semantics

When multiple authoritative policies apply (e.g., global constraints, licenses, or explicit inheritance), the effective policy is the **intersection** of all applicable rules. Both parties must agree for a permission to be granted.

*Note: This differs from Global Defaults, which act as fallbacks and follow override semantics. For a full breakdown, see [Precedence Logic](#precedence-logic).*

### 4. Graceful Degradation

Web Agent Markup attributes are ignored by browsers that don't support them. Content remains functional and accessible without LLM features.

## Global Policy

In addition to element-level attributes, authors can define document-wide policies via HTTP headers or meta tags:

```http
WAM-Policy: {
  "defaults": {
    "wam-policy-input": ["structure", "text"],
    "wam-policy-output": ["readonly"],
    "wam-policy-memory": ["none"]
  },
  "constraints": {
    "block-selectors": [".pii", "[data-sensitive]"],
    "category-rules": {
      "advertisement": {"wam-policy-input": ["none"]}
    }
  },
  "report-to": "https://api.example.com/llm-reports"
}
```

**Precedence**: HTTP Header > Meta Tag > Element Attributes > Defaults

### Precedence Logic

The Global Policy supports two distinct mechanisms with different precedence rules:

1.  **Constraints (Intersection Semantics):** Rules defined in `constraints` (e.g., `block-selectors`, `category-rules`) form a hard ceiling. They **cannot be overridden** by local attributes. The effective policy is the intersection of the constraint and the local attribute.
    *   *Example:* If a global constraint blocks PII, a local `wam-policy-input="all"` attribute is ignored.

2.  **Defaults (Override Semantics):** Rules defined in `defaults` act as fallbacks for elements without explicit attributes. They **can be overridden** by local attributes.
    *   *Example:* If the global default is `readonly`, a local `wam-policy-output="mutable"` attribute takes precedence.

**Hierarchy:** Global Constraints > Local Attributes > Global Defaults > Specification Defaults.

## Shadow DOM Boundaries

Web components with Shadow DOM create **policy boundaries**:

- By default, policies do NOT cross shadow boundaries (opt-out)
- Component authors can opt-in to inheritance
- Intersection semantics ensure mutual agreement
- Component authors have precedence within their shadow trees

```javascript
this.attachShadow({
  mode: 'open',
  wamPolicyInherit: true,  // Opt-in to page policies
  wamProvenanceTransparent: true  // Report full provenance to document
});
```

## License Enforcement

Content licenses are enforced via the License Compatibility Matrix:

```html
<!-- CC-BY-ND restricts to readonly + annotation -->
<article wam-policy-license="CC-BY-ND-4.0">
  <!-- Even with wam-policy-output="mutable", effective is readonly -->
</article>
```

Supported licenses include Creative Commons family, open source licenses (MIT, Apache, GPL), and proprietary markers.

## Use Cases

See the [use-cases/](./use-cases/) directory for detailed scenarios:

- **News Article**: Protecting quotes, allowing summaries
- **E-commerce**: Product data editable, prices readonly
- **Legal Document**: Highlighting allowed, text immutable
- **Educational**: Interactive examples, explanations appendable
- **Medical**: Strict readonly for safety-critical information
- **User-Generated Content**: Moderation policies
- **Form as Composite Tool**: Describing a multi-field form as a single MCP-style tool for LLM interaction ([use case](./use-cases/form-as-tool.md))

## Relationship to Other Standards

| Standard | Relationship |
|----------|--------------|
| ARIA | Complementary - ARIA for accessibility, WAM for AI |
| CSP | Orthogonal - CSP for script security, WAM for AI permissions |
| robots.txt | Different scope - robots.txt for crawlers, WAM for in-page AI |
| RDFa/JSON-LD | Complementary - structured data + AI policies |
| MCP (Model Context Protocol) | Complementary - WAM defines policy constraints; MCP can serve as the runtime interface through which a conforming UA exposes those constraints to the LLM. See below. |

### Relationship to MCP

[Model Context Protocol (MCP)](https://modelcontextprotocol.io) is an open protocol for connecting LLM applications to external tools and data sources. WAM and MCP are complementary and operate at different layers of the stack.

WAM is a *content annotation standard*: it provides a declarative vocabulary for web page authors to express access policy, semantic intent, and provenance at the level of HTML elements. MCP is an *infrastructure protocol*: it defines how an LLM application discovers and invokes tools and resources provided by servers.

A conforming User Agent may implement its DOM interaction layer as an internal MCP server, exposing tools such as `read_element` and `mutate_element` that enforce WAM policy before executing. In this architecture, the LLM interacts with the page exclusively through MCP tool calls; the UA's MCP server is the policy enforcement point that consults `wam-policy-input` and `wam-policy-output` attributes before returning content or applying mutations. The WAM-filtered context window can likewise be delivered as an MCP Resource.

```
LLM ←→ MCP Client (inside UA) ←→ DOM-access MCP Server (inside UA)
                                         ↓ checks WAM policy
                                    HTML DOM
```

MCP does not address — and cannot substitute for — WAM's element-level mutation granularity, input visibility controls, content retention policy, license enforcement, or provenance tracking. These remain the domain of this standard.

### Tool Intent Schemas (Exploratory)

Beyond the runtime interface described above, content authors may want to describe interactive surfaces — forms, wizards, stateful widgets — as composite MCP-style tools with named, typed parameters. This would allow LLMs to understand a multi-field form as a single "search flights" or "complete purchase" operation rather than a collection of independent inputs.

This idea is explored in a non-normative appendix: **[MCP Tool Intent](./tool-intent.md)**. The appendix covers advisory tool schemas as intent attributes, the trust asymmetry between site-authored and user-configured tools, adversarial considerations, and User Agent design guidance. A worked example is provided in the [Form as Composite Tool](./use-cases/form-as-tool.md) use case.

## FAQ

**Q: Does this give LLMs permission to scrape my content?**

A: No. Web Agent Markup governs how an LLM-infused UA interacts with content the user is already viewing. It does not affect crawling or training data collection, which are separate concerns.

**Q: What if the LLM ignores the policies?**

A: In a compliant User Agent, the LLM cannot ignore policies because the UA enforces them mechanistically before the LLM sees the content. However, like `robots.txt`, this is a cooperative standard and does not provide cryptographic or legal enforcement. While compliant agents will strictly adhere to the contract, a "rogue" or non-compliant agent could theoretically ignore the attributes.

**Q: Can malicious content use this to attack the LLM?**

A: Policies are parsed deterministically by the UA, not interpreted by the LLM. The LLM never sees policy attributes, only filtered content.

**Q: Is this backward compatible?**

A: Yes. Browsers that don't support Web Agent Markup ignore the attributes. Content remains functional.

## Next Steps

1. Review the [formal specification](../spec/index.bs)
2. Explore the [examples](../examples/)
3. Run the [conformance tests](../tests/web-platform-tests/)
4. Review the [Security & Privacy questionnaire](./security-privacy.md)
5. Read the [MCP Tool Intent appendix](./tool-intent.md) for exploratory work on composite tool schemas
