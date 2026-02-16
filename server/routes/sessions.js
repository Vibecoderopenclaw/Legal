import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getUserConversations, deleteConversation } from '../models/conversation.js';

const router = Router();

// Get all conversations for current user
router.get('/conversations', authMiddleware, (req, res) => {
  const conversations = getUserConversations(req.user.id);
  // Return summary without full message history
  const summaries = conversations.map((c) => ({
    id: c.id,
    practiceArea: c.practiceArea,
    skill: c.skill,
    messageCount: c.messages.length,
    lastMessage: c.messages[c.messages.length - 1]?.content?.substring(0, 100),
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));
  res.json(summaries);
});

// Delete a conversation
router.delete('/conversations/:id', authMiddleware, (req, res) => {
  const deleted = deleteConversation(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  res.json({ success: true });
});

export default router;
