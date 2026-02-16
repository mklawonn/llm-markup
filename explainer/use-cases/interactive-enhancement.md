# Use Case: Interactive Enhancement without Content Modification

## Scenario
A government agency publishes a static SVG map of election districts. The map contains precise geographic path data and labels (the content) that must not be altered to ensuring legal accuracy.

However, the agency wants users to be able to ask their browser agent to "make this map interactive" so they can hover over districts to see data tooltips or click to zoom.

## The Problem
If the policy is `mutable`, an LLM might accidentally simplify the complex SVG paths while adding the interactivity, rendering the map legally inaccurate.
If the policy is `readonly`, the LLM cannot add the necessary event listeners or script tags.

## The Solution: Interaction-Only Policy
The agency tags the SVG container with `llm-policy-output="interaction-only"`.

### Policy Definition
*   **Target:** `<svg id="election-map">`
*   **Policy:** `interaction-only`

### Outcome
The user asks: *"Add a hover effect that shows the district name."*

1.  **Allowed:** The Agent injects a `<script>` tag with event listeners for `mouseover` and `mouseout` on the district paths.
2.  **Allowed:** The Agent adds `data-tooltip` attributes to the path elements (as this supports the interaction without changing the rendered text content).
3.  **Blocked:** The Agent attempts to "optimize" the SVG paths to reduce file size. The Browser Agent enforces the policy and **rejects** this mutation because it alters the Structure/Content layer of the non-script elements.

The result is a map that is functionally enhanced but cartographically identical to the original.
