// In-memory array to fall back if MongoDB isn't running locally.
const mockUsers = [];

export default {
  findOne: async ({ email }) => mockUsers.find(u => u.email === email),
  create: async (data) => {
    const user = { ...data, _id: Date.now().toString() };
    mockUsers.push(user);
    return user;
  },
  updateOne: async ({ email }, update) => {
    const index = mockUsers.findIndex(u => u.email === email);
    if (index === -1) return { matchedCount: 0 };
    mockUsers[index] = { ...mockUsers[index], ...update };
    return { matchedCount: 1 };
  }
};