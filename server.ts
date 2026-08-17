import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import admin from "firebase-admin";

// Initialize Firebase Admin
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
let firebaseConfig: any = {};
try {
  firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
} catch (e) {
  console.error("Could not read firebase-applet-config.json");
}

if (admin.apps.length === 0 && firebaseConfig.projectId) {
  try {
    admin.initializeApp({
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket
    });
  } catch (err) {
    console.error("Firebase admin init failed", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "8080", 10);
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.get("/health", (req, res) => res.send("OK"));

  // Vite middleware for development - force off in built file
  const isProd = process.env.NODE_ENV === "production" || fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'));
  
  if (!isProd) {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.error("Vite server failed to start", err);
    }
  } else {
    // Production: serve from dist folder
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get(/.*/, (req, res) => {
      const filePath = path.join(distPath, 'index.html');
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error("Error serving index.html:", err);
          res.status(500).send(`Error: ${err.message}`);
        }
      });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server", err);
});
