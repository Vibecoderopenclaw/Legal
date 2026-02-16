// In-memory conversation store (replace with database in production)

const conversations = new Map();

export function createConversation(userId, practiceArea, skill) {
  const id = crypto.randomUUID();
  const conversation = {
    id,
    userId,
    practiceArea,
    skill,
    messages: [],
    metadata: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  conversations.set(id, conversation);
  return conversation;
}

export function getConversation(id) {
  return conversations.get(id) || null;
}

export function getUserConversations(userId) {
  return Array.from(conversations.values())
    .filter((c) => c.userId === userId)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export function addMessage(conversationId, role, content, metadata = {}) {
  const conversation = conversations.get(conversationId);
  if (!conversation) return null;

  const message = {
    id: crypto.randomUUID(),
    role,
    content,
    metadata,
    timestamp: new Date().toISOString(),
  };

  conversation.messages.push(message);
  conversation.updatedAt = new Date().toISOString();
  return message;
}

export function deleteConversation(id) {
  return conversations.delete(id);
}

export default {
  createConversation,
  getConversation,
  getUserConversations,
  addMessage,
  deleteConversation,
};
