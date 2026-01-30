/**
 * CULINARIA API - minimal backend for portfolio full-stack demo.
 * Endpoints: health, featured recipes, optional TheMealDB proxy.
 */
/* eslint-env node */
/* global process */
import express from "express";
import cors from "cors";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const featuredPath = join(__dirname, "data", "featuredRecipes.json");
let featuredRecipes = [];
try {
  featuredRecipes = JSON.parse(readFileSync(featuredPath, "utf-8"));
} catch (e) {
  console.warn("Could not load featured recipes:", e.message);
}

/** GET /api/health - for uptime checks and portfolio demo */
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "culinaria-api", timestamp: new Date().toISOString() });
});

/** GET /api/recipes/featured - serve curated featured recipes */
app.get("/api/recipes/featured", (_req, res) => {
  res.json(featuredRecipes);
});

/** GET /api/recipes/search?q= - proxy to TheMealDB (optional, avoids CORS from client) */
app.get("/api/recipes/search", async (req, res) => {
  const q = req.query.q?.trim();
  if (!q) {
    return res.status(400).json({ error: "Missing query parameter: q" });
  }
  try {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: "Search failed", message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`CULINARIA API running at http://localhost:${PORT}`);
});
