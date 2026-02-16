import { Router } from 'express';
import { getMaSkills } from '../services/maService.js';
import { getPeSkills } from '../services/peService.js';
import { getLitigationSkills } from '../services/litigationService.js';

const router = Router();

const PRACTICE_AREAS = [
  {
    id: 'ma',
    name: 'Mergers & Acquisitions',
    shortName: 'M&A',
    description: 'Due diligence, deal structuring, regulatory compliance, and transaction management',
    icon: 'GitMerge',
    color: '#2563eb',
  },
  {
    id: 'pe',
    name: 'Private Equity',
    shortName: 'PE',
    description: 'Fund formation, portfolio management, term sheets, and LP/GP agreements',
    icon: 'TrendingUp',
    color: '#7c3aed',
  },
  {
    id: 'litigation',
    name: 'Litigation',
    shortName: 'Litigation',
    description: 'Case strategy, discovery management, motion drafting, and legal research',
    icon: 'Gavel',
    color: '#dc2626',
  },
];

// Get all practice areas
router.get('/', (req, res) => {
  res.json(PRACTICE_AREAS);
});

// Get skills for a practice area
router.get('/:id/skills', (req, res) => {
  const { id } = req.params;

  let skills;
  switch (id) {
    case 'ma':
      skills = getMaSkills();
      break;
    case 'pe':
      skills = getPeSkills();
      break;
    case 'litigation':
      skills = getLitigationSkills();
      break;
    default:
      return res.status(404).json({ error: 'Practice area not found' });
  }

  res.json(skills);
});

export default router;
