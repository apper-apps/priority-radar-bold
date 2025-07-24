import usersData from "@/services/mockData/users.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  async getAll() {
    await delay(300);
    return [...usersData];
  },

  async getById(id) {
    await delay(200);
    const user = usersData.find(u => u.Id === parseInt(id));
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  },

  async create(userData) {
    await delay(400);
    const maxId = Math.max(...usersData.map(u => u.Id), 0);
    const newUser = {
      ...userData,
      Id: maxId + 1,
      id: `user-${maxId + 1}`,
      lastCheckIn: new Date().toISOString()
    };
    usersData.push(newUser);
    return { ...newUser };
  },

  async update(id, userData) {
    await delay(300);
    const index = usersData.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    usersData[index] = { ...usersData[index], ...userData };
    return { ...usersData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = usersData.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    const deletedUser = usersData.splice(index, 1)[0];
    return { ...deletedUser };
  }
};