import mockRequests from "@/services/mockData/foiaRequests.json";

let requests = [...mockRequests];
let nextId = Math.max(...requests.map(r => r.Id)) + 1;

const generateReferenceNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `FOIA-${year}-${random}`;
};

export const foiaRequestService = {
  getAll() {
    return [...requests];
  },

  getById(id) {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error("Invalid ID format");
    }
    return requests.find(request => request.Id === numId);
  },

  create(requestData) {
    const newRequest = {
      Id: nextId++,
      referenceNumber: generateReferenceNumber(),
      ...requestData,
      status: "submitted",
      submissionDate: new Date().toISOString(),
      dueDate: this.calculateDueDate(requestData.urgency),
      responses: []
    };
    
    requests.push(newRequest);
    return { ...newRequest };
  },

  update(id, data) {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error("Invalid ID format");
    }
    
    const index = requests.findIndex(request => request.Id === numId);
    if (index === -1) {
      throw new Error("Request not found");
    }
    
    requests[index] = { ...requests[index], ...data };
    return { ...requests[index] };
  },

  delete(id) {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error("Invalid ID format");
    }
    
    const index = requests.findIndex(request => request.Id === numId);
    if (index === -1) {
      throw new Error("Request not found");
    }
    
    const deleted = requests[index];
    requests.splice(index, 1);
    return { ...deleted };
  },

  calculateDueDate(urgency) {
    const now = new Date();
    let days = 30; // default
    
    switch (urgency) {
      case "urgent":
        days = 15;
        break;
      case "immediate":
        days = 8;
        break;
      default:
        days = 30;
    }
    
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + days);
    return dueDate.toISOString();
  }
};