import authRoutes from "@/routes/auth.routes";
import projectRoutes from "@/routes/project.routes";
import taskRoutes from "@/routes/task.routes";
import taskAssignmentRoutes from "@/routes/taskAssignment.routes";
import userRoutes from "@/routes/user.routes";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/assignments', taskAssignmentRoutes);
app.use('/api/auth', authRoutes);

export default app;