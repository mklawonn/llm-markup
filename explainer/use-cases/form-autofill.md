# Use Case: Secure Form Autofill

## Scenario
A user is completing a checkout form on an e-commerce site. They ask their browser agent: *"Fill in my shipping address from my profile."*

The form contains fields for "City," "State," and "Zip." It also has a "Subscribe to Newsletter" checkbox and a "Confirm Purchase" button.
Crucially, the site's design (labels, layout, button text) must not be altered, as this could confuse the user or break the checkout flow.

## The Problem
If the policy is `interaction` (or `interaction-only` in older drafts), the agent might be able to toggle the checkbox but is arguably blocked from setting the text `value` of the inputs (as this is "Content Payload").
If the policy is `content`, the agent could rewrite the `<label>` text ("City" -> "Town"), which is forbidden.

## The Solution: Data Policy
The site tags the form container with `llm-policy-output="data"`.

### Policy Definition
*   **Target:** `<form id="checkout-form">`
*   **Policy:** `data`

### Outcome
The user asks: *"Fill in my address."*

1.  **Allowed:** The Agent sets the `value` attribute of `<input name="city">` to "San Francisco".
2.  **Allowed:** The Agent sets the `value` of `<input name="zip">` to "94105".
3.  **Blocked:** The Agent attempts to change the "Confirm Purchase" button text to "Buy Now". The Browser Agent enforces the policy and **rejects** this mutation because `data` permission does not grant access to Text Nodes.
4.  **Blocked:** The Agent attempts to check the "Subscribe to Newsletter" box. This requires `interaction` permission. (If the site wanted both, they would use `llm-policy-output="data interaction"`).

The result is a form that is correctly populated with user data but structurally and textually identical to the original design.
