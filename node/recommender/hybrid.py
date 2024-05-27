import sys
import pickle
import requests
import pandas as pd
from surprise import Dataset, Reader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.preprocessing import LabelEncoder, MultiLabelBinarizer
import json
import numpy as np

def get_content_based_recommendations(game_info, top_n=6):
    response = requests.get('http://localhost:8000/game')
    data = response.json()['games']
    content_df = pd.json_normalize(data)

    new_game_row = pd.Series({
        'id': max(content_df['id']) + 1,
        'igdb_id': game_info['igdb_id'],
        'name': game_info['name'],
        'gender': game_info['genre'],
        'platforms': game_info['platforms'],
        'company': game_info['company']
    })
    if content_df['igdb_id'].isin([new_game_row['igdb_id']]).any():
        _nothing = "nada" # no hago nada
    else:
        # Agregar la nueva fila al DataFrame
        content_df = pd.concat([content_df, pd.DataFrame([new_game_row])], ignore_index=True)

    content_df = content_df[['id','igdb_id','name','gender','company','platforms']]
    content_df['features'] = content_df[['name','gender', 'company', 'platforms']].apply(lambda x: ' '.join(x), axis=1)
    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform(content_df['features'])

    content_similarity = linear_kernel(tfidf_matrix,tfidf_matrix)

    index=content_df[content_df['igdb_id'] == game_info['igdb_id']].index[0]
    similarity_scores = content_similarity[index]
    similar_indices = similarity_scores.argsort()[::-1][1:top_n+1]
    recommendations = content_df.loc[similar_indices].values
    recommendations = [rec for rec in recommendations if rec[1] != game_info['igdb_id']]
    return recommendations

def get_collaborative_recommendations(user_id, exclude_game_id, top_n=5):
    # Colaborarive filter
    # Cargar el modelo entrenado
    with open(model_path, 'rb') as f:
        modelo = pickle.load(f)
        
    response = requests.get('http://localhost:8000/user/all')
    data = response.json()['info']
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
        
    if user_id not in user_encoder.classes_:
        return []
    
    encoded_user_id = user_encoder.transform([user_id])[0]

    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(df[['userId', 'gameId', 'rating']], reader)
    
    # Obtener predicciones para el usuario específico
    user_games = df[df['userId'] == encoded_user_id]['gameId'].unique()
    all_games = df['gameId'].unique()
    games_to_predict = list(set(all_games) - set(user_games))

    user_games_pairs = [(encoded_user_id, game_id, 0) for game_id in games_to_predict] # 0 prediction
    predictions_cf = modelo.test(user_games_pairs)

    top_n_recommendations = sorted(predictions_cf, key = lambda x: x.est, reverse=True)[:top_n]
        
    recomendaciones = []
    for pred in top_n_recommendations:
        game_title = df.loc[df['gameId'] == pred.iid, 'gameName'].iloc[0]
        original_game_id = game_encoder.inverse_transform([pred.iid])[0]
        if original_game_id != exclude_game_id:
            recomendaciones.append({
                "gameId": int(original_game_id),
                "gameName": game_title,
                "estimatedRating": float(pred.est)
            })
    return recomendaciones

def get_hybrid_recommendations(user_id, game_info, model_path='svd_model.pkl'):
    content_recommendations = get_content_based_recommendations(game_info)
    game_id = game_info.get("igdb_id")
    collaborative_recommendations = get_collaborative_recommendations(user_id, game_id)
    content_recommendations = [(rec[1], rec[2]) for rec in content_recommendations]
    collaborative_recommendations = [(rec['gameId'], rec['gameName']) for rec in collaborative_recommendations]
    combined_recommendations = list(set(content_recommendations + collaborative_recommendations))
    hybrid_recommendations = [{"igdb_id": rec[0], "name": rec[1]} if isinstance(rec, tuple) 
                        else {"igdb_id": rec['gameId'], "name": rec['gameName']}
                        for rec in combined_recommendations]
    return hybrid_recommendations[:10]

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Uso: python hybrid.py <user_id> <game_info_json> <model_path>")
        sys.exit(1)

    user_id = int(sys.argv[1])
    game_info = json.loads(sys.argv[2])
    model_path = sys.argv[3]
    recomendaciones = get_hybrid_recommendations(user_id, game_info, model_path)
    # Convertir la lista de recomendaciones a JSON
    recomendaciones_json = json.dumps(recomendaciones, ensure_ascii=False, indent=4)
    print(recomendaciones_json)