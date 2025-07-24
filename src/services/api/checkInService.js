import checkInsData from "@/services/mockData/checkIns.json";
import { priorityService } from "./priorityService";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const checkInService = {
  async getAll() {
    await delay(300);
    return [...checkInsData];
  },

  async getById(id) {
    await delay(200);
    const checkIn = checkInsData.find(c => c.Id === parseInt(id));
    if (!checkIn) {
      throw new Error("Check-in not found");
    }
    return { ...checkIn };
  },

  async create(checkInData, userId = "user-1") {
    await delay(500);
    const maxId = Math.max(...checkInsData.map(c => c.Id), 0);
    const today = new Date().toISOString().split("T")[0];
    
    // Create the check-in
    const newCheckIn = {
      Id: maxId + 1,
      id: `checkin-${maxId + 1}`,
      userId,
      date: today,
      priorities: checkInData.priorities,
      mood: checkInData.mood || "neutral",
      note: checkInData.note || null
    };
    
    // Create priorities in the priority service
    if (checkInData.priorities && checkInData.priorities.length > 0) {
      await priorityService.createMultiple(checkInData.priorities, userId);
    }
    
    checkInsData.push(newCheckIn);
    return { ...newCheckIn };
  },

  async update(id, checkInData) {
    await delay(300);
    const index = checkInsData.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Check-in not found");
    }
    checkInsData[index] = { ...checkInsData[index], ...checkInData };
    return { ...checkInsData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = checkInsData.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Check-in not found");
    }
    const deletedCheckIn = checkInsData.splice(index, 1)[0];
    return { ...deletedCheckIn };
  },

  async getTodayCheckIn(userId = "user-1") {
    await delay(200);
    const today = new Date().toISOString().split("T")[0];
    const todayCheckIn = checkInsData.find(c => c.userId === userId && c.date === today);
    return todayCheckIn ? { ...todayCheckIn } : null;
  }
};