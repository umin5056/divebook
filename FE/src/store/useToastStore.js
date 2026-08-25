import { create } from "zustand";

export const useToastStore = create(() => ({
  message: "",
}));

let timeoutId;

export function showToast(message) {
  clearTimeout(timeoutId);
  useToastStore.setState({ message });
  timeoutId = setTimeout(() => useToastStore.setState({ message: "" }), 2000);
}
