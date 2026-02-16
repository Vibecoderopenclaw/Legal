// AI Service - Abstraction layer for AI provider integration
// Supports configurable backends; uses built-in response generation as fallback

import { getMaSystemPrompt } from './maService.js';
import { getPeSystemPrompt } from './peService.js';
import { getLitigationSystemPrompt } from './litigationService.js';

function getSystemPrompt(skillId) {
  return (
    getMaSystemPrompt(skillId) ||
    getPeSystemPrompt(skillId) ||
    getLitigationSystemPrompt(skillId)
  );
}

// Built-in contextual response generator (no external API required for demo)
function generateResponse(systemPrompt, userMessage, conversationHistory) {
  const skillContext = systemPrompt.split('\n')[0];

  const contextualResponses = buildContextualResponse(userMessage, systemPrompt);

  return {
    content: contextualResponses,
    model: 'legal-ai-assistant',
    usage: { prompt_tokens: 0, completion_tokens: 0 },
  };
}

function buildContextualResponse(userMessage, systemPrompt) {
  const lowerMessage = userMessage.toLowerCase();

  // Extract capability list from system prompt
  const capabilitiesMatch = systemPrompt.match(/Your capabilities:\n([\s\S]*?)(?:\nWhen responding:)/);
  const capabilities = capabilitiesMatch
    ? capabilitiesMatch[1]
        .split('\n')
        .filter((l) => l.trim().startsWith('-'))
        .map((l) => l.trim().substring(2))
    : [];

  const roleMatch = systemPrompt.match(/You are an expert (.+?)\./);
  const role = roleMatch ? roleMatch[1] : 'legal AI assistant';

  // Determine response type based on user input
  if (lowerMessage.includes('checklist') || lowerMessage.includes('list')) {
    return formatChecklistResponse(role, userMessage, capabilities);
  }

  if (lowerMessage.includes('draft') || lowerMessage.includes('template')) {
    return formatDraftResponse(role, userMessage);
  }

  if (lowerMessage.includes('compare') || lowerMessage.includes('vs') || lowerMessage.includes('versus')) {
    return formatComparisonResponse(role, userMessage);
  }

  if (lowerMessage.includes('risk') || lowerMessage.includes('analyze') || lowerMessage.includes('evaluate')) {
    return formatAnalysisResponse(role, userMessage);
  }

  return formatGeneralResponse(role, userMessage, capabilities);
}

function formatChecklistResponse(role, userMessage, capabilities) {
  return `## Checklist Analysis

Based on your request regarding: **${userMessage}**

As a ${role}, here is a structured checklist to guide your work:

### Priority Items
- [ ] **Initial Assessment** — Conduct preliminary review of all relevant documents and facts
- [ ] **Stakeholder Identification** — Identify all parties, counsel, and key decision-makers
- [ ] **Timeline Mapping** — Establish critical dates, deadlines, and milestones

### Core Diligence Items
${capabilities.slice(0, 5).map((c, i) => `- [ ] **Item ${i + 1}**: ${c}`).join('\n')}

### Follow-Up Actions
- [ ] Document all findings with source references
- [ ] Prepare summary memorandum for supervising attorney
- [ ] Schedule follow-up review meeting

> **Note**: This checklist is AI-generated and should be customized to your specific matter. All items require review by a licensed attorney.

*Would you like me to expand on any specific item or generate a more detailed sub-checklist?*`;
}

function formatDraftResponse(role, userMessage) {
  return `## Document Draft

Based on your request: **${userMessage}**

---

### [DOCUMENT TITLE]

**[PRIVILEGED & CONFIDENTIAL — ATTORNEY WORK PRODUCT]**

**PARTIES:**
- [Party A Name] ("Party A")
- [Party B Name] ("Party B")

**RECITALS:**

WHEREAS, Party A and Party B desire to [describe purpose of the agreement];

WHEREAS, the parties wish to set forth the terms and conditions governing [subject matter];

NOW, THEREFORE, in consideration of the mutual covenants and agreements set forth herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

**SECTION 1. DEFINITIONS**
1.1 "[Key Term]" shall mean [definition].
1.2 "[Key Term]" shall mean [definition].

**SECTION 2. [CORE PROVISIONS]**
2.1 [Primary obligation or right]
2.2 [Secondary provisions]

**SECTION 3. REPRESENTATIONS AND WARRANTIES**
3.1 Each party represents and warrants that [standard representations].

**SECTION 4. [ADDITIONAL PROVISIONS]**
[To be drafted based on specific requirements]

**SECTION 5. MISCELLANEOUS**
5.1 **Governing Law.** This Agreement shall be governed by the laws of the State of [State].
5.2 **Entire Agreement.** This Agreement constitutes the entire agreement between the parties.

---

> **Disclaimer**: This is an AI-generated template requiring significant customization by a licensed attorney. Do not use without thorough review and adaptation to your specific circumstances.

*Would you like me to expand on any section or add specific provisions?*`;
}

