# Security and Privacy Questionnaire

This document addresses the [W3C Security and Privacy Self-Review Questionnaire](https://www.w3.org/TR/security-privacy-questionnaire/).

## 2.1 What information might this feature expose to Web sites or other parties, and for what purposes is that exposure necessary?

LLM Markup exposes **policy declarations** (visibility, mutability, retention rules) and **intent metadata** (semantic categories, importance levels) that content authors explicitly attach to DOM elements. This exposure is necessary to:

1. Enable LLM-infused User Agents to enforce author-specified transformation constraints
2. Allow content authors to communicate semantic context to AI assistants
3. Provide transparency about what modifications an LLM has made (provenance tracking)

The feature does **not** expose any information that isn't already visible in the DOM. It provides a structured way to annotate existing content with machine-readable policies.

## 2.2 Do features in your specification expose the minimum amount of information necessary to enable their intended uses?

Yes. The specification follows data minimization principles:

- **Policy attributes** only declare permissions, not sensitive data
- **Intent attributes** provide semantic hints without exposing private content
- **Provenance attributes** track modifications without revealing internal LLM reasoning
- The `llm-policy-input="none"` token explicitly allows hiding sensitive content from LLM context

Authors control exactly what information flows to the LLM through explicit policy declarations.

## 2.3 How do the features in your specification deal with personal information, personally-identifiable information (PII), or information derived thereof?

LLM Markup provides explicit mechanisms for **protecting PII**:

1. **`llm-policy-input="none"`**: Completely excludes content from LLM context
2. **`llm-policy-input="structure"`**: Replaces text content with `[REDACTED]` placeholder while preserving structure
3. **`llm-policy-memory="none"`**: Ensures ephemeral processing only; no retention
4. **Global Policy `block-selectors`**: Site-wide rules to automatically block PII containers (e.g., `[data-contains-pii]`)

The specification **recommends** that authors mark PII-containing elements with restrictive policies. The User Agent enforces these policies deterministically.

**Provenance citations** (`llm-provenance-citation`) may contain author names if explicitly provided, but this is author-controlled attribution, not automatic PII exposure.

## 2.4 How do the features in your specification deal with sensitive information?

Sensitive information handling is a core design goal:

- **Medical/Health content**: Authors can mark with `llm-policy-output="readonly"` to prevent modification
- **Financial data**: Can be hidden entirely with `llm-policy-input="none"`
- **Legal content**: The `llm-intent-category="legal-disclaimer"` signals "do not paraphrase"
- **Authentication tokens**: Should be in elements marked `llm-policy-input="none"`

The specification explicitly defines **security filtering** in context representation:
- Event handler attributes (`onclick`, etc.) are stripped from LLM context
- `javascript:` URLs are replaced with `[javascript]` placeholder
- Cross-origin iframe content is replaced with `[cross-origin content]`

## 2.5 Do the features in your specification introduce new state for an origin that persists across browsing sessions?

The `llm-policy-memory` attribute controls retention:

| Token | Persistence |
|-------|-------------|
| `none` (default) | No persistence; ephemeral processing only |
| `session` | Cleared when browsing session ends |
| `user` | May persist across sessions (user profile) |
| `training` | Authorizes use for model training |

**Critical**: The default is `none` (no persistence). Authors must explicitly opt into any retention. The User Agent MUST NOT persist data beyond what the policy allows.

The **Provenance Ledger** is session-scoped by default and follows the most restrictive `llm-policy-memory` value of affected elements.

## 2.6 Do the features in your specification expose information about the underlying platform to origins?

No. LLM Markup does not expose:
- Hardware capabilities
- Operating system information
- Browser version or configuration
- LLM model identity or capabilities

The specification explicitly states that token limits and model-specific behavior are "implementation details" not exposed to content.

## 2.7 Does this specification allow an origin access to sensors on a user's device?

No. LLM Markup does not interact with device sensors (camera, microphone, GPS, accelerometer, etc.).

## 2.8 What data do the features in this specification expose to an origin? Please also document what data is identical to data exposed by other features, in the same or different contexts.

**Data exposed to origins:**

1. **Provenance Ledger** (read-only): Origins can query what modifications the LLM has made within their document via `document.llmProvenanceLedger`. This is analogous to MutationObserver but filtered to LLM-initiated changes.

2. **Policy Resolution State**: `document.llmPolicyResolved` indicates when global policy is ready. This is similar to `document.readyState`.

3. **Effective Policy**: `element.llmPolicy` exposes the computed policy for an element, derived from explicit attributes and inheritance. This is similar to `getComputedStyle()` for CSS.

**No new cross-origin data exposure.** Shadow DOM boundaries are respected, and cross-origin content is not accessible.

## 2.9 Do features in this specification enable new script execution/loading mechanisms?

No. LLM Markup does not:
- Load external scripts
- Execute JavaScript
- Modify CSP or script execution policies

The `llm-policy-output="interaction"` token allows LLMs to modify event handlers on elements where explicitly permitted, but this operates within existing DOM security boundaries and requires explicit author permission.

## 2.10 Do features in this specification allow an origin to access other devices?

No. LLM Markup operates entirely within the document context and does not enable:
- Bluetooth access
- USB access
- Network device discovery
- Cross-device communication

## 2.11 Do features in this specification allow an origin some measure of control over a user agent's native UI?

No. LLM Markup does not control:
- Browser chrome
- Address bar
- Tab management
- Notification systems
- Permission prompts

The specification does require User Agents to provide **provenance inspection UI** (context menu, trust panel) but this is UA-controlled, not origin-controlled.

## 2.12 What temporary identifiers do the features in this specification create or expose to the web?

**Provenance Ledger Entry IDs**: Each ledger entry has a unique `id` for referencing. These are:
- Session-scoped (not persistent)
- Not shared across origins
- Not usable for tracking (random, non-sequential)

**Agent IDs** (`llm-provenance-operation` may include `agentId`): If the LLM provides identification, this is logged. However:
- This is optional
- It's author-facing, not user-facing
- It doesn't identify the human user

## 2.13 How does this specification distinguish between behavior in first-party and third-party contexts?

**Shadow DOM Boundaries**: Third-party components (web components) are protected by shadow DOM policy boundaries:
- By default, policies do NOT cross shadow boundaries (opt-out default)
- Component authors control their own policies (component author precedence)
- Intersection semantics ensure both parties must agree for permissions

**Cross-Origin Iframes**: Content from cross-origin iframes is replaced with `[cross-origin content]` placeholder in LLM context. The iframe's own policies apply within its context.

**Global Policy Scope**: HTTP header policies apply only to the document origin, not to embedded third-party content.

## 2.14 How do the features in this specification work in the context of a browser's Private Browsing or Incognito mode?

In Private/Incognito mode:

1. **`llm-policy-memory`** MUST be treated as `none` regardless of attribute value
2. **Provenance Ledger** MUST NOT persist beyond the private session
3. **`training` token** MUST be ignored (no training data collection)

The specification recommends that User Agents in private mode:
- Display a visual indicator that LLM memory is disabled
- Potentially disable LLM features entirely if they cannot guarantee privacy

## 2.15 Does this specification have both "Security Considerations" and "Privacy Considerations" sections?

Yes. The specification includes:

**Security Considerations:**
- Enforcement model (UA as authority, not LLM)
- Mutation validation against provenance ledger
- Event handler stripping in context representation
- JavaScript URL sanitization
- Cross-origin content isolation

**Privacy Considerations:**
- Default-deny for memory retention
- Explicit opt-in for data persistence
- PII protection mechanisms
- Private browsing mode behavior
- Provenance transparency for user inspection

## 2.16 Do features in your specification enable origins to downgrade default security protections?

No. LLM Markup **cannot** weaken existing security:

- **CSP is unaffected**: LLM Markup does not modify Content Security Policy
- **Same-origin policy respected**: Cross-origin data remains inaccessible
- **Permissions unchanged**: LLM Markup doesn't grant camera, location, etc.

The `llm-policy-output="mutable"` allows LLM modifications but:
- This is explicit author opt-in
- User Agents MAY require user confirmation for sensitive mutations
- Provenance tracking provides accountability

**License constraints cannot be overridden**: If content has `llm-policy-license="CC-BY-ND"`, explicit `llm-policy-output="mutable"` is intersected down to `readonly, annotation`.

## 2.17 How does your feature handle non-"fully active" documents?

LLM Markup follows standard document lifecycle:

- **Background tabs**: LLM interactions SHOULD be paused
- **bfcache**: Provenance ledger state is preserved with the document
- **Prerendering**: LLM mutations SHOULD NOT occur until activation

The `document.llmPolicyResolved` state is preserved across bfcache navigation.

## 2.18 What should this questionnaire have asked?

Additional considerations specific to LLM-infused UAs:

**Q: How does this specification prevent prompt injection attacks?**

A: The specification separates **policy** (hard constraints enforced by UA) from **intent** (soft guidance to LLM). Malicious content cannot override policies through prompt injection because:
1. Policies are parsed deterministically by the UA, not interpreted by the LLM
2. The LLM never sees policy attributes in its context (they're enforcement metadata)
3. License constraints are enforced at the UA level

**Q: How does this specification handle AI-generated content attribution?**

A: The `llm-provenance-operation` attribute and Provenance Ledger provide mandatory audit trails:
1. Every LLM mutation MUST be logged with explanation
2. Users can inspect what was changed via UA-provided UI
3. Integrity violations (changes without provenance) are detected and flagged

**Q: What happens if the LLM attempts unauthorized modifications?**

A: The User Agent is the enforcement authority:
1. Mutations are validated against `llm-policy-output` before application
2. Unauthorized mutations are blocked, reverted, or flagged
3. Integrity violations trigger `llmintegrityviolation` events
4. The specification defines `flag`, `warn`, `block`, `revert`, and `report` response actions
