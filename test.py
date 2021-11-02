# from woocommerce import API
# wcapi = API(
#             url="https://newdropship.a2hosted.com/",
#             consumer_key="ck_34e7f3f1e99a0b0911283a82b61280bbe422d789",
#             consumer_secret="cs_e8838c981a6b91b89cbdfc8364152a569740e87d",
#             timeout=40
#         )
# data = {
#     "name": "Premium Quality15",
#     "type": "simple",
#     "sku":"158954878",
#
#     "regular_price": "21.99",
#     "sale_price": "20",
#
#     "stock_quantity":4500,
#     "manage_stock":"true",
#     "stock_status": "instock",
#
#     "description": '[embed]https://cloud.video.taobao.com/play/u/1609793559/p/1/e/6/t/10301/307811602631.mp4[/embed]',
#     "short_description": "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
#     "categories": [
#         {
#             "id": 39618
#         }
#     ],
#     "images": [
#         {
#             "src": "http://demo.woothemes.com/woocommerce/wp-content/uploads/sites/56/2013/06/T_2_front.jpg"
#         },
#         {
#             "src": "http://demo.woothemes.com/woocommerce/wp-content/uploads/sites/56/2013/06/T_2_back.jpg"
#         }
#     ],
#     "attributes": [
#     {
#       "name": "Brand Name",
#       "visible": True,
#       "variation": False,
#       "options": [
#         "Apple"
#       ]
#     },
#     {
#       "name": "Company",
#       "visible": True,
#       "variation": False,
#       "options": [
#         "ss"
#       ]
#     }
#   ]
#
# }
#
# print(wcapi.post("products", data).json())
#print(wcapi.delete("products/625060", params={"force": True}).json())
#
# # import requests
# # from bs4 import BeautifulSoup as soup
# #
# # url = "https://www.aliexpress.ru/item/1005003393871894.html?c_tp=RUB&region=UK&b_locale=en_US"
# # session = requests.Session()
# # session.cookies.set('Host', 'aliexpress.com', domain='.aliexpress.com', path='/')
# # session.cookies.set('region', 'US', domain='.aliexpress.com', path='/')
# # headers = {
# #     "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36",
# #     "Accept-Language":"en-US,en;q=0.5",
# #     "Content-Language":"en"
# # }
# #
# # proxyDict = {
# #               "http"  : "http://213.230.69.193:3128"
# #             }
# # a = {'aep_usuc_f':'region=AU&site=glo&b_locale=en_US&c_tp=USD'}
# # response = requests.get(url, timeout=20, headers=headers, cookies=a)
# # res = soup(response.content, features="lxml")
# # print(response.encoding )
# # print(response.headers)
# # print(response.cookies)
# # print(res.find("title"))
# #
# # print('__AER_DATA__')
# # full_script_data = res.find("script", {'id': '__AER_DATA__'})
# # res = full_script_data.getText()
# # print(res)

# import goslate
# primary_text = 'Цвет'
# gs = goslate.Goslate()
# print(gs.translate(primary_text, 'en'))
import utility as utility

from utility import Utility as  utility

param = 'https://cloud.video.taobao.com/play/u/2489321321/p/1/e/6/t/10301/294042161663.mp4' #Мульти
val = utility().read_translate_file()
print(utility().translate('Хаки',val))


# utility().save_translate_file()
#print(utility().read_translate_file())