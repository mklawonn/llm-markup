# Use Case: The Archived Thread (Conflict Resolution)

## Scenario
A popular online forum uses LLM-Markup to allow users to edit their own comments. Each comment is tagged with `wam-intent-category="user-content"`.
The forum also has an "Archive" feature. When a thread is locked due to inactivity or moderation, the entire thread is tagged (at the container level) with `wam-intent-category="archived"`.

This results in a conflict:
*   `user-content`: The user *should* be able to edit their own words.
*   `archived`: The content *must* be frozen for historical record.

## The Global Policy
The server defines rules for both categories:

```json
"category-rules": {
  "user-content": {
    "wam-policy-output": ["content", "style"]
  },
  "archived": {
    "wam-policy-output": ["readonly"]
  }
}
```

## The Conflict
A user visits their old comment on an archived thread. They ask their browser agent: *"Fix the typo in my last comment."*

The browser agent sees the markup:
```html
<div class="thread" wam-intent-category="archived">
  <div class="comment" wam-intent-category="user-content">
    "This is my opnion."
  </div>
</div>
```
*(Note: Intent categories inherit or combine depending on implementation, but let's assume direct application for clarity).*

## The Resolution: Intersection Logic
The browser calculates the **Effective Permission Set**:
1.  **Rule A (`user-content`):** Allows `["content", "style"]`.
2.  **Rule B (`archived`):** Allows `[]` (readonly).
3.  **Intersection:** `["content", "style"]` AND `[]` = `[]`.

## Outcome
The Browser Agent enforces the **Restrictive Intersection**.
*   **Result:** The mutation is rejected.
*   **User Feedback:** *"I cannot edit this comment. Although it is your content, the thread is archived and read-only."*

This demonstrates how strict intersection logic ensures that the most restrictive policy always wins, preventing accidental data modification in complex, multi-state applications.
