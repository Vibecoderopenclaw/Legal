import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// In-memory document store (replace with actual storage in production)
const documents = new Map();

// Document templates for each practice area
const TEMPLATES = [
  {
    id: 'tpl-nda',
    name: 'Non-Disclosure Agreement',
    practiceArea: 'ma',
    category: 'Agreement',
    description: 'Mutual NDA for M&A transaction discussions',
  },
  {
    id: 'tpl-loi',
    name: 'Letter of Intent',
    practiceArea: 'ma',
    category: 'Agreement',
    description: 'Non-binding LOI for acquisition proposal',
  },
  {
    id: 'tpl-dd-checklist',
    name: 'Due Diligence Checklist',
    practiceArea: 'ma',
    category: 'Checklist',
    description: 'Comprehensive due diligence request list',
  },
  {
    id: 'tpl-lpa',
    name: 'Limited Partnership Agreement',
    practiceArea: 'pe',
    category: 'Agreement',
    description: 'Fund LPA with standard PE terms',
  },
  {
    id: 'tpl-sub-agreement',
    name: 'Subscription Agreement',
    practiceArea: 'pe',
    category: 'Agreement',
    description: 'LP subscription agreement and investor questionnaire',
  },
  {
    id: 'tpl-term-sheet',
    name: 'Investment Term Sheet',
    practiceArea: 'pe',
    category: 'Agreement',
    description: 'LBO/growth equity term sheet template',
  },
  {
    id: 'tpl-complaint',
    name: 'Complaint Template',
    practiceArea: 'litigation',
    category: 'Pleading',
    description: 'Civil complaint template with standard causes of action',
  },
  {
    id: 'tpl-discovery-plan',
    name: 'Discovery Plan',
    practiceArea: 'litigation',
    category: 'Discovery',
    description: 'Rule 26(f) discovery plan template',
  },
  {
    id: 'tpl-motion-dismiss',
    name: 'Motion to Dismiss',
    practiceArea: 'litigation',
    category: 'Motion',
    description: 'Rule 12(b)(6) motion template',
  },
];

// Get document templates
router.get('/templates', (req, res) => {
  const { practiceArea } = req.query;
  let templates = TEMPLATES;
  if (practiceArea) {
    templates = templates.filter((t) => t.practiceArea === practiceArea);
  }
  res.json(templates);
});

// Get user's saved documents
router.get('/', authMiddleware, (req, res) => {
  const userDocs = Array.from(documents.values())
    .filter((d) => d.userId === req.user.id)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  res.json(userDocs);
});

// Save a document
router.post('/', authMiddleware, (req, res) => {
  const { title, content, practiceArea, category } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const doc = {
    id: crypto.randomUUID(),
    userId: req.user.id,
    title,
    content,
    practiceArea,
    category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  documents.set(doc.id, doc);
  res.status(201).json(doc);
});

// Update a document
router.put('/:id', authMiddleware, (req, res) => {
  const doc = documents.get(req.params.id);
  if (!doc || doc.userId !== req.user.id) {
    return res.status(404).json({ error: 'Document not found' });
  }

  const { title, content } = req.body;
  if (title) doc.title = title;
  if (content) doc.content = content;
  doc.updatedAt = new Date().toISOString();

  res.json(doc);
});

// Delete a document
router.delete('/:id', authMiddleware, (req, res) => {
  const doc = documents.get(req.params.id);
  if (!doc || doc.userId !== req.user.id) {
    return res.status(404).json({ error: 'Document not found' });
  }

  documents.delete(req.params.id);
  res.json({ success: true });
});

export default router;
