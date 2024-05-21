import sys
import pickle
import requests
import pandas as pd
from surprise import Dataset, Reader
import json

def recomendar_juegos(user_id, model_path='svd_model.pkl'):
    # Cargar el modelo entrenado
    with open(model_path, 'rb') as f:
        modelo = pickle.load(f)

    # Paso 1: Obtener los datos del endpoint
    response = requests.get('http://localhost:8000/user/all')
    data = response.json()['info']

    # Paso 2: Crear un DataFrame
    df = pd.json_normalize(data)
    df['userId'] = df['user.id']
    df['gameId'] = df['game.igdb_id'].combine_first(df['game.id'])
    df['gameName'] = df['game.name']
    df['rating'] = df['rating']
    df['genres'] = df['game.genres']
    df['platforms'] = df['game.platforms']

    # Paso 3: Filtrar y seleccionar columnas necesarias
    df = df[['userId', 'gameId', 'gameName', 'rating', 'genres', 'platforms']]

    # Paso 4: Preparar los datos para Surprise
    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(df[['userId', 'gameId', 'rating']], reader)
    trainset = data.build_full_trainset()

    # Paso 5: Evaluar el modelo
    items_a_predecir = trainset.build_anti_testset()
    predictions = modelo.test(items_a_predecir)

    # Obtener predicciones para el usuario específico
    user_predictions = [pred for pred in predictions if pred.uid == user_id]
    user_predictions.sort(key=lambda x: x.est, reverse=True)
    top_n = 10 
    top_user_predictions = user_predictions[:top_n]

    # PREPARAR PARA ENVIAR AL BACKEND
    recomendaciones = []
    for pred in top_user_predictions:
        game_title = df.loc[df['gameId'] == pred.iid, 'gameName'].iloc[0]
        recomendaciones.append({
            "gameId": pred.iid,
            "gameName": game_title,
            "estimatedRating": pred.est
        })
    return recomendaciones

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Uso: python landingRecommender.py <user_id>")
        sys.exit(1)
    
    user_id = int(sys.argv[1])
    model_path = sys.argv[2]
    recomendaciones = recomendar_juegos(user_id, model_path)
    print(json.dumps(recomendaciones))
