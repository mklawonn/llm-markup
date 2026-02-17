# Standardized Intent Lexicon

This document defines the normative set of **Standardized Intent Categories** for the `llm-intent` namespace. User Agents MUST recognize these terms and apply the corresponding optimized system prompts when constructing the LLM context.

Any `llm-intent-category` value NOT listed here MUST be treated as a custom label and wrapped using the fallback template:
> "Treat the following content as a(n) [custom-category]."

## Information Structure

| Category | Optimized System Prompt | Description |
| :--- | :--- | :--- |
| `summary` | "Provide a condensed, high-level overview of the following content, capturing the main points without excessive detail." | Used for abstracts, executive summaries, or TL;DR sections. |
| `definition` | "The following text defines a key term or concept. Extract this definition for glossary purposes if needed." | Used for explicit definitions. |
| `example` | "The following text is an illustrative example or case study supporting the main concept. Use it to clarify, but do not treat it as the primary rule." | Used for case studies, code samples, or scenarios. |
| `introduction` | "This is the introduction. It sets the context and thesis for the subsequent content." | Used for opening sections. |
| `conclusion` | "This is the conclusion. It synthesizes the previous points and provides final thoughts." | Used for closing sections. |
| `outline` | "The following is a structural outline or table of contents. Use it to understand the document's organization." | Used for TOCs or lists of headings. |

## Argumentation & Rhetoric

| Category | Optimized System Prompt | Description |
| :--- | :--- | :--- |
| `claim` | "The following text presents a core argument or assertion. Evaluate it based on the provided evidence." | Used for thesis statements or main arguments. |
| `evidence` | "The following text provides factual data, citations, or proof to support a claim." | Used for statistics, quotes, or references. |
| `counter-argument` | "The following text presents an opposing viewpoint or critique. Distinguish this from the author's primary stance." | Used for rebuttals or alternative perspectives. |
| `satire` | "The following content is satirical, ironic, or humorous. Do not interpret it literally." | Critical for preventing LLMs from treating jokes as facts. |
| `opinion` | "The following content expresses a subjective opinion, not necessarily a factual truth." | Used for editorials, reviews, or commentary. |

## Technical & Legal

| Category | Optimized System Prompt | Description |
| :--- | :--- | :--- |
| `code-block` | "The following text is executable code. Preserve its syntax and formatting exactly." | Used for programming code. |
| `api-spec` | "The following text describes an Application Programming Interface (API). Focus on the endpoints, parameters, and return types." | Used for documentation. |
| `legal-disclaimer` | "The following text is a legal disclaimer or term of service. It defines the limits of liability and usage rights." | Used for footers, TOS, or warnings. |
| `warning` | "The following text contains a critical warning or safety instruction. Highlight it prominently." | Used for alerts or safety notices. |

## Narrative & Genre

| Category | Optimized System Prompt | Description |
| :--- | :--- | :--- |
| `fiction` | "The following content is a fictional narrative. Elements described herein are not real-world facts." | Used for stories or creative writing. |
| `transcript` | "The following text is a verbatim transcript of a conversation or speech." | Used for interviews or logs. |
| `instruction` | "The following text provides step-by-step instructions or a tutorial. Follow them in sequence." | Used for guides or recipes. |

## Interaction (Phase 2)

| Category | Optimized System Prompt | Description |
| :--- | :--- | :--- |
| `search` | "Use this control to perform a search query." | For search inputs or buttons. |
| `submit` | "Use this control to submit a form or complete a transaction." | For primary action buttons. |
| `cancel` | "Use this control to abort the current action or close a dialog." | For exit or undo actions. |
| `navigation` | "Use this link or button to navigate to a different section or page." | For menu items or links. |
| `purchase` | "Use this control to initiate or finalize a financial transaction." | For checkout or buy buttons. |
| `login` | "Use this control to initiate an authentication or login process." | For account access. |

## Workflow (Phase 2)

| Category | Optimized System Prompt | Description |
| :--- | :--- | :--- |
| `step` | "This is a required step in the current workflow. Complete it before proceeding." | For multi-stage processes. |
| `prerequisite` | "This is a necessary condition or requirement that must be met before starting the workflow." | For 'Before you begin' info. |
| `result` | "The following text represents the outcome or result of a previous step or calculation." | For confirmation or data output. |
| `error-state` | "The following text describes an error or exception that has occurred in the workflow." | For validation or system errors. |

## Output Shaping (Phase 3)

| Category | Optimized System Prompt | Description |
| :--- | :--- | :--- |
| `concise` | "Provide a very brief and direct response, omitting all unnecessary words." | For summaries or short answers. |
| `detailed` | "Provide a comprehensive and exhaustive response, covering all relevant nuances." | For deep-dive explanations. |
| `json` | "Format your response as a valid, well-structured JSON object." | For data extraction. |
| `markdown` | "Format your response using Markdown syntax (headings, lists, bold, etc.)." | For rich text generation. |
| `table` | "Format your response as a Markdown table." | For comparisons or structured data. |
| `code` | "Format your response as a block of programming code." | For code generation tasks. |

## Tone & Persona (Phase 3)

| Category | Optimized System Prompt | Description |
| :--- | :--- | :--- |
| `formal` | "Adopt a formal, professional, and objective tone." | For business or academic contexts. |
| `casual` | "Adopt a casual, friendly, and conversational tone." | For social or relaxed contexts. |
| `educational` | "Adopt an educational and instructional tone, explaining concepts clearly for a learner." | For tutorials or help docs. |
| `empathetic` | "Adopt an empathetic and supportive tone, acknowledging the user's feelings or situation." | For support or wellness contexts. |
| `neutral` | "Adopt a strictly neutral and unbiased tone, avoiding any emotional or subjective coloring." | For news or reporting. |