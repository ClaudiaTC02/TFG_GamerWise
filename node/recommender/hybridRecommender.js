import { getUserIdFromToken } from "../utils/auth.js";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const gameRecommendations = async (req, res) => {
  const user_id = getUserIdFromToken(req);
  const { igdb_id, name, genre, platforms, company } = req.body;
  const data = {
    igdb_id: Number(igdb_id),
    name: name,
    genre: genre,
    platforms: platforms,
    company: company
  }
  const dataJson = JSON.stringify(data);
  console.log(dataJson);
  // Obtener la ruta absoluta al archivo de Python
  const pythonScriptPath = path.resolve(__dirname, "hybrid.py");
  const modelPath = path.resolve(__dirname, "svd_model.pkl");
  if (!user_id) {
    res.json(null);
    return;
  }
  // Llamar al script de Python con la ruta absoluta
  const pythonProcess = spawn("python", [pythonScriptPath, user_id, dataJson, modelPath]);
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
