# Use Case: Safe Deployment with Policy Reporting

## Scenario
A large online encyclopedia (like Wikipedia) wants to enforce a strict `readonly` policy on its articles to prevent LLM hallucinations or accidental defacement. However, thousands of pages have complex interactive widgets (maps, timelines) that might break if the policy is too strict.

The Operations Team is afraid that turning on `llm-policy-output=["readonly"]` will disable these legitimate features for users.

## The Solution: Report-Only Mode
Instead of enforcing the policy immediately, they deploy it in **Audit Mode**.

### Global Policy Header
```json
{
  "report-only": true,
  "report-to": "https://logs.encyclopedia.org/llm-reports",
  "defaults": {
    "llm-policy-output": ["readonly"]
  }
}
```

## Outcome
1.  **User A (Reading an Article):** Asks the agent to "Summarize this page." The agent reads the text. No violation.
2.  **User B (Using a Widget):** Asks the agent to "Zoom in on the map." The agent modifies the DOM to change the zoom level.
    *   **Strict Policy Check:** This violates the `readonly` default.
    *   **Audit Mode Action:** The Browser **ALLOWS** the zoom action. The user experience is preserved.
    *   **Reporting:** The Browser sends a JSON report to the logs server:
        ```json
        {
          "violation": "mutation",
          "policy": "readonly",
          "target": "#map-widget",
          "action": "attribute-change",
          "url": "..."
        }
        ```

3.  **The Fix:** The Operations Team reviews the logs and sees thousands of reports for `#map-widget`. They update the policy to explicitly allow interaction for maps:
    ```json
    "category-rules": {
      "map-widget": { "llm-policy-output": ["interaction"] }
    }
    ```

4.  **Go Live:** Once the reports stop coming in (meaning all legitimate use cases are covered), they switch `report-only: false` to enforce strict security.
