import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests
import sys
import json
import numpy as np


# Paso 1: Obtener los datos del endpoint
response = requests.get('http://localhost:8000/game')
data = response.json()['games']

# Paso 2: Crear un DataFrame
games_df = pd.json_normalize(data)

# Paso 3: Combina las características textuales para vectorización
games_df['features'] = games_df[['gender', 'company', 'platforms']].apply(lambda x: ' '.join(x), axis=1)

# Paso 4: Vectoriza las características
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(games_df['features'])
games_df = games_df[['id', 'name', 'igdb_id', 'features']]

# Paso 5: Calcula la similitud del coseno entre los juegos
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

def recommend_games_based_on_list(game_list, games_df, cosine_sim, top_n=10):
    # Encuentra los índices de los juegos en la lista
    game_indices = [games_df.index[games_df['id'] == game_id].tolist()[0] for game_id in game_list]
    
    # Suma las puntuaciones de similitud de todos los juegos en la lista
    sim_scores = np.zeros(cosine_sim.shape[0])
    for idx in game_indices:
        sim_scores += cosine_sim[idx]
    
    # Promedia las puntuaciones de similitud
    sim_scores /= len(game_list)
    
    # Ordena los juegos basados en las puntuaciones de similitud promedio
    sim_scores = list(enumerate(sim_scores))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    # Obtén los índices de los juegos más similares excluyendo los de la lista original
    game_indices = [i[0] for i in sim_scores if i[0] not in game_indices][:top_n]
    
    # Retorna los juegos más similares
    return games_df.iloc[game_indices]

# Bloque principal
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Uso: python landingRecommender.py <game_list>")
        sys.exit(1)

    game_list = sys.argv[1]
    # Obtener recomendaciones
    recommended_games = recommend_games_based_on_list([45,48,49], games_df, cosine_sim)
    # Convertir a JSON y imprimir
    recommended_games_json = recommended_games.to_json(orient='records')
    print(recommended_games_json)