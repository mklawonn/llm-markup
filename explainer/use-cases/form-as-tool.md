# Use Case: Form as Composite Tool

## Scenario
A travel booking site presents a multi-field flight search form. A user asks their browser agent: *"Find me a round-trip flight from SFO to Tokyo, departing next Friday, returning the following Sunday, economy class."*

The form contains:
- Text inputs for origin and destination (with autocomplete dropdowns)
- Date pickers for departure and return
- A radio group for cabin class (Economy / Business / First)
- A "Search Flights" button

The agent must fill in five fields and submit the form — a multi-step interaction involving both `data` mutations (setting field values) and an `interaction` invocation (clicking search). Without guidance, the LLM must infer field purposes from labels, reconstruct the correct interaction sequence, and guess which submit action to trigger.

## The Problem
WAM's existing tools handle this case mechanically: `wam_set_data` can populate each input, and `wam_invoke` can trigger the search button. However, the LLM discovers these as **independent per-element tools** via the Mutable Element Manifest. For a simple form this works well — the LLM reads the labels, fills the fields, and clicks the button.

For complex forms, this breaks down:
- **Dependent fields**: Selecting "Round Trip" reveals the return date picker; the LLM must interact in sequence.
- **Validation constraints**: The destination must differ from the origin; dates must be in the future; these constraints exist in JavaScript and server-side validation, not in the HTML attributes alone.
- **Composite semantics**: The form's purpose as a single "search flights" operation is implicit. The LLM must infer it from context rather than receiving a structured tool definition.
- **Ambiguity**: A page might contain multiple forms (flight search, newsletter signup, feedback). The LLM must determine which form achieves the user's goal.

## The Solution: Tool Intent with Schema Reference

The site author provides an advisory tool schema that describes the form as a single composite operation, using a hypothetical `wam-intent-tool-schema` attribute alongside existing WAM attributes.

### Markup

```html
<form id="flight-search"
      wam-policy-output="data interaction"
      wam-intent-function="search"
      wam-intent-category="instruction"
      wam-intent-tool-schema="#flight-search-tool">

  <label for="origin">From</label>
  <input id="origin" name="origin" type="text" required
         placeholder="Airport code (e.g. SFO)">

  <label for="destination">To</label>
  <input id="destination" name="destination" type="text" required
         placeholder="Airport code (e.g. NRT)">

  <fieldset>
    <legend>Trip Type</legend>
    <label><input type="radio" name="trip" value="roundtrip" checked> Round Trip</label>
    <label><input type="radio" name="trip" value="oneway"> One Way</label>
  </fieldset>

  <label for="depart">Departure</label>
  <input id="depart" name="depart" type="date" required>

  <label for="return">Return</label>
  <input id="return" name="return" type="date">

  <fieldset>
    <legend>Cabin Class</legend>
    <label><input type="radio" name="cabin" value="economy" checked> Economy</label>
    <label><input type="radio" name="cabin" value="business"> Business</label>
    <label><input type="radio" name="cabin" value="first"> First</label>
  </fieldset>

  <button type="submit"
          wam-intent-function="search">Search Flights</button>

  <script type="application/wam-tool+json" id="flight-search-tool">
  {
    "name": "search_flights",
    "description": "Search for available flights between two airports.",
    "parameters": {
      "origin": {
        "type": "string",
        "description": "Departure airport (IATA code, e.g. 'SFO')"
      },
      "destination": {
        "type": "string",
        "description": "Arrival airport (IATA code, e.g. 'NRT')"
      },
      "trip": {
        "type": "string",
        "enum": ["roundtrip", "oneway"],
        "description": "Round trip or one way"
      },
      "depart": {
        "type": "string",
        "format": "date",
        "description": "Departure date (YYYY-MM-DD)"
      },
      "return": {
        "type": "string",
        "format": "date",
        "description": "Return date (YYYY-MM-DD). Required if trip is 'roundtrip'."
      },
      "cabin": {
        "type": "string",
        "enum": ["economy", "business", "first"],
        "description": "Cabin class"
      }
    },
    "required": ["origin", "destination", "trip", "depart"]
  }
  </script>
</form>
```

### How the User Agent Processes This

The tool schema is **advisory intent**, not a policy gate. The UA processes it as follows:

1. **Discovery**: During `wam_build_context`, the UA encounters the `wam-intent-tool-schema` attribute and resolves the referenced `<script type="application/wam-tool+json">` block.
2. **Manifest enrichment**: The Mutable Element Manifest entry for `#flight-search` includes the tool schema alongside the standard `available_tools`, `intent`, and `provenance` fields. The individual field-level entries (`wam_set_data` for each input, `wam_invoke` for the button) remain present as before.
3. **LLM context**: The orchestrating LLM receives both the composite tool description ("search_flights" with typed parameters) and the individual per-element tools. It may choose to use either interface.
4. **Execution**: If the LLM uses the composite tool description, the UA decomposes the call into individual `wam_set_data` and `wam_invoke` operations, each subject to normal Gate → Execute → Record → Commit processing.

### Outcome

The user asks: *"Find me a round-trip flight from SFO to Tokyo, departing next Friday, returning the following Sunday, economy class."*

1. The LLM consults the Mutable Element Manifest and sees the `search_flights` tool schema with typed parameters and descriptions.
2. It maps the user's natural language to structured parameters: `origin="SFO"`, `destination="NRT"`, `trip="roundtrip"`, `depart="2025-07-11"`, `return="2025-07-13"`, `cabin="economy"`.
3. The UA sets each form field via `wam_set_data` and triggers the submit via `wam_invoke`, all under normal WAM policy enforcement.
4. Provenance is recorded for each mutation.

### What the Tool Schema Does NOT Do

- **It does not bypass policy.** The `data` and `interaction` output tokens are still required. If the form were `readonly`, the tool schema would be visible in the manifest but no mutation tools would be offered.
- **It does not guarantee correctness.** Server-side validation may reject the submission (e.g., invalid airport code, past date). The schema is guidance for the LLM, not a contract with the server.
- **It does not authorize action.** A conforming UA may still require user confirmation before submitting the form, particularly if the interaction involves a financial transaction, authentication, or personal data. The schema describes *what* the tool does, not *whether* the UA should auto-execute it.

## Comparison: With and Without Tool Schema

| Aspect | Without schema | With schema |
| :--- | :--- | :--- |
| Field discovery | LLM reads labels and `name` attributes | LLM receives typed parameter descriptions |
| Constraints | Inferred from `type`, `required`, `pattern` | Explicitly described (e.g., "Required if trip is roundtrip") |
| Composite semantics | Implicit — LLM infers "this is a flight search" | Explicit — `"name": "search_flights"` |
| Multi-form disambiguation | LLM must compare forms and guess | Each form has a named, described tool identity |
| Dependent fields | LLM must discover through trial and interaction | Schema documents the dependency |
| Execution | Multiple individual tool calls | Same individual calls, but LLM can plan them as a batch |
