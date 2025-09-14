import { create } from "zustand";
import { Assignment } from "@/lib/types";

interface AssignmentState {
  assignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, "id">) => void;
  removeAssignment: (userId: string, productId: string) => void;
  getAssignmentsByUser: (userId: string) => Assignment[];
}

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  assignments: [],
  addAssignment: (assignment) =>
    set((state) => ({
      assignments: [
        ...state.assignments,
        { ...assignment, id: new Date().toISOString() },
      ],
    })),
  removeAssignment: (userId, productId) =>
    set((state) => ({
      assignments: state.assignments.filter(
        (a) => !(a.userId === userId && a.productId === productId)
      ),
    })),
  getAssignmentsByUser: (userId) =>
    get().assignments.filter((a) => a.userId === userId),
}));
