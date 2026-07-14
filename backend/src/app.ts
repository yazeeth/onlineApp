import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/health", (req, res) => {
    res.json({
        message: "Online Shop API is running"
    });
});

export default app;