# Use Case: License Enforcement and Code Contamination

## Scenario
A software developer, Bob, is building a proprietary, closed-source application for his employer. He is using an LLM-integrated IDE that can fetch code snippets from the web and integrate them directly into his project.

He finds a perfect implementation of a complex algorithm on a tutorial site. He asks his agent: *"Adapt this function and add it to my `utils.js` file."*

## The Conflict
The code snippet on the website is licensed under **GPL-3.0**.
Bob's project is configured as **Proprietary / Closed Source**.

If the agent were to blindly copy and adapt the code, Bob's entire proprietary application could become legally "contaminated" by the copyleft license, forcing his company to release their source code.

## The Solution: Policy Macros
The website owner has marked up the code block using the `llm-policy` and `llm-provenance` namespaces.

```html
<pre 
  llm-policy-license="GPL-3.0" 
  llm-provenance-attribution="Jane Doe, 2024"
>
  function complexAlgo(x) { ... }
</pre>
```

### Browser Enforcement
1.  **Detection:** The Browser Agent identifies the `llm-policy-license="GPL-3.0"` attribute.
2.  **Expansion:** It loads the policy profile for GPL-3.0, which includes the constraint: `output-license-must-be-compatible`.
3.  **Context Check:** The Agent checks the local project's configuration (defined in `.llm-project.json` or similar). It sees `license: "Proprietary"`.
4.  **Action:** The Agent detects the incompatibility (GPL is not compatible with Proprietary).

### Outcome
Instead of generating the code, the Agent halts and responds:

> **Action Blocked:** The source code is licensed under **GPL-3.0** (Copyleft), which requires derivative works to be open-sourced. This conflicts with your current project's **Proprietary** license.
>
> *Alternative:* I can explain how the algorithm works so you can implement your own version, or I can search for a permissive (MIT/Apache) alternative.
