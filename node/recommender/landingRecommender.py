import sys
import pickle
import requests
import pandas as pd
from surprise import Dataset, Reader
from sklearn.preprocessing import LabelEncoder, MultiLabelBinarizer
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
    df['gameId'] = df['game.igdb_id']
    df['gameName'] = df['game.name']
    df['rating'] = df['rating']
    df['genres'] = df['game.genres']
    df['platforms'] = df['game.platforms']
    df = df[['userId', 'gameId', 'gameName', 'rating', 'genres', 'platforms']]
    user_encoder = LabelEncoder()
    game_encoder = LabelEncoder()
    mlb = MultiLabelBinarizer()
    df = df.join(pd.DataFrame(mlb.fit_transform(df.pop('genres').str.split(',')), columns = mlb.classes_, index = df.index ))

    df['userId'] = user_encoder.fit_transform(df['userId'])
    df['gameId'] = game_encoder.fit_transform(df['gameId'])

    # Verificar si el user_id existe en los datos
    if user_id not in user_encoder.classes_:
        return []  # O alguna otra lógica para usuarios nuevos
    
    encoded_user_id = user_encoder.transform([user_id])[0]

    # Paso 4: Preparar los datos para Surprise
    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(df[['userId', 'gameId', 'rating']], reader)
    trainset = data.build_full_trainset()
    
    # Obtener predicciones para el usuario específico
    user_games = df[df['userId'] == encoded_user_id]['gameId'].unique()
    all_games = df['gameId'].unique()
    games_to_predict = list(set(all_games) - set(user_games))

    user_games_pairs = [(encoded_user_id, game_id, 0) for game_id in games_to_predict] # 0 prediction
    predictions_cf = modelo.test(user_games_pairs)

    top_n = 10 
    top_n_recommendations = sorted(predictions_cf, key = lambda x: x.est, reverse=True)[:top_n]

    # PREPARAR PARA ENVIAR AL BACKEND
    recomendaciones = []
    for pred in top_n_recommendations:
        game_title = df.loc[df['gameId'] == pred.iid, 'gameName'].iloc[0]
        original_game_id = game_encoder.inverse_transform([pred.iid])[0]
        recomendaciones.append({
            "gameId": int(original_game_id),
            "gameName": game_title,
            "estimatedRating": float(pred.est)
        })
    return recomendaciones

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Uso: python landingRecommender.py <user_id>")
        sys.exit(1)
    
    user_id = int(sys.argv[1])
    model_path = sys.argv[2]
    recomendaciones = recomendar_juegos(user_id, model_path)
    print(json.dumps(recomendaciones, ensure_ascii=False, indent=4))
