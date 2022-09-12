import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { useTasksValue } from "../context";
import { TaskUIType } from "../../@types/Task";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Alert,
  Checkbox,
  Fade,
  FormControlLabel,
  FormGroup,
  Snackbar,
  TextField,
  ToggleButton,
} from "@mui/material";
import { db } from "../utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { dirtyValues } from "../utils/form";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const initialResult = {
  success: false,
  failed: false,
};

type EditTaskModalProps = {
  open: boolean;
  close: () => void;
  selected: readonly string[];
  setSelected: React.Dispatch<React.SetStateAction<readonly string[]>>;
};

type Inputs = {
  title: string;
  dueAt: Date;
  done: boolean;
};

export default function EditTaskModal({
  open,
  close,
  selected,
  setSelected,
}: EditTaskModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { isDirty, dirtyFields, errors },
  } = useForm<Inputs>();

  const [task, setTask] = React.useState<TaskUIType>();
  const { tasks, getTasksFetch } = useTasksValue();
  const [{ success, failed }, setResult] = React.useState(initialResult);
  const [isLoadingEdit, setIsLoadingEdit] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      const taskId = selected?.[0];
      const taskTemp = tasks.find((t) => t.id === taskId);
      console.log("taskTemp", taskTemp);
      taskTemp && setTask(taskTemp);
      reset({
        title: taskTemp?.title,
        dueAt: (taskTemp?.dueAt as any)?.toDate(),
        done: taskTemp?.done === "true",
      });
    }
  }, [task, tasks, open, reset, selected]);

  const onSubmit: SubmitHandler<Inputs> = (d) => {
    const data = dirtyValues(dirtyFields, d) as Inputs;
    console.log("data", data);
    reset();
    setIsLoadingEdit(true);
    const taskId = selected?.[0];

    const docRef = doc(db, "tasks", taskId);
    const dataSnap = getDoc(docRef).then((docSnap) => docSnap.data());
    if (data.dueAt) {
      data.dueAt = new Date(data.dueAt);
    }
    updateDoc(docRef, { ...dataSnap, ...data })
      .then(() => {
        setResult({ ...initialResult, success: true });
        setSelected([]);
        getTasksFetch();
      })
      .catch((error) => {
        setResult({ ...initialResult, failed: true });
        console.log(error);
      })
      .then(() => {
        reset();
        close();
        setIsLoadingEdit(false);
      });
  };

  const handleClose = () => {
    setResult(initialResult);
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
          <>{success ? "Task edited!" : "An error occured, task not edited!"}</>
        </Alert>
      </Snackbar>

      <Modal
        open={open}
        onClose={close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit task:
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Box mt={4}>
                <TextField
                  id="task-title"
                  label="Task title"
                  fullWidth
                  {...register("title")}
                />
              </Box>
              <Box mt={2}>
                <Controller
                  name="dueAt"
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Due date"
                        {...field}
                        renderInput={(props) => (
                          <TextField {...props} fullWidth />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Box>
              <Box mt={2}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox {...register("done")} />}
                    label="Mark as done"
                  />
                </FormGroup>
              </Box>

              <Box mt={4}>
                <Button
                  variant="outlined"
                  component="button"
                  fullWidth
                  onClick={close}
                >
                  Cancel
                </Button>
              </Box>
              <Box mt={2}>
                <Button
                  disabled={isLoadingEdit || !isDirty}
                  variant="contained"
                  component="button"
                  type="submit"
                  fullWidth
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
