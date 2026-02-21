# Use Case: Highlighting Legal Text without Alteration

## Scenario
A legal database publishes contract clauses. Lawyers need to highlight key phrases (e.g., "termination for cause") and add comments or cross-references.
Crucially, the legal text itself **must not be altered by even a single character**, as this could change the meaning of the contract.

## The Problem
If the policy is `mutable`, an LLM attempting to "highlight" a phrase might rewrite the surrounding sentence to improve flow or grammar, inadvertently changing the legal meaning.
If the policy is `readonly`, the LLM cannot inject the `<mark>` or `<span>` elements needed for highlighting.

## The Solution: Annotation Policy
The database tags the contract body with `wam-policy-output="annotation"`.

### Policy Definition
*   **Target:** `<div class="contract-clause">`
*   **Policy:** `annotation`

### Outcome
The user asks: *"Highlight all mentions of 'Force Majeure' in yellow."*

1.  **Allowed:** The Agent splits the text node containing "Force Majeure" and wraps it in `<mark style="background: yellow">Force Majeure</mark>`.
2.  **Allowed:** The Agent wraps a confusing sentence in a `<span class="comment-anchor" data-comment-id="123">` to attach a side-note.
3.  **Blocked:** The Agent attempts to fix a typo in the contract ("teh" -> "the"). The Browser Agent detects that the concatenated `textContent` has changed and **rejects** the mutation.

The result is a strictly preserved legal document with rich, user-requested annotations.
