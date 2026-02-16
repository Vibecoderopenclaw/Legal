import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../hooks/useAppContext';

const AREA_LABELS = {
  ma: 'M&A',
  pe: 'Private Equity',
  litigation: 'Litigation',
};

export default function HistoryPage() {
  const { conversations, fetchConversations } = useApp();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Conversation History</h1>
        <p>Review and continue your past legal analysis sessions.</p>
      </div>

      {conversations.length === 0 ? (
        <div className="history-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <h3>No Conversations Yet</h3>
          <p>Start a chat from any practice area to build your history.</p>
          <Link to="/" className="btn-primary">Browse Practice Areas</Link>
        </div>
      ) : (
        <div className="history-list">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              to={`/chat/${conv.skill}/${conv.id}`}
              className="history-item"
            >
              <div className="history-item-header">
                <span className="history-area-badge">
                  {AREA_LABELS[conv.practiceArea] || conv.practiceArea}
                </span>
                <span className="history-skill">{conv.skill}</span>
              </div>
              <p className="history-preview">{conv.lastMessage || 'Empty conversation'}</p>
              <div className="history-item-footer">
                <span>{conv.messageCount} messages</span>
                <span>{new Date(conv.updatedAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
