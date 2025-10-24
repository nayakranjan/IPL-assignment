from pymongo import MongoClient
from django.conf import settings

def get_mongo_client():
    config = settings.MONGODB_SETTINGS
    host = config.get('host', 'localhost')
    port = config.get('port', 27017)
    username = config.get('username')
    password = config.get('password')
    
    if username and password:
        conn_str = f"mongodb://{username}:{password}@{host}:{port}/"
    else:
        conn_str = f"mongodb://{host}:{port}/"
    
    return MongoClient(conn_str)

def get_database():
    client = get_mongo_client()
    db_name = settings.MONGODB_SETTINGS.get('database', 'ipl_database')
    return client[db_name]

def get_matches_collection():
    db = get_database()
    return db['matches']

def get_deliveries_collection():
    db = get_database()
    return db['deliveries']
