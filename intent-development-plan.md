# Intent Namespace Development Plan

The goal of the `llm-intent` namespace is to enable the **Deterministic Construction of Context** for the LLM. The User Agent acts as a "Prompt Compiler," translating these attributes into a structured System Prompt or Context Object that guides the LLM's understanding and behavior.

This plan outlines the development of standard vocabulary and mechanisms for the Intent Namespace.

## Phase 1: Semantic & Content Modeling (The "What")
*Focus: Disambiguating the meaning and importance of content blocks.*

1.  **Standardize `llm-intent-category` Behavior (Open Taxonomy):**
    *   **Goal:** Allow developers to use arbitrary semantic labels while ensuring predictable prompt construction.
    *   **Mechanism:**
        *   **Standardized Lexicon:** A comprehensive list of common terms (e.g., `summary`, `critique`, `legal-disclaimer`) with highly optimized, pre-defined prompts. See `namespaces/intent/lexicon.md`.
        *   **Custom Categories:** Any unknown string is treated as a custom label and wrapped in a standard template: `[Category]: [Content]` or `Treat the following content as a(n) [category].`
    *   **Prompt Effect:**
        *   *Standard:* `summary` -> "Provide a condensed, high-level overview of the following content..."
        *   *Custom:* `medical-symptom` -> "Treat the following content as a(n) medical-symptom."

2.  **Introduce `llm-intent-importance` (Topology Layer):**
    *   **Goal:** Provide a weighting mechanism for content prioritization.
    *   **Prompt Effects (Deterministic Mapping):**
        *   `critical`: "Pay maximum attention to the following content. It is essential for the user's task."
        *   `high`: "Prioritize this content."
        *   `normal`: (No instruction added).
        *   `low`: "This content is supplementary. You may ignore it if context is limited."
        *   `background`: "This is background information only. Do not focus on it unless explicitly asked."

3.  **Introduce `llm-intent-entity` (Data Layer):**
    *   **Goal:** Link content to specific real-world entities for disambiguation.
    *   **Value:** URI (e.g., Wikidata ID, Schema.org URL).
    *   **Prompt Template:** `[Content] (Entity Reference: [URI])`
    *   **Example:** `Apple (Entity Reference: https://www.wikidata.org/wiki/Q312)` anchors the text to "Apple Inc." without ambiguity.

4.  **Introduce `llm-intent-instruction` (Direct Prompting):**
    *   **Goal:** Allow developers to provide explicit, free-form instructions to the LLM for specific nodes, bypassing the standard templates.
    *   **Value:** Free-form string.
    *   **Prompt Effect:** The User Agent uses this string *instead of* the default templates for `llm-intent-category`, `llm-intent-function`, and `llm-intent-tone`.
    *   **Policy Interaction:** This attribute **does not erase** the underlying category or function. The semantic identity (e.g., `category="advertisement"`) is preserved for Global Policy routing. If a policy blocks the node, the instruction is ignored.
    *   **Constraint:** This attribute operates strictly at the *Prompt Construction* layer and cannot bypass *Policy Enforcement* (which happens upstream).
    *   **Example:** `<div llm-intent-category="advertisement" llm-intent-instruction="Summarize this product">...</div>` (If policy allows ads, this custom instruction is used).

## Phase 2: Interaction & Workflow (The "How")
*Focus: Guiding the agent through tasks and user interactions.*

1.  **Introduce `llm-intent-function` (Interaction Layer):**
    *   **Goal:** Define the purpose of interactive elements beyond their accessible name.
    *   **Proposed Values:** `search`, `submit`, `cancel`, `navigation`, `purchase`, `login`.
    *   **Prompt Effect:** "The user's goal with this button is to Search."

2.  **Introduce `llm-intent-workflow` (Structure Layer):**
    *   **Goal:** Define sequences and dependencies for multi-step processes.
    *   **Proposed Values:** `step`, `prerequisite`, `result`, `error-state`.
    *   **Prompt Effect:** "This is Step 1 of 3. Do not proceed to Step 2 until Step 1 is complete."

## Phase 3: Output Shaping & Persona (The "Response")
*Focus: Controlling the style, format, and tone of the LLM's response.*

1.  **Introduce `llm-intent-output` (Presentation/Data Layer):**
    *   **Goal:** Specify the desired format of the LLM's generation.
    *   **Proposed Values:** `concise`, `detailed`, `json`, `markdown`, `table`, `code`.
    *   **Prompt Effect:** "Format your response as JSON."

2.  **Introduce `llm-intent-tone` (Semantic Layer):**
    *   **Goal:** Define the persona or tone the LLM should adopt.
    *   **Proposed Values:** `formal`, `casual`, `educational`, `empathetic`, `neutral`.
    *   **Prompt Effect:** "Adopt an educational tone."
