from pymongo import MongoClient

client = MongoClient('mongodb+srv://vitol:vitol486070920@ebay.elcsu.mongodb.net/test?retryWrites=true&w=majority')
db = client['test']
collection = db['aliexpress'] #,'items_quantity','users
collection.delete_many({ })