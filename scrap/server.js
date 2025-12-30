import express from "express";
import cors from "cors";
import scrapeRates, { clearCache, closeBrowser } from "./scraper.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/rates", async (req, res) => {
  try {
    const data = await scrapeRates();
    
    if (data) {
      res.json(data);
    } else {
      res.status(503).json({ 
        error: "Failed to fetch rates",
        message: "The scraping service is temporarily unavailable"
      });
    }
  } catch (err) {
    res.status(500).json({ 
      error: "Internal server error",
      message: err.message 
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    service: "DZD Exchange Rate Scraper",
    timestamp: new Date().toISOString() 
  });
});

app.post("/api/clear-cache", (req, res) => {
  clearCache();
  res.json({ 
    message: "Cache cleared successfully",
    timestamp: new Date().toISOString()
  });
});

app.get("/", (req, res) => {
  res.json({
    service: "DZD Exchange Rate API",
    endpoints: {
      rates: "/api/rates",
      health: "/health",
      clearCache: "/api/clear-cache (POST)"
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    error: "Not found",
    path: req.path 
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({ 
    error: "Internal server error" 
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/rates`);
});

process.on('SIGTERM', async () => {
  await closeBrowser();
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  await closeBrowser();
  server.close(() => {
    process.exit(0);
  });
});