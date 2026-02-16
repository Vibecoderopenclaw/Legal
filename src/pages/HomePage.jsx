import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../hooks/useAppContext';

const AREA_ICONS = {
  ma: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M6 21V9a9 9 0 0 0 9 9" />
    </svg>
  ),
  pe: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  litigation: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3l9 4.5V12l-9 4.5L3 12V7.5L12 3z" />
      <path d="M12 12v9" />
      <path d="M3 12l9 4.5 9-4.5" />
    </svg>
  ),
};

const AREA_COLORS = {
  ma: '#2563eb',
  pe: '#7c3aed',
  litigation: '#dc2626',
};

export default function HomePage() {
  const { practiceAreas, fetchPracticeAreas } = useApp();

  useEffect(() => {
    fetchPracticeAreas();
  }, [fetchPracticeAreas]);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>LegalAI Assistant</h1>
          <p className="hero-subtitle">
            AI-powered legal intelligence for M&A, Private Equity, and Litigation professionals.
            Select a practice area to access specialized tools and analysis.
          </p>
        </div>
      </section>

      <section className="practice-areas-grid">
        {practiceAreas.map((area) => (
          <Link
            key={area.id}
            to={`/practice/${area.id}`}
            className="practice-area-card"
            style={{ '--area-color': AREA_COLORS[area.id] || '#666' }}
          >
            <div className="card-icon">{AREA_ICONS[area.id]}</div>
            <div className="card-content">
              <h2>{area.name}</h2>
              <p>{area.description}</p>
            </div>
            <div className="card-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Link>
        ))}
      </section>

      <section className="features-overview">
        <h2>Key Capabilities</h2>
        <div className="features-grid">
          <FeatureCard
            title="Intelligent Analysis"
            description="AI-powered analysis of legal documents, case strategies, and deal structures with practice-specific expertise."
          />
          <FeatureCard
            title="Document Drafting"
            description="Generate drafts of agreements, motions, term sheets, and other legal documents with market-standard language."
          />
          <FeatureCard
            title="Risk Assessment"
            description="Identify and evaluate risks across regulatory, financial, contractual, and litigation dimensions."
          />
          <FeatureCard
            title="Research Assistant"
            description="Legal research support with jurisdiction-specific analysis and proper citation formatting."
          />
          <FeatureCard
            title="Compliance Guidance"
            description="Navigate regulatory requirements including SEC, HSR, CFIUS, and sector-specific compliance."
          />
          <FeatureCard
            title="Conversation History"
            description="All conversations are saved for reference, allowing you to build on prior analyses."
          />
        </div>
      </section>

      <section className="disclaimer-banner">
        <p>
          <strong>Important:</strong> LegalAI provides AI-assisted analysis for informational purposes only.
          All outputs require review by a licensed attorney. This tool does not constitute legal advice
          and does not create an attorney-client relationship.
        </p>
      </section>
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
