import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests
import sys
import json
import numpy as np

# Declaramos las variables globales vacías al principio
games_df = None
cosine_sim = None

def init_content():
    """Función para descargar los juegos y preparar la matriz solo cuando se lo pidamos"""
    global games_df, cosine_sim
    try:
        print("Descargando juegos de Node para el recomendador de contenido...")
        # Paso 1: Obtener los datos del endpoint
        response = requests.get('http://localhost:8000/game')
        data = response.json()['games']

        # Paso 2: Crear un DataFrame
        games_df = pd.json_normalize(data)

        # Paso 3: Combina las características textuales para vectorización
        games_df['features'] = games_df[['name','gender', 'company', 'platforms']].apply(lambda x: ' '.join(x), axis=1)

        # Paso 4: Vectoriza las características
        tfidf_vectorizer = TfidfVectorizer()
        tfidf_matrix = tfidf_vectorizer.fit_transform(games_df['features'])

        # Paso 5: Calcula la similitud del coseno entre los juegos
        cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
        print("Recomendador de contenido (TF-IDF) listo en memoria.")
    except Exception as e:
        print(f"Error al iniciar recomendador de contenido: {e}")


def recommend_games_based_on_list(game_list, df_games, sim_matrix, top_n=10):
    # Encuentra los índices de los juegos en la lista (con seguridad por si un ID no existe)
    game_indices = []
    for game_id in game_list:
        matching_indices = df_games.index[df_games['id'] == game_id].tolist()
        if matching_indices:
            game_indices.append(matching_indices[0])
    
    if not game_indices:
        return pd.DataFrame() # Devuelve vacío si no encontró los juegos

    # Suma las puntuaciones de similitud de todos los juegos en la lista
    sim_scores = np.zeros(sim_matrix.shape[0])
    for idx in game_indices:
        sim_scores += sim_matrix[idx]
    
    # Promedia las puntuaciones de similitud
    sim_scores /= len(game_indices)
    
    # Ordena los juegos basados en las puntuaciones de similitud promedio
    sim_scores = list(enumerate(sim_scores))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    # Obtén los índices de los juegos más similares excluyendo los de la lista original
    final_indices = [i[0] for i in sim_scores if i[0] not in game_indices][:top_n]
    
    # Retorna los juegos más similares
    return df_games.iloc[final_indices]


# Bloque principal (Mantenido por si quieres hacer pruebas ejecutándolo a mano en consola)
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Uso: python content.py <game_list>")
        sys.exit(1)

    # Si lo ejecutamos a mano, primero inicializamos los datos
    init_content()

    if games_df is None or cosine_sim is None:
        print("Error: No se pudo arrancar el sistema de recomendaciones.")
        sys.exit(1)

    # Convertir la cadena JSON a una lista
    try:
        game_list = json.loads(sys.argv[1])
        if not isinstance(game_list, list):
            raise ValueError("El argumento proporcionado no es una lista válida.")
    except json.JSONDecodeError:
        print("Error: El argumento proporcionado no es una cadena JSON válida.")
        sys.exit(1)
    except ValueError as ve:
        print(f"Error: {ve}")
        sys.exit(1)
        
    # Obtener recomendaciones
    recommended_games = recommend_games_based_on_list(game_list, games_df, cosine_sim)
    
    # Convertir a JSON e imprimir
    if not recommended_games.empty:
        recommended_games_json = recommended_games.to_json(orient='records')
        print(recommended_games_json)
    else:
        print("[]")