# Use Case: News Provenance and Contextual Integrity

## Scenario
Alice uses an LLM-infused browser to read a controversial news article on *The Daily Chronicle*. She asks her browser agent, "Summarize the accusations made against the mayor."

The article contains a pull quote: *"The funds were misappropriated,"* which is visually distinct. However, immediately following it is the crucial context: *"...claimed the opposition leader, though no evidence was provided."*

## The Problem
Without strict constraints, an LLM might extract the pull quote *"The funds were misappropriated"* and present it to Alice as a verified fact or a general consensus, stripping it of the necessary attribution ("claimed the opposition leader") and the disclaimer ("though no evidence was provided"). This creates misinformation through decontextualization.

## The Solution: Global Dependency Constraints
The publisher, *The Daily Chronicle*, wants to ensure that any extraction of the pull quote MUST be accompanied by its attribution and context.

They implement a **Global Policy Header** with a `dependency` constraint.

### Policy Definition
*   **Trigger:** Elements matching `.pull-quote`.
*   **Requirement:** Must be accompanied by the adjacent element matching `.attribution-context`.
*   **Scope:** `input` (The LLM cannot "see" the quote without also "seeing" the context).

### Outcome
When the browser agent processes the page for the summary:
1.  It identifies the `.pull-quote`.
2.  The Global Policy enforces that the `.attribution-context` must be included in the context window.
3.  If the `.attribution-context` cannot be included (e.g., token limits), the `.pull-quote` is also withheld to prevent misleading the user.
4.  Alice receives a summary that correctly attributes the claim or omits it entirely, maintaining journalistic integrity.