function formatComparisonResponse(role, userMessage) {
  return `## Comparative Analysis

Based on your question: **${userMessage}**

### Option A vs. Option B

| Factor | Option A | Option B |
|--------|----------|----------|
| **Structure** | [Structural details] | [Structural details] |
| **Tax Implications** | [Tax analysis] | [Tax analysis] |
| **Liability Exposure** | [Risk level] | [Risk level] |
| **Timeline** | [Estimated duration] | [Estimated duration] |
| **Cost** | [Cost factors] | [Cost factors] |
| **Complexity** | [Assessment] | [Assessment] |

### Key Considerations

**Advantages of Option A:**
- [Advantage 1]
- [Advantage 2]
- [Advantage 3]

**Advantages of Option B:**
- [Advantage 1]
- [Advantage 2]
- [Advantage 3]

### Recommendation

The optimal choice depends on your specific priorities. Key decision factors include:

1. **Risk tolerance** — Option [X] offers lower risk exposure
2. **Tax efficiency** — Option [X] may provide more favorable treatment
3. **Speed of execution** — Option [X] can typically be completed faster

> **Note**: This comparison is illustrative. Specific analysis requires detailed review of your transaction parameters by qualified counsel.

*Would you like me to dive deeper into any of these factors?*`;
}

function formatAnalysisResponse(role, userMessage) {
  return `## Risk & Strategy Analysis

**Subject**: ${userMessage}

### Executive Summary

This analysis examines the key legal considerations and risk factors associated with your inquiry. The assessment below provides a framework for decision-making.

### Risk Assessment Matrix

| Risk Category | Severity | Likelihood | Mitigation |
|---------------|----------|------------|------------|
| **Regulatory** | Medium | Medium | Proactive compliance review |
| **Financial** | High | Low | Insurance/indemnification |
| **Contractual** | Medium | Medium | Careful drafting and negotiation |
| **Litigation** | Low | Medium | Dispute resolution provisions |
| **Reputational** | Medium | Low | Confidentiality protections |

### Key Findings

1. **Primary Risk Area**: The most significant concern relates to [relevant area based on practice context]. Mitigation requires [recommended approach].

2. **Regulatory Considerations**: Applicable regulatory frameworks include [relevant regulations]. Compliance should be verified before proceeding.

3. **Financial Exposure**: Potential exposure ranges should be evaluated against [relevant benchmarks].

### Recommended Actions

- **Immediate**: Conduct thorough review of all relevant documentation
- **Short-term**: Engage subject matter experts for specialized analysis
- **Ongoing**: Monitor regulatory developments and update compliance posture

### Conclusion

Based on the available information, the overall risk profile is **moderate**. The identified risks can be substantially mitigated through careful planning and proper legal documentation.

> **Disclaimer**: This AI-generated analysis is for informational purposes only and requires review by qualified legal counsel before any action is taken.

*Would you like me to focus on any specific risk category or develop a detailed mitigation plan?*`;
}

function formatGeneralResponse(role, userMessage, capabilities) {
  return `Thank you for your question. As a ${role}, I can help you with this topic.

## Response to: ${userMessage}

### Overview

This is an important area of legal practice that requires careful consideration of multiple factors. Here is a structured overview:

### Key Considerations

1. **Legal Framework**: The applicable legal standards and requirements that govern this area include established statutory and common law principles specific to your jurisdiction.

2. **Practical Implications**: From a practical standpoint, key factors to consider include timing, cost, risk exposure, and strategic objectives.

3. **Best Practices**: Industry standards and best practices suggest a methodical approach that includes:
${capabilities.slice(0, 3).map((c) => `   - ${c}`).join('\n')}

### Recommended Next Steps

- Review all relevant documents and facts specific to your matter
- Consider the strategic implications of different approaches
- Consult with subject matter experts where specialized knowledge is required

### Additional Areas I Can Help With

${capabilities.slice(0, 5).map((c) => `- ${c}`).join('\n')}

> **Note**: This response is AI-generated guidance. All legal matters require review and advice from a licensed attorney in the applicable jurisdiction.

*What specific aspect would you like to explore further?*`;
}

export async function chat(skillId, userMessage, conversationHistory = []) {
  const systemPrompt = getSystemPrompt(skillId);

  if (!systemPrompt) {
    throw new Error(`Unknown skill: ${skillId}`);
  }

  // If an AI API key is configured, use external provider
  if (process.env.AI_API_KEY && process.env.AI_API_KEY !== 'your-api-key-here') {
    return await callExternalAI(systemPrompt, userMessage, conversationHistory);
  }

  // Otherwise use built-in response generator
  return generateResponse(systemPrompt, userMessage, conversationHistory);
}

async function callExternalAI(systemPrompt, userMessage, conversationHistory) {
  const provider = process.env.AI_PROVIDER || 'openai';

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ];

  if (provider === 'openai') {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-4',
        messages,
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return {
      content: data.choices[0].message.content,
      model: data.model,
      usage: data.usage,
    };
  }

  if (provider === 'anthropic') {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.AI_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'claude-sonnet-4-20250514',
        system: systemPrompt,
        messages: [
          ...conversationHistory.map((m) => ({ role: m.role, content: m.content })),
          { role: 'user', content: userMessage },
        ],
        max_tokens: 4000,
      }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return {
      content: data.content[0].text,
      model: data.model,
      usage: data.usage,
    };
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
}

export default { chat };
