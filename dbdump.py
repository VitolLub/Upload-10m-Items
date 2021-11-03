from pymongo import MongoClient

client = MongoClient('mongodb+srv://vitol:vitol486070920@ebay.elcsu.mongodb.net/test?retryWrites=true&w=majority')
db = client['test']
# collection = db['aliexpress_parent_category'] #,'items_quantity','users
# collection.delete_many({ })
collection = db['aliexpress_sub_category'] #,'items_quantity','users
collection.delete_many({ })