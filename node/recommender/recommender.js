import { getUserIdFromToken } from "../utils/auth.js";
import { spawn } from "node:child_process";
import { fileURLToPath } from 'node:url';
import  path  from "path"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const landingRecommendations = async (req, res) => {
  const user_id = getUserIdFromToken(req);
// Obtener la ruta absoluta al archivo de Python
const pythonScriptPath = path.resolve(__dirname, 'landingRecommender.py');
const modelPath = path.resolve(__dirname, 'svd_model.pkl');
// Llamar al script de Python con la ruta absoluta
const pythonProcess = spawn("python", [pythonScriptPath, user_id, modelPath]);
  let recommendations = "";
  // Output process
  pythonProcess.stdout.on("data", (data) => {
    recommendations += data.toString();
  });
  // Errors during process
  pythonProcess.stderr.on("data", (data) => {
    console.error(`Error en el script de Python: ${data}`);
    res.status(500).send("Error en el servidor al generar recomendaciones");
  });
  // End process
  pythonProcess.on("close", (code) => {
    if (code === 0) {
      try {
        // Parsear las recomendaciones JSON recibidas
        const parsedRecommendations = JSON.parse(recommendations);
        // Enviar las recomendaciones al cliente como respuesta
        res.json(parsedRecommendations);
      } catch (error) {
        console.error(`Error al parsear las recomendaciones JSON: ${error}`);
        res.status(500).send("Error en el servidor al generar recomendaciones");
      }
    } else {
      console.error(
        `Proceso de Python finalizado con código de salida ${code}`
      );
      res.status(500).send("Error en el servidor al generar recomendaciones");
    }
  });
};
