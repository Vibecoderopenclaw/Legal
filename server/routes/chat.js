import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { chat } from '../services/aiService.js';
import {
  createConversation,
  getConversation,
  addMessage,
} from '../models/conversation.js';

const router = Router();

// Send a message in a conversation
router.post('/message', authMiddleware, async (req, res) => {
  try {
    const { conversationId, skillId, message, practiceArea } = req.body;

    if (!skillId || !message) {
      return res.status(400).json({ error: 'skillId and message are required' });
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = getConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
    } else {
      conversation = createConversation(req.user.id, practiceArea, skillId);
    }

    // Add user message
    addMessage(conversation.id, 'user', message);

    // Get AI response
    const aiResponse = await chat(skillId, message, conversation.messages.slice(0, -1));

    // Add assistant message
    const assistantMessage = addMessage(
      conversation.id,
      'assistant',
      aiResponse.content,
      { model: aiResponse.model, usage: aiResponse.usage }
    );

    res.json({
      conversationId: conversation.id,
      message: assistantMessage,
      model: aiResponse.model,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to process message' });
  }
});

// Get conversation history
router.get('/conversation/:id', authMiddleware, (req, res) => {
  const conversation = getConversation(req.params.id);
  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  res.json(conversation);
});

export default router;
