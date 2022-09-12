/* eslint-disable no-nested-ternary */
import dayjs from "dayjs";
import { collection, DocumentData, getDocs } from "firebase/firestore";
import { useState, useEffect, useCallback } from "react";
import { TaskType, TaskUIType } from "../../@types/Task";
import { db } from "../utils/firebase";

function createData({ title, createdAt, dueAt, done }: DocumentData) {
  return {
    title,
    createdAt: createdAt,
    dueAt: dueAt,
    done: done.toString(),
  };
}

const getTasks = async () => {
  try {
    const tasksSnapshot = await getDocs(collection(db, "tasks"));
    const tasksList = tasksSnapshot.docs.map((doc) => ({
      ...createData(doc.data()),
      id: doc.id,
    }));
    return tasksList;
  } catch (error) {
    console.error("An error occured", error);
    return [];
  }
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<TaskUIType[]>([]);
  const [isLoadingTasks, setLoadingTasks] = useState(false);

  const getTasksFetch = useCallback(() => {
    setLoadingTasks(true);
    getTasks()
      .then((data) => {
        setTasks(data);
      })
      .finally(() => {
        setLoadingTasks(false);
      });
  }, []);

  useEffect(() => {
    getTasksFetch();
  }, [getTasksFetch]);

  return { tasks, setTasks, isLoadingTasks, getTasksFetch };
};
