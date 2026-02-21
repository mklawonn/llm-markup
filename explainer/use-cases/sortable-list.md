# Use Case: Reordering a List of Search Results

## Scenario
A job search website displays a list of open positions. The user wants to see them sorted by "Salary" instead of the default "Date Posted."
The server sends the initial list in a static order, but allows client-side reordering.

## The Problem
If the policy is `mutable`, an LLM might attempt to rewrite the job descriptions while sorting them, potentially hallucinating salary figures or altering the job requirements.
If the policy is `readonly`, the LLM cannot change the order of the `<li>` elements.

## The Solution: Layout Policy
The website tags the list container with `wam-policy-output="layout"`.

### Policy Definition
*   **Target:** `<ul id="job-list">`
*   **Policy:** `layout`

### Outcome
The user asks: *"Sort these jobs by highest salary first."*

1.  **Allowed:** The Agent parses the salary from each `<li>` and reorders the DOM nodes based on that value.
2.  **Blocked:** The Agent attempts to rewrite a job title from "Senior Engineer" to "Lead Engineer" to make it look more appealing. The Browser Agent enforces the policy and **rejects** this mutation because it changes the content of a child node.

The result is a sorted list with strictly identical content to the original.
