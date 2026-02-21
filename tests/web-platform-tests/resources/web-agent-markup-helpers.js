/**
 * Web Agent Markup Test Helpers
 * Shared utilities for WPT conformance tests
 */

'use strict';

/**
 * Creates an element with the specified LLM attributes
 * @param {string} tagName - HTML tag name
 * @param {Object} attrs - Attribute key-value pairs
 * @returns {Element}
 */
function createLLMElement(tagName, attrs = {}) {
  const el = document.createElement(tagName);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  return el;
}

/**
 * Creates a document fragment with nested elements for inheritance testing
 * @param {Array} structure - Array of {tag, attrs, children} objects
 * @returns {DocumentFragment}
 */
function createNestedStructure(structure) {
  const fragment = document.createDocumentFragment();

  function buildNode(spec) {
    const el = createLLMElement(spec.tag || 'div', spec.attrs || {});
    if (spec.text) {
      el.textContent = spec.text;
    }
    if (spec.children) {
      for (const child of spec.children) {
        el.appendChild(buildNode(child));
      }
    }
    return el;
  }

  for (const spec of structure) {
    fragment.appendChild(buildNode(spec));
  }

  return fragment;
}

/**
 * Asserts that two arrays contain the same elements (order-independent)
 * @param {Array} actual
 * @param {Array} expected
 * @param {string} description
 */
function assert_array_equals_unordered(actual, expected, description) {
  const actualSorted = [...actual].sort();
  const expectedSorted = [...expected].sort();
  assert_array_equals(actualSorted, expectedSorted, description);
}

/**
 * Asserts that an element's effective policy matches expected tokens
 * @param {Element} el
 * @param {Object} expected - {input: [], output: [], memory: []}
 */
function assert_effective_policy(el, expected) {
  if (expected.input !== undefined) {
    assert_array_equals_unordered(
      el.wamPolicy.effectiveInputTokens,
      expected.input,
      'Effective input tokens'
    );
  }
  if (expected.output !== undefined) {
    assert_array_equals_unordered(
      el.wamPolicy.effectiveOutputTokens,
      expected.output,
      'Effective output tokens'
    );
  }
  if (expected.memory !== undefined) {
    assert_array_equals_unordered(
      el.wamPolicy.effectiveMemoryTokens,
      expected.memory,
      'Effective memory tokens'
    );
  }
}

/**
 * Valid policy input tokens for iteration
 */
const VALID_INPUT_TOKENS = ['none', 'structure', 'text', 'attributes', 'media', 'all'];

/**
 * Valid policy output tokens for iteration
 */
const VALID_OUTPUT_TOKENS = [
  'readonly', 'style', 'interaction', 'layout',
  'annotation', 'content', 'data', 'append', 'mutable'
];

/**
 * Valid policy memory tokens for iteration
 */
const VALID_MEMORY_TOKENS = ['none', 'session', 'user', 'training'];

/**
 * Valid intent importance levels for iteration
 */
const VALID_IMPORTANCE_LEVELS = ['critical', 'high', 'normal', 'low', 'background'];

/**
 * Valid provenance layers for iteration
 */
const VALID_PROVENANCE_LAYERS = ['content', 'style', 'interaction', 'topology', 'data', 'intent'];

/**
 * Lexicon categories from the standardized lexicon
 */
const LEXICON_CATEGORIES = {
  // Information Structure
  'summary': 'This is a summary. Treat it as a condensed version of longer content.',
  'definition': 'This is a definition. Treat it as an authoritative explanation of a term.',
  'example': 'This is an example. Use it to illustrate or clarify related concepts.',
  'introduction': 'This is an introduction. Use it to establish context for the content that follows.',
  'conclusion': 'This is a conclusion. Treat it as a synthesis of the preceding content.',
  'outline': 'This is an outline. Treat it as a structural overview.',

  // Argumentation & Rhetoric
  'claim': 'This is a claim. Evaluate it critically and note it may be contested.',
  'evidence': 'This is evidence. Use it to support or refute claims.',
  'counter-argument': 'This is a counter-argument. Consider it as opposition to a prior claim.',
  'satire': 'This is satire. Do not interpret it literally.',
  'opinion': 'This is an opinion. Distinguish it from factual statements.',

  // Technical & Legal
  'code-block': 'This is source code. Preserve formatting and syntax.',
  'api-spec': 'This is an API specification. Treat it as authoritative technical reference.',
  'legal-disclaimer': 'This is a legal disclaimer. Do not paraphrase or summarize.',
  'warning': 'This is a warning. Highlight its importance to the user.',

  // Narrative & Genre
  'fiction': 'This is fiction. Do not treat it as factual.',
  'transcript': 'This is a transcript. Preserve speaker attributions.',
  'instruction': 'This is an instruction. Present it as actionable guidance.'
};

/**
 * Fallback templates for custom intent values
 */
const FALLBACK_TEMPLATES = {
  category: 'Treat the following content as a(n) [value].',
  function: 'Use this control to [value].',
  workflow: '(Workflow Stage: [value])',
  output: 'Format your response as [value].',
  tone: 'Adopt a(n) [value] tone.'
};

/**
 * Importance level prompts
 */
const IMPORTANCE_PROMPTS = {
  critical: 'Pay maximum attention to the following content. It is essential for the user\'s task.',
  high: 'Prioritize this content.',
  normal: '',
  low: 'This content is supplementary. You may ignore it if context is limited.',
  background: 'This is background information only. Do not focus on it unless explicitly asked.'
};

/**
 * Comprehensive license profiles for testing.
 * Based on the normative License Compatibility Matrix in Section 6.
 */
const LICENSE_PROFILES = {
  // === Public Domain and Permissive ===
  'CC0-1.0': {
    allowedOutputTokens: ['mutable'],
    requiresAttribution: false,
    isCopyleft: false,
    commercialUse: true,
    shareAlike: false,
    licenseName: 'Creative Commons Zero v1.0 Universal'
  },
  'Unlicense': {
    allowedOutputTokens: ['mutable'],
    requiresAttribution: false,
    isCopyleft: false,
    commercialUse: true,
    shareAlike: false,
    licenseName: 'The Unlicense'
  },
  'MIT': {
    allowedOutputTokens: ['mutable'],
    requiresAttribution: true,
    isCopyleft: false,
    commercialUse: true,
    shareAlike: false,
    licenseName: 'MIT License'
  },
  'MIT-0': {
    allowedOutputTokens: ['mutable'],
    requiresAttribution: false,
    isCopyleft: false,
    commercialUse: true,
    shareAlike: false,
    licenseName: 'MIT No Attribution'
  },
  'Apache-2.0': {
    allowedOutputTokens: ['mutable'],
    requiresAttribution: true,
    isCopyleft: false,
    commercialUse: true,
    shareAlike: false,
    licenseName: 'Apache License 2.0'
  },
  'BSD-2-Clause': {
    allowedOutputTokens: ['mutable'],
    requiresAttribution: true,
    isCopyleft: false,
    commercialUse: true,
    shareAlike: false,
    licenseName: 'BSD 2-Clause "Simplified" License'
  },
  'BSD-3-Clause': {
    allowedOutputTokens: ['mutable'],
    requiresAttribution: true,
    isCopyleft: false,
    commercialUse: true,
    shareAlike: false,
    licenseName: 'BSD 3-Clause "New" or "Revised" License'
  },
  'ISC': {
    allowedOutputTokens: ['mutable'],
    requiresAttribution: true,
    isCopyleft: false,
    commercialUse: true,
    shareAlike: false,
    licenseName: 'ISC License'
  },

  // === Creative Commons ===
  'CC-BY-4.0': {
    allowedOutputTokens: ['mutable'],
    requiresAttribution: true,
    isCopyleft: false,
    commercialUse: true,
    shareAlike: false,
    licenseName: 'Creative Commons Attribution 4.0 International'
  },
  'CC-BY-SA-4.0': {
    allowedOutputTokens: ['mutable'],
    requiresAttribution: true,
    isCopyleft: true,
    commercialUse: true,
    shareAlike: true,
    licenseName: 'Creative Commons Attribution-ShareAlike 4.0 International'
  },
  'CC-BY-NC-4.0': {
    allowedOutputTokens: ['mutable'],
    requiresAttribution: true,
    isCopyleft: false,
    commercialUse: false,
    shareAlike: false,
    licenseName: 'Creative Commons Attribution-NonCommercial 4.0 International'
  },
  'CC-BY-NC-SA-4.0': {
    allowedOutputTokens: ['mutable'],
    requiresAttribution: true,
    isCopyleft: true,
    commercialUse: false,
    shareAlike: true,
    licenseName: 'Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International'
  },
  'CC-BY-ND-4.0': {
    allowedOutputTokens: ['readonly', 'annotation'],
    requiresAttribution: true,
    isCopyleft: false,
    commercialUse: true,
    shareAlike: false,
    licenseName: 'Creative Commons Attribution-NoDerivatives 4.0 International'
  },
  'CC-BY-NC-ND-4.0': {
    allowedOutputTokens: ['readonly', 'annotation'],
    requiresAttribution: true,
    isCopyleft: false,
    commercialUse: false,
    shareAlike: false,
    licenseName: 'Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International'
  },

  // === Copyleft ===
  'GPL-2.0-only': {
    allowedOutputTokens: ['mutable'],
    requiresAttribution: true,
    isCopyleft: true,
    commercialUse: true,
    shareAlike: true,
    licenseName: 'GNU General Public License v2.0 only'
  },
  'GPL-3.0-only': {
    allowedOutputTokens: ['mutable'],
    requiresAttribution: true,
    isCopyleft: true,
    commercialUse: true,
    shareAlike: true,
    licenseName: 'GNU General Public License v3.0 only'
  },
  'GPL-3.0-or-later': {
    allowedOutputTokens: ['mutable'],
    requiresAttribution: true,
    isCopyleft: true,
    commercialUse: true,
    shareAlike: true,
    licenseName: 'GNU General Public License v3.0 or later'
  },
  'LGPL-3.0-only': {
    allowedOutputTokens: ['mutable'],
    requiresAttribution: true,
    isCopyleft: true,
    commercialUse: true,
    shareAlike: true,
    licenseName: 'GNU Lesser General Public License v3.0 only'
  },
  'AGPL-3.0-only': {
    allowedOutputTokens: ['mutable'],
    requiresAttribution: true,
    isCopyleft: true,
    commercialUse: true,
    shareAlike: true,
    licenseName: 'GNU Affero General Public License v3.0'
  },
  'MPL-2.0': {
    allowedOutputTokens: ['mutable'],
    requiresAttribution: true,
    isCopyleft: true,
    commercialUse: true,
    shareAlike: false,
    licenseName: 'Mozilla Public License 2.0'
  },

  // === Proprietary ===
  'proprietary': {
    allowedOutputTokens: ['readonly'],
    requiresAttribution: false,
    isCopyleft: false,
    commercialUse: false,
    shareAlike: false,
    licenseName: 'Proprietary'
  },
  'all-rights-reserved': {
    allowedOutputTokens: ['readonly'],
    requiresAttribution: false,
    isCopyleft: false,
    commercialUse: false,
    shareAlike: false,
    licenseName: 'All Rights Reserved'
  }
};

