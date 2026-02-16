import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../hooks/useAppContext';

export default function Layout({ children }) {
  const { sidebarOpen, toggleSidebar } = useApp();
  const location = useLocation();

  const isChat = location.pathname.startsWith('/chat');

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-left">
          <button className="menu-btn" onClick={toggleSidebar} aria-label="Toggle sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <Link to="/" className="logo">
            <span className="logo-icon">L</span>
            <span className="logo-text">LegalAI</span>
          </Link>
        </div>
        <nav className="header-nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Practice Areas
          </Link>
          <Link to="/history" className={location.pathname === '/history' ? 'active' : ''}>
            History
          </Link>
        </nav>
        <div className="header-right">
          <div className="user-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Demo User</span>
          </div>
        </div>
      </header>

      <div className={`app-body ${isChat && sidebarOpen ? 'with-sidebar' : ''}`}>
        {isChat && sidebarOpen && <Sidebar />}
        <main className="app-main">{children}</main>
      </div>
    </div>
  );
}

function Sidebar() {
  const { conversations, fetchConversations } = useApp();
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Conversations</h3>
        <button className="btn-icon" onClick={fetchConversations} title="Refresh">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
      </div>
      <div className="sidebar-list">
        {conversations.length === 0 ? (
          <p className="sidebar-empty">No conversations yet. Start a chat to see history here.</p>
        ) : (
          conversations.map((conv) => (
            <Link
              key={conv.id}
              to={`/chat/${conv.skill}/${conv.id}`}
              className={`sidebar-item ${location.pathname.includes(conv.id) ? 'active' : ''}`}
            >
              <span className="sidebar-item-area">{conv.practiceArea?.toUpperCase()}</span>
              <span className="sidebar-item-preview">
                {conv.lastMessage || 'New conversation'}
              </span>
              <span className="sidebar-item-count">{conv.messageCount} msgs</span>
            </Link>
          ))
        )}
      </div>
    </aside>
  );
}
