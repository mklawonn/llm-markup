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
