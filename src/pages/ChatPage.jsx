import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../hooks/useAppContext';
import MessageBubble from '../components/MessageBubble';

const SKILL_META = {
  'ma-due-diligence': { name: 'Due Diligence Analyzer', area: 'ma', areaName: 'M&A' },
  'ma-deal-structuring': { name: 'Deal Structure Advisor', area: 'ma', areaName: 'M&A' },
  'ma-regulatory': { name: 'Regulatory & Antitrust Advisor', area: 'ma', areaName: 'M&A' },
  'ma-drafting': { name: 'M&A Document Drafter', area: 'ma', areaName: 'M&A' },
  'ma-closing': { name: 'Closing Coordinator', area: 'ma', areaName: 'M&A' },
  'pe-fund-formation': { name: 'Fund Formation Advisor', area: 'pe', areaName: 'Private Equity' },
  'pe-portfolio': { name: 'Portfolio Company Advisor', area: 'pe', areaName: 'Private Equity' },
  'pe-term-sheets': { name: 'Term Sheet & Deal Analyzer', area: 'pe', areaName: 'Private Equity' },
  'pe-lp-gp': { name: 'LP/GP Agreement Specialist', area: 'pe', areaName: 'Private Equity' },
  'pe-regulatory': { name: 'Fund Regulatory Advisor', area: 'pe', areaName: 'Private Equity' },
  'lit-case-analysis': { name: 'Case Strategy Analyzer', area: 'litigation', areaName: 'Litigation' },
  'lit-discovery': { name: 'Discovery Manager', area: 'litigation', areaName: 'Litigation' },
  'lit-motions': { name: 'Motion & Brief Drafter', area: 'litigation', areaName: 'Litigation' },
  'lit-timeline': { name: 'Case Timeline Builder', area: 'litigation', areaName: 'Litigation' },
  'lit-settlement': { name: 'Settlement Analyzer', area: 'litigation', areaName: 'Litigation' },
  'lit-research': { name: 'Legal Research Assistant', area: 'litigation', areaName: 'Litigation' },
};

const SUGGESTED_PROMPTS = {
  'ma-due-diligence': [
    'Generate a due diligence checklist for a technology company acquisition',
    'What red flags should I look for in target company financials?',
    'What regulatory approvals are needed for a cross-border deal?',
  ],
  'ma-deal-structuring': [
    'Compare stock purchase vs. asset purchase for a $50M deal',
    'Design an earn-out structure for a SaaS company acquisition',
    'What are the tax implications of a reverse triangular merger?',
  ],
  'ma-regulatory': [
    'Does this transaction require an HSR filing?',
    'Explain the CFIUS review process for foreign acquisitions',
    'Analyze antitrust risk for a horizontal merger',
  ],
  'ma-drafting': [
    'Draft an LOI for a technology acquisition',
    'Generate key reps and warranties for a stock purchase agreement',
    'What provisions should be in a no-shop clause?',
  ],
  'ma-closing': [
    'Generate a closing checklist for a stock purchase',
    'What are typical pre-closing covenants to track?',
    'Create a funds flow memorandum template',
  ],
  'pe-fund-formation': [
    'What is the typical structure for a mid-market PE fund?',
    'Explain American vs. European waterfall distributions',
    'What key terms belong in a Limited Partnership Agreement?',
  ],
  'pe-portfolio': [
    'Design a management equity incentive plan',
    'What governance provisions should PE sponsors require?',
    'How should we structure a bolt-on acquisition?',
  ],
  'pe-term-sheets': [
    'Draft a term sheet for a leveraged buyout',
    'Calculate a waterfall distribution for a 2x return',
    'What are market terms for a growth equity investment?',
  ],
  'pe-lp-gp': [
    'What are typical side letter requests from institutional LPs?',
    'Draft a subscription agreement for a PE fund',
    'What MFN provisions should we include?',
  ],
  'pe-regulatory': [
    'Do we need to register as an investment adviser?',
    'What should our compliance program include?',
    'What are our Form PF reporting obligations?',
  ],
  'lit-case-analysis': [
    'Analyze the strength of a breach of contract claim',
    'What defenses are available for trade secret misappropriation?',
    'Should we file in state or federal court?',
  ],
  'lit-discovery': [
    'Draft interrogatories for a breach of contract case',
    'Develop a deposition outline for the opposing CEO',
    'What should our ESI preservation protocol include?',
  ],
  'lit-motions': [
    'Draft a motion to dismiss for failure to state a claim',
    'Outline a summary judgment motion for breach of contract',
    'What is the standard for excluding expert testimony?',
  ],
  'lit-timeline': [
    'Calculate key litigation deadlines from a filing date',
    'Create a trial preparation timeline (90 days out)',
    'What is the statute of limitations for fraud in Delaware?',
  ],
  'lit-settlement': [
    'Evaluate this settlement offer against case value',
    'Draft a settlement agreement with mutual release',
    'How to structure settlement payments for tax efficiency?',
  ],
  'lit-research': [
    'Research the standard for piercing the corporate veil',
    'What is the law on non-compete enforceability in California?',
    'Compare breach of fiduciary duty standards across states',
  ],
};

export default function ChatPage() {
  const { skillId, conversationId } = useParams();
  const { messages, isLoading, error, sendMessage, loadConversation, clearChat } = useApp();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const meta = SKILL_META[skillId] || { name: skillId, area: '', areaName: '' };
  const prompts = SUGGESTED_PROMPTS[skillId] || [];

  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
    } else {
      clearChat();
    }
  }, [conversationId, loadConversation, clearChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = input.trim();
    if (!msg || isLoading) return;

    setInput('');
    await sendMessage(skillId, msg, meta.area);
  };

  const handlePromptClick = async (prompt) => {
    if (isLoading) return;
    setInput('');
    await sendMessage(skillId, prompt, meta.area);
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <Link to={`/practice/${meta.area}`} className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {meta.areaName}
        </Link>
        <div className="chat-title">
          <h2>{meta.name}</h2>
          <span className="chat-badge">{meta.areaName}</span>
        </div>
        <button className="btn-secondary" onClick={clearChat}>New Chat</button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-welcome">
            <div className="welcome-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3>{meta.name}</h3>
            <p>Ask a question or select a suggested prompt below to get started.</p>
            <div className="suggested-prompts">
              {prompts.map((prompt, i) => (
                <button
                  key={i}
                  className="prompt-suggestion"
                  onClick={() => handlePromptClick(prompt)}
                  disabled={isLoading}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="message assistant loading">
            <div className="message-avatar">AI</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="chat-error">
            <p>Error: {error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={`Ask ${meta.name} a question...`}
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!input.trim() || isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="input-disclaimer">
          AI-generated content requires attorney review. Not legal advice.
        </p>
      </form>
    </div>
  );
}
