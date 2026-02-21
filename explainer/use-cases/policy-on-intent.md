# Use Case: Enforcing Immutable Quotes via Intent

## Scenario
*The Historical Archives* publishes digital transcripts of famous speeches. The curators want to ensure that while users can ask an LLM to summarize, translate, or analyze the speeches, the **original text of the quotes** must remain strictly verbatim. They are concerned that "rewrite" or "simplify" commands might accidentally alter the historical record.

## The Strategy: Policy via Intent
The site designers cannot predict every possible CSS class or ID their legacy CMS might generate, but they can easily tag the semantic nature of the content using `wam-intent-category`.

### 1. Semantic Tagging (The "What")
The HTML is marked up with intent categories:

```html
<div wam-intent-category="historical-quote">
  "Four score and seven years ago..."
</div>
<div wam-intent-category="commentary">
  Lincoln refers here to the signing of the Declaration of Independence...
</div>
```

### 2. Global Policy Enforcement (The "Rule")
The server sends a Global Policy Header that maps the `historical-quote` category to a strict read-only policy.

```json
{
  "constraints": {
    "category-rules": {
      "historical-quote": {
        "wam-policy-output": ["readonly"]
      },
      "commentary": {
        "wam-policy-output": ["mutable"]
      }
    }
  }
}
```

## Outcome
A user asks their browser agent: *"Rewrite this entire page in modern English."*

1.  **Commentary:** The agent successfully rewrites the commentary sections (marked `mutable` by default or explicitly).
2.  **Quotes:** When the agent attempts to rewrite the text inside `wam-intent-category="historical-quote"`, the browser **enforces the `readonly` policy**.
3.  **Result:** The browser rejects the mutation for those specific nodes. The final output is a hybrid: modern commentary interspersed with the original, untouched historical text.

This demonstrates how `wam-intent-category` provides a stable hook for policy enforcement that is decoupled from visual presentation (CSS) and robust against styling changes.
