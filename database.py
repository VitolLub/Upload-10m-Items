from pymongo import MongoClient



class Database:

    def connect_to_db(self):
        db = MongoClient('mongodb+srv://vitol:vitol486070920@ebay.elcsu.mongodb.net/test?retryWrites=true&w=majority')
        db = db['test']
        return db

    def save_to_db(self):
        db = self.connect_to_db()
        collection = db['aliexpress_parent_category']

        item_1 = {
            "_id": "2",
            "ali_category_id": "",
            "site_category_id": "",
            "name": ""
        }

        collection.insert_many([item_1])

    def save_parent_category(self,parent_categoty):
        db = self.connect_to_db()
        collection = db['aliexpress_parent_category']
        collection.insert_many(parent_categoty)

    def check_parent_category(self, param):
        dbdump = self.connect_to_db()
        collection = dbdump['aliexpress_parent_category']
        result = collection.find_one({"ali_parent_cat_id": param})
        return result

    #save somecategory in aliexpress_sub_category
    def save_sub_category(self, subcategory):
        db = self.connect_to_db()
        collection = db['aliexpress_sub_category']
        #insert singl subcategory

        collection.insert_one(subcategory)
        return True

