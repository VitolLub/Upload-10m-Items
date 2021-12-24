from database import Database

arr_shoes = [200002253,200002136,100001606,200216407,200002164,100001615,200002155,200216391,200002161,200002124]
shoise_rr = [40401, 40405, 26139, 40402, 40406, 26134, 40403, 40407, 40404, 26138]
from pymongo import MongoClient
db = MongoClient('mongodb+srv://vitol:vitol486070920@ebay.elcsu.mongodb.net/test?retryWrites=true&w=majority')
db = db['test']
collection = db['aliexpress_sub_category']
# get all rows
rows = collection.find({})
for row in rows:
    if int(row['ali_id']) in arr_shoes:
        collection.update_one({'_id': row['_id']}, {'$set': {'is_checked': 0}})
    else:
        collection.update_one({'_id': row['_id']}, {'$set': {'is_checked': 1}})
#
# for i in arr_shoes:ioVK
#     res = db.chekc_every_cat(i)
#     for j in res:
#         print(i)TRbQ
#         shoise_rr.append(j['site_id'])
# print(shoise_rr)
# set_status_for_shoese = db.set_status_for_shoese()
# index = 0
# for shoese in set_status_for_shoese:
#     try:
#         site_id = shoese['site_id']
#         product_id = shoese['product_id']
#         arr = sorted(set(site_id))
#         for check in arr:
#             if check in shoise_rr:
#                 print('ok')
#                 print(shoese['product_id'])
#                 db.update_status_for_shoese(shoese['product_id'])
#             #print(arr)
#         index += 1
#     except Exception as e:
#         print(e)

