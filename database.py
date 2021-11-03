from pymongo import MongoClient



class Database:

    def connect_to_db(self):
        db = MongoClient('mongodb+srv://vitol:vitol486070920@ebay.elcsu.mongodb.net/test?retryWrites=true&w=majority')
        db = db['test']
        return db

    def save_to_db(self):
        db = self.connect_to_db()
        collection = db['aliexpress']

        item_1 = {
            "_id": "2",
            "ali_category_id": "",
            "site_category_id": "",
            "name": ""
        }

        collection.insert_many([item_1])
