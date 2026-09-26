import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import nodesRoutes from "./routes/nodes.routes";
import edgesRoutes from "./routes/edges.routes";
import trailsRoutes from "./routes/trails.routes";
import expertiseRoutes from "./routes/expertise.routes";
import surveysRoutes from "./routes/surveys.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "neuroflow-backend" }));

app.use("/api/auth", authRoutes);
app.use("/api/nodes", nodesRoutes);
app.use("/api/edges", edgesRoutes);
app.use("/api/trails", trailsRoutes);
app.use("/api/expertise", expertiseRoutes);
app.use("/api/surveys", surveysRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`NeuroFlow API running on port ${PORT}`));
