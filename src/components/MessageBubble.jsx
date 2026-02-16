import { useState } from 'react';

export default function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = message.content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`message ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-avatar">
        {isUser ? 'You' : 'AI'}
      </div>
      <div className="message-content">
        <div className="message-text">
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>
        <div className="message-actions">
          <button className="action-btn" onClick={handleCopy} title="Copy to clipboard">
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <span className="message-time">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}

function MarkdownRenderer({ content }) {
  // Simple markdown rendering without external dependencies
  const renderMarkdown = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeContent = '';
    let inTable = false;
    let tableRows = [];
    let listItems = [];
    let listType = null;

    const flushList = () => {
      if (listItems.length > 0) {
        const Tag = listType === 'ol' ? 'ol' : 'ul';
        elements.push(
          <Tag key={elements.length}>
            {listItems.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            ))}
          </Tag>
        );
        listItems = [];
        listType = null;
      }
    };

    const flushTable = () => {
      if (tableRows.length > 0) {
        elements.push(
          <div key={elements.length} className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {tableRows[0].map((cell, i) => (
                    <th key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(cell) }} />
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.slice(2).map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} dangerouslySetInnerHTML={{ __html: inlineFormat(cell) }} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={elements.length}><code>{codeContent}</code></pre>
          );
          codeContent = '';
          inCodeBlock = false;
        } else {
          flushList();
          flushTable();
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent += (codeContent ? '\n' : '') + line;
        continue;
      }

      // Tables
      if (line.includes('|') && line.trim().startsWith('|')) {
        flushList();
        const cells = line.split('|').slice(1, -1).map((c) => c.trim());
        if (cells.length > 0) {
          inTable = true;
          tableRows.push(cells);
          continue;
        }
      } else if (inTable) {
        flushTable();
      }

      // Headers
      const headerMatch = line.match(/^(#{1,6})\s+(.*)/);
      if (headerMatch) {
        flushList();
        const level = headerMatch[1].length;
        const Tag = `h${level}`;
        elements.push(
          <Tag key={elements.length} dangerouslySetInnerHTML={{ __html: inlineFormat(headerMatch[2]) }} />
        );
        continue;
      }

      // Horizontal rule
      if (line.match(/^---+$/)) {
        flushList();
        elements.push(<hr key={elements.length} />);
        continue;
      }

      // Blockquote
      if (line.trim().startsWith('>')) {
        flushList();
        elements.push(
          <blockquote
            key={elements.length}
            dangerouslySetInnerHTML={{ __html: inlineFormat(line.replace(/^>\s*/, '')) }}
          />
        );
        continue;
      }

      // Checkbox list items
      if (line.match(/^- \[[ x]\]/)) {
        const checked = line.includes('[x]');
        const text = line.replace(/^- \[[ x]\]\s*/, '');
        listItems.push(
          `<label class="checkbox-item"><input type="checkbox" ${checked ? 'checked' : ''} disabled /> ${inlineFormat(text)}</label>`
        );
        listType = 'ul';
        continue;
      }

      // Unordered list
      if (line.match(/^[\s]*[-*]\s+/)) {
        const text = line.replace(/^[\s]*[-*]\s+/, '');
        listItems.push(text);
        listType = 'ul';
        continue;
      }

      // Ordered list
      if (line.match(/^[\s]*\d+\.\s+/)) {
        const text = line.replace(/^[\s]*\d+\.\s+/, '');
        listItems.push(text);
        listType = 'ol';
        continue;
      }

      // If we had a list, flush it
      flushList();

      // Empty line
      if (line.trim() === '') {
        continue;
      }

      // Paragraph
      elements.push(
        <p key={elements.length} dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />
      );
    }

    flushList();
    flushTable();

    return elements;
  };

  const inlineFormat = (text) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  };

  return <div className="markdown-content">{renderMarkdown(content)}</div>;
}
