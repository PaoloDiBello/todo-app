export type TaskType = {
  id: string;
  title: string;
  done: boolean;
  createdAt: Date;
  dueAt: Date;
};

export type TaskUIType = {
  id: string;
  title: string;
  done: string;
  createdAt: string;
  dueAt: string;
};
