export type Task = {
  id: number;
  text: string;
  editing: boolean;
};

export type TaskFromFetch = {
  id: string;
  name: string;
  description: string;
  done: boolean;
};
