import requests
import pandas as pd
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split, cross_validate, GridSearchCV
from sklearn.preprocessing import LabelEncoder, MultiLabelBinarizer
from surprise import accuracy
import pickle

# Paso 1: Obtener los datos del endpoint
response = requests.get('http://localhost:8000/user/all')
data = response.json()['info']

# Paso 2: Crear un DataFrame
df = pd.json_normalize(data)

# Asegúrate de que las columnas estén correctas
df['userId'] = df['user.id']
df['gameId'] = df['game.igdb_id']
df['gameName'] = df['game.name']
df['rating'] = df['rating']
df['genres'] = df['game.genres']
df['platforms'] = df['game.platforms']
df = df[['userId', 'gameId', 'rating', 'genres', 'platforms']]
user_encoder = LabelEncoder()
game_encoder = LabelEncoder()
mlb = MultiLabelBinarizer()
df = df.join(pd.DataFrame(mlb.fit_transform(df.pop('genres').str.split(',')), columns = mlb.classes_, index = df.index ))

df['userId'] = user_encoder.fit_transform(df['userId'])
df['gameId'] = game_encoder.fit_transform(df['gameId'])

print(df.head())
# Filtrar y seleccionar columnas necesarias

# num_valores = df.shape[0]
# print("El DataFrame tiene", num_valores, "valores.")

# Paso 3: Preparar los datos para Surprise
reader = Reader(rating_scale=(1, 5))  # Ajusta el rango de ratings según tus datos
data = Dataset.load_from_df(df[['userId', 'gameId', 'rating']], reader)
trainset, testset = train_test_split(data, test_size=0.2)
trainset = data.build_full_trainset()


# Definir el espacio de búsqueda de hiperparámetros
param_grid = {
    'n_factors': [50, 20, 250],
    'lr_all': [0.002, 0.01, 0.01],
    'reg_all': [0.02, 0.02, 0.1],
    'n_epochs': [100, 150, 150]
}

# Configurar GridSearchCV
gs = GridSearchCV(SVD, param_grid, measures=['rmse'], cv=10)
gs.fit(data)

# Mejor combinación de hiperparámetros
best_params = gs.best_params['rmse']
print("Mejores hiperparámetros: ", best_params)

# Entrenar el modelo con los mejores hiperparámetros
modelo = SVD(n_factors=best_params['n_factors'], lr_all=best_params['lr_all'], reg_all=best_params['reg_all'], n_epochs=best_params['n_epochs'])
modelo.fit(trainset)

# Evaluar el modelo
predictions = modelo.test(trainset.build_anti_testset())
rmse = accuracy.rmse(predictions)
print("RMSE: ", rmse)

# Resultados de la validación cruzada con los mejores hiperparámetros
# results = cross_validate(modelo, data, measures=['RMSE'], cv=5, verbose=True)
# print("Resultados de validación cruzada: ", results)

# Paso 5: Guardar el modelo entrenado
with open('svd_model.pkl', 'wb') as f:
    pickle.dump(modelo, f)

# BASADO EN FILTRADO COLABORATIVO
"""user_id = 1  # Usuario para el que se desea obtener recomendaciones
user_predictions = [pred for pred in predictions if pred.uid == user_id]
user_predictions.sort(key=lambda x: x.est, reverse=True)
top_n = 5  # Número de recomendaciones
top_user_predictions = user_predictions[:top_n]
print(df.head())
# Imprimir las recomendaciones para el usuario 
print(f"Recomendaciones para el usuario {user_id}:")

for pred in top_user_predictions:
    game_title = df.loc[df['gameId'] == pred.iid, 'gameName'].iloc[0]
    print(f"Título: {game_title}, Calificación estimada: {pred.est}")"""


# USANDO IGDB
# Función para obtener datos de IGDB
"""def obtener_datos_igdb():
    response = requests.get('http://localhost:8000/igdb/games')
    data = response.json()
    return data

# Función para procesar los datos de IGDB
def procesar_datos_igdb(data):
    df_igdb = pd.DataFrame(data)
    df_igdb.rename(columns={'id': 'gameId', 'name': 'gameName'}, inplace=True)
    return df_igdb

# Cargar datos de IGDB
data_igdb = obtener_datos_igdb()
df_igdb = procesar_datos_igdb(data_igdb)

# Obtener predicciones para los juegos de IGDB
def obtener_recomendaciones(modelo, df_igdb, user_id):
    predicciones = []
    for gameId in df_igdb['gameId'].unique():
        pred = modelo.predict(user_id, gameId)
        predicciones.append(pred)
    predicciones.sort(key=lambda x: x.est, reverse=True)
    return predicciones[:10]

# Obtener y mostrar recomendaciones
recomendaciones = obtener_recomendaciones(modelo, df_igdb, user_id)

print(f"Recomendaciones para el usuario {user_id}:")
for pred in recomendaciones:
    game_name = df_igdb.loc[df_igdb['gameId'] == pred.iid, 'gameName'].iloc[0]
    print(f"Título: {game_name}, Calificación estimada: {pred.est}")"""