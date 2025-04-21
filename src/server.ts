import projectRoutes from "@/routes/project.routes";
import taskRoutes from "@/routes/task.routes";
import taskAssignmentRoutes from "@/routes/taskAssignment.routes";
import userRoutes from "@/routes/user.routes";
import authRoutes from "@/routes/auth.routes";
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/assignments', taskAssignmentRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
