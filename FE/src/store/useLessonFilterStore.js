import { create } from "zustand";

function todayString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function currentMonthString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export const useLessonFilterStore = create((set) => ({
  month: currentMonthString(),
  setMonth: (month) => set({ month }),
  selectedDate: todayString(),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
}));
