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

    def get_first_10_orders(self):
        db = self.connect_to_db()
        collection = db['aliexpress_all_product_ids']
        #first 10 orders with status = 0
        result = collection.find({'status': 0,'shoise_status':1}).limit(10)

        #print(result)
        return result

    def get_last_10_orders(self):
        db = self.connect_to_db()
        collection = db['aliexpress_all_product_ids']
        #first 10 orders with status = 0
        result = collection.find({'status': 0}).sort({'_id':1}).limit(10)
        return result

    def set_status(self, product_id,site_product_id,sku_arr):
        db = self.connect_to_db()
        collection = db['aliexpress_all_product_ids']
        #update status = 1 by product_id and receive result

        collection.update_one({'product_id': product_id}, {'$set': {'status': 1,'site_product_id':site_product_id, 'sku_arr':sku_arr}})
        return True



    def set_check_status(self, param):
        db = self.connect_to_db()
        collection = db['aliexpress_sub_category']
        # inserst field is_checked = 1 by param
        collection.update_one({'ali_id': param}, {'$set': {'is_checked': 1}})

    # update is_checked = 0 for all subcategory
    def update_is_checked(self):
        db = self.connect_to_db()
        collection = db['aliexpress_sub_category']
        collection.update_many({}, {'$set': {'is_checked': 0}})




    """
    function for Checker class
    """
    async def add_is_checked(self,id):
        #is_checked =  0 field for cheker
        # add field is_checked = 0 to all product_id in aliexpress_all_product_id
        db = MongoClient('mongodb+srv://vitol:vitol486070920@ebay.elcsu.mongodb.net/test?retryWrites=true&w=majority')
        db = db['test']
        collection = db['aliexpress_all_product_ids']
        collection.update_many({'site_product_id':id}, {'$set': {'is_checked': 1}})

    async def load_is_checked(self):

        #load first 10 rows is_checked = 0 from aliexpress_all_product_id
        db = self.connect_to_db()
        collection = db['aliexpress_all_product_ids']

        coun = collection.count_documents({'is_checked': 0, 'status': 1})
        if coun==0:
            #update all is_checked = 1 to 0
            collection.update_many({}, {'$set': {'is_checked': 0}})


        #load only if product not checked and add to website
        result = collection.find({'is_checked': 0,'status':1}).limit(100)
        # print len of result

        return result

    def set_status_for_all(self):
        db = self.connect_to_db()
        collection = db['aliexpress_all_product_ids']
        collection.update_many({}, {'$set': {'status': 0}})


    #remove after all done
    def set_status_for_shoese(self):
        db = self.connect_to_db()
        collection = db['aliexpress_all_product_ids']
        res = collection.find({})
        return res

    # remove after all done
    def chekc_every_cat(self, i):
        db = self.connect_to_db()
        collection = db['aliexpress_sub_category']
        res = collection.find({'ali_id':str(i)})
        return res

    # remove after all done
    def update_status_for_shoese(self, site_id):
        try:
            db = self.connect_to_db()
            collection = db['aliexpress_all_product_ids']
            collection.update_one({'product_id': site_id}, {'$set': {'shoise_status': 1}})
            return True
        except:
            return False

    def set_status_to_1(self, ids_arr):

        db = self.connect_to_db()
        collection = db['aliexpress_all_product_ids']
        print('set_status_to_1')
        print(ids_arr)
        for id in ids_arr:
            print(id['product_id'])
            collection.update_one({'product_id': id['product_id']}, {'$set': {'status': 1}})