/**
 * Legacy aliases for backward compatibility
 */
LICENSE_PROFILES['CC-BY-ND'] = LICENSE_PROFILES['CC-BY-ND-4.0'];
LICENSE_PROFILES['CC0'] = LICENSE_PROFILES['CC0-1.0'];
LICENSE_PROFILES['GPL-3.0'] = LICENSE_PROFILES['GPL-3.0-only'];

/**
 * Valid SPDX license identifiers for iteration
 */
const VALID_SPDX_IDENTIFIERS = Object.keys(LICENSE_PROFILES).filter(
  id => !['CC-BY-ND', 'CC0', 'GPL-3.0'].includes(id) // Exclude aliases
);

/**
 * Mock Global Policy for testing
 */
const MOCK_GLOBAL_POLICY = {
  'report-to': 'https://api.example.com/llm-reports',
  'report-only': false,
  'defaults': {
    'wam-policy-input': ['structure', 'text', 'attributes', 'media'],
    'wam-policy-output': ['readonly'],
    'wam-policy-memory': ['none']
  },
  'constraints': {
    'block-selectors': ['.secret', '[data-private]'],
    'category-rules': {
      'advertisement': { 'wam-policy-input': ['none'] },
      'quote': { 'wam-policy-output': ['readonly', 'annotation'] },
      'user-content': { 'wam-policy-output': ['content', 'annotation'] }
    },
    'dependencies': [
      {
        'trigger': '.pull-quote',
        'requires': '.attribution',
        'scope': 'input',
        'failure-mode': 'omit-trigger'
      }
    ]
  }
};

/**
 * Simulates setting a global policy on the document
 * @param {Object} policy - Global policy object
 */
function setMockGlobalPolicy(policy) {
  // In a real implementation, this would be set via HTTP header or meta tag
  // For testing, we simulate by setting a property
  document._mockLLMGlobalPolicy = policy;
}

/**
 * Clears the mock global policy
 */
function clearMockGlobalPolicy() {
  delete document._mockLLMGlobalPolicy;
}

/**
 * Simulates a mutation attempt and checks if it would be allowed
 * @param {Element} el
 * @param {string} permission - Output token
 * @returns {Object} - {allowed: boolean, violation: Object|null}
 */
function simulateMutation(el, permission) {
  const violation = el.checkMutationPermission(permission);
  return {
    allowed: violation === null,
    violation: violation
  };
}

/**
 * Creates a test fixture container that is cleaned up after the test
 * @param {Function} testFn - Test function that receives the container
 */
function withTestContainer(testFn) {
  const container = document.createElement('div');
  container.id = 'test-container';
  document.body.appendChild(container);

  try {
    testFn(container);
  } finally {
    container.remove();
  }
}
