from database import Database

arr_shoes = [200002253,200002136,100001606,200216407,200002164,100001615,200002155,200216391,200002161,200002124]
shoise_rr = [40401, 40405, 0, 40402, 40406, 0, 40403, 40407, 40404, 0]

db = Database()
#
# for i in arr_shoes:ioVK
#     res = db.chekc_every_cat(i)
#     for j in res:
#         print(i)TRbQ
#         shoise_rr.append(j['site_id'])
# print(shoise_rr)
set_status_for_shoese = db.set_status_for_shoese()
for shoese in set_status_for_shoese:
    try:
        site_id = shoese['site_id']
        print(shoese['product_id'])
        arr = sorted(set(site_id))
        for check in arr:
            if check in shoise_rr:
                print('ok')
                print(arr)
                db.update_status_for_shoese(shoese['product_id'])
        print(arr)
    except Exception as e:
        print(e)

