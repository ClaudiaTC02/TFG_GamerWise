from flask import Flask, request, jsonify
import pickle
import json

# Importamos tus funciones
from hybrid import get_hybrid_recommendations
from landingRecommender import recomendar_juegos
from content import recommend_games_based_on_list, init_content
import content

app = Flask(__name__)

# Variable global para el modelo
modelo = None

def load_model():
    global modelo
    try:
        with open('svd_model.pkl', 'rb') as f:
            modelo = pickle.load(f)
        print("Modelo SVD cargado en RAM.")
    except Exception as e:
        print(f"Error al cargar modelo SVD: {e}")

# RUTA 1: Recomendaciones Híbridas (Para la página de detalles)
@app.route('/recommend/hybrid', methods=['POST'])
def hybrid_route():
    data = request.get_json()
    recs = get_hybrid_recommendations(int(data['user_id']), data['game_info'], modelo)
    return jsonify(recs)

# RUTA 2: Recomendaciones Landing
@app.route('/recommend/landing', methods=['POST'])
def landing_route():
    data = request.get_json()
    recs = recomendar_juegos(int(data['user_id']), modelo)
    return jsonify(recs)

# RUTA 3: Recomendaciones por Contenido (Listas)
@app.route('/recommend/content', methods=['POST'])
def content_route():
    data = request.get_json()
    if content.games_df is None or content.cosine_sim is None:
        print("⚠️ Los datos estaban vacíos. Intentando descargarlos de Node ahora...")
        init_content()
        
    if content.games_df is None:
        return jsonify({"error": "No se pudieron cargar los juegos desde Node"}), 500

    recs_df = recommend_games_based_on_list(
        data['game_list'], 
        content.games_df, 
        content.cosine_sim
    )
    recs_json = json.loads(recs_df.to_json(orient='records'))
    return jsonify(recs_json)

if __name__ == '__main__':
    load_model()
    init_content()
    print("Servidor IA escuchando en el puerto 5000...")
    app.run(host='0.0.0.0', port=5000, debug=False)