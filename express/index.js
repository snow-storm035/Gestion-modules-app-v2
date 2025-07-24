import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'dist')));

// All other requests should serve the React app's index.html (for SPA routing)
app.get(/^.*$/, (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});


app.listen(port,"0.0.0.0", () => {
  console.log(`Server running on http://localhost:${port}`);
});
