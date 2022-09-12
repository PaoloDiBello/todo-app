import {
  Backdrop,
  CircularProgress,
  Container,
  Paper,
  Theme,
} from "@mui/material";
import React from "react";
import AddNewTask from "./components/AddNewTask";
import Tasks from "./components/Tasks";
import { useTasksValue } from "./context";

const Homepage = () => {
  const { isLoadingTasks } = useTasksValue();

  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      <Paper
        variant="elevation"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme: Theme) => theme.zIndex.drawer + 1,
          }}
          open={isLoadingTasks}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <AddNewTask />
        <Tasks />
      </Paper>
    </Container>
  );
};

export default Homepage;
