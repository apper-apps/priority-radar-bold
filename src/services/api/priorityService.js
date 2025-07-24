import prioritiesData from "@/services/mockData/priorities.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const priorityService = {
  async getAll() {
    await delay(350);
    return [...prioritiesData];
  },

  async getById(id) {
    await delay(200);
    const priority = prioritiesData.find(p => p.Id === parseInt(id));
    if (!priority) {
      throw new Error("Priority not found");
    }
    return { ...priority };
  },

  async create(priorityData) {
    await delay(400);
    const maxId = Math.max(...prioritiesData.map(p => p.Id), 0);
    const newPriority = {
      ...priorityData,
      Id: maxId + 1,
      id: `priority-${maxId + 1}`,
      status: priorityData.status || "todo",
      createdAt: new Date().toISOString(),
      completedAt: null,
      date: priorityData.date || new Date().toISOString().split("T")[0]
    };
    prioritiesData.push(newPriority);
    return { ...newPriority };
  },

  async update(id, priorityData) {
    await delay(300);
    const index = prioritiesData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Priority not found");
    }
    
    const updatedPriority = { 
      ...prioritiesData[index], 
      ...priorityData,
      completedAt: priorityData.status === "done" ? new Date().toISOString() : null
    };
    
    prioritiesData[index] = updatedPriority;
    return { ...updatedPriority };
  },

  async delete(id) {
    await delay(250);
    const index = prioritiesData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Priority not found");
    }
    const deletedPriority = prioritiesData.splice(index, 1)[0];
    return { ...deletedPriority };
  },

  async createMultiple(priorities, userId = "user-1") {
    await delay(500);
    const newPriorities = [];
    let maxId = Math.max(...prioritiesData.map(p => p.Id), 0);
    
    for (const priority of priorities) {
      maxId += 1;
      const newPriority = {
        Id: maxId,
        id: `priority-${maxId}`,
        title: priority.title,
        description: priority.description || "",
        status: "todo",
        userId,
        createdAt: new Date().toISOString(),
        completedAt: null,
        date: new Date().toISOString().split("T")[0]
      };
      prioritiesData.push(newPriority);
      newPriorities.push({ ...newPriority });
    }
    
    return newPriorities;
  }
};