import React, { createContext, useContext } from "react";
import { useTasks } from "../hooks";

export const TasksContext = createContext({} as ReturnType<typeof useTasks>);
type TasksProviderProps = {
  children: React.ReactNode;
};
export const TasksProvider = ({ children }: TasksProviderProps) => {
  const tasksContext = useTasks();
  return (
    <TasksContext.Provider value={{ ...tasksContext }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasksValue = () => useContext(TasksContext);
