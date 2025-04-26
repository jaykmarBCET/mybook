import { CallApiInstance } from "../../api/UserInstance";
import { create } from "zustand";

const useCallStore = create((set, get) => ({
  startCalling: async ({ userId, offer, type = 'video' }) => {
    try {
      const response = await CallApiInstance.post("/start-calling", {
        userId,
        offer,
        type,
      });
      console.log("✅ Call started:", response.data);
      return response.data;
    } catch (err) {
      console.error("❌ Failed to start call:", err?.response?.data || err.message);
      throw err;
    }
  },

  closeCalling: async ({ userId }) => {
    try {
      const response = await CallApiInstance.post("/close-call", { userId });
      console.log("✅ Call closed:", response.data);
      return response.data;
    } catch (err) {
      console.error("❌ Failed to close call:", err?.response?.data || err.message);
      throw err;
    }
  },
}));

export default useCallStore;
