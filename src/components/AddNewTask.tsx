import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Alert,
  Button,
  InputAdornment,
  Snackbar,
  TextField,
} from "@mui/material";
import { db } from "../utils/firebase";

import { addDoc, collection } from "firebase/firestore";
import { useTasksValue } from "../context";

const initialResultCreate = {
  success: false,
  failed: false,
};

type Inputs = {
  newTask: string;
};

const AddNewTask = () => {
  const [{ success, failed }, setResultCreate] = useState(initialResultCreate);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const { getTasksFetch } = useTasksValue();
  const newTask = watch("newTask"); // watch input value by passing the name of it

  const handleClose = () => {
    setResultCreate(initialResultCreate);
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    reset();
    setIsLoadingCreate(true);
    const taskDate = new Date();
    return addDoc(collection(db, "tasks"), {
      done: false,
      createdAt: taskDate,
      dueAt: taskDate,
      title: data.newTask,
    })
      .then(() => {
        setResultCreate({ ...initialResultCreate, success: true });
        getTasksFetch();
      })
      .catch(() => {
        setResultCreate({ ...initialResultCreate, failed: true });
      })
      .finally(() => {
        setIsLoadingCreate(false);
      });
  };

  return (
    <>
      <Snackbar
        open={success || failed}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          <>
            {success ? "Task created!" : "An error occured, task not created!"}
          </>
        </Alert>
      </Snackbar>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          id="new-task-input"
          label="Type task..."
          defaultValue=""
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  variant="contained"
                  component="button"
                  type="submit"
                  disabled={!newTask}
                >
                  Add
                </Button>
              </InputAdornment>
            ),
          }}
          {...register("newTask")}
        />
      </form>
    </>
  );
};

export default AddNewTask;
