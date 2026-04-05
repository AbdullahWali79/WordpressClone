import "dotenv/config";
import express from "express";
import cors from "cors";
import dashboardRouter from "./routes/dashboard.js";
import categoriesRouter from "./routes/categories.js";
import contentRouter from "./routes/content.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: clientUrl
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_request, response) => {
  response.json({ ok: true });
});

app.use("/api/dashboard", dashboardRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api", contentRouter);

app.use(
  (error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    if (error instanceof Error) {
      response.status(400).json({ message: error.message });
      return;
    }

    response.status(500).json({ message: "Unexpected server error." });
  }
);

app.listen(port, () => {
  console.log(`WPClone API running on http://localhost:${port}`);
});
