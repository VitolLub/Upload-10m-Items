""""""
import json

import self as self

"""
Class describe login and nethods to save data on veblite - https://newdropship.a2hosted.com/
# Consumer key: ck_34e7f3f1e99a0b0911283a82b61280bbe422d789
# Consumer secret: cs_e8838c981a6b91b89cbdfc8364152a569740e87d
"""
from woocommerce import API
class SaveOnWebsite:

    def __init__(self,data):
        self.data = data


    #website credential
    def credential(self):
        wcapi = API(
            url="https://newdropship.a2hosted.com/",
            consumer_key="ck_34e7f3f1e99a0b0911283a82b61280bbe422d789",
            consumer_secret="cs_e8838c981a6b91b89cbdfc8364152a569740e87d",
            timeout=40
        )

        return wcapi

    #test connet
    def connet_ping(self):


        wcapi = API(
            url="https://newdropship.a2hosted.com/",
            consumer_key="ck_34e7f3f1e99a0b0911283a82b61280bbe422d789",
            consumer_secret="cs_e8838c981a6b91b89cbdfc8364152a569740e87d",
            timeout=40
        )
        response = wcapi.get('products/categories/39617')
        print(response.json())
        print(response.status_code)


    def create_category(self):

        wcapi = self.credential()

        batch_data = {
          'create': [
            {
              'id': 205002194,
              'name': "Dresses",
              'slug': 'dresses',
              'parent': 39617,
              'description': "Dresses",
              'display': 'default',
              'image': None,
              'menu_order': 0,
              'count': 0,
              '_links': {
                'self': [
                  {'href': 'http://localhost/wp-json/wc/v3/products/categories/205002194'}
                ],
               'collection': [
                 {'href': 'http://localhost/wp-json/wc/v3/products/categories'}
                ]
              }
            }
          ]
        }
        response = wcapi.post('products/categories/batch', batch_data)
        print(response)
        print(response.json())
        #39618

    #save data on website
    def save(self):
        #print(self.data[6])

        attr_name_arr = []
        attrribute_value_full_arr = []
        for attr_count in self.data[6]:
            attr_name_arr.append(attr_count['name'])
            attr_dict = attr_count['values']

            attrribute_value_arr = []
            for attr_value in attr_dict:
                attributes_dict = {}
                attributes_dict['name']= attr_value['name']
                attributes_dict['displayName'] = attr_value['displayName']
                attributes_dict['id'] = attr_value['id']
                attrribute_value_arr.append(attributes_dict)
            attrribute_value_full_arr.append(attrribute_value_arr)


        print(attr_name_arr)
        print(attrribute_value_full_arr)
        wcapi = self.credential()

        img_arr = []

        for img in self.data[1]:
            img_dict = {}
            img_dict['src'] = img
            img_dict['alt'] = self.data[4]
            img_arr.append(img_dict)


        product_data = {
            "name": self.data[4],
            "type": "variable",
            "sku":self.data[0],
            "regular_price": "22.50",
            'price':"20",
            "total_sales":50,
            "stock_quantity": 10,
            "short_description": self.data[4],
            "description": self.data[5],
            "categories": [
                {
                    "id": 39618
                }
            ],

            "images": img_arr,


            "attributes": [
                {
                    "id":1,
                    "name": "Color",
                    "visible": True,
                    "variation": True,
                    "options": [
                        "black",
                        "white"
                    ]
                },
                {
                    "id": 2,
                    "name": "Size",
                    "visible": True,
                    "variation": True,
                    "options": [
                        "S",
                        "M",
                        "L"
                    ]
                }
            ]
        }
        # response = wcapi.post('products', product_data)
        # return response.json()


    def load_attributes(self):
        wcapi = self.credential()
        response = wcapi.get('products/attributes')
        print(response.json())


    def delete_product(self,id):
        wcapi = self.credential()
        response = wcapi.delete(f'products/{id}')
        print(response.json())
        return response.json()

    def add_attributes(self,id):
        wcapi = self.credential()
        data = {
            "create": [
                {
                    "regular_price": "11.00",
                    "sale_price":"8",
                    "stock_quantity": 60,
                    "stock_status":"instock",
                    "attributes": [
                            {
                                "id": 1,
                                "option": "black"
                            },
                            {
                                "id": 2,
                                "option": "M"
                            }
                        ]
                },
                {
                    "regular_price": "10.00",
                    "sale_price": "7",
                    "stock_quantity":50,
                    "stock_status": "instock",
                     "attributes": [
                            {
                                "id": 1,
                                "option": "white"
                            },
                            {
                                "id": 2,
                                "option": "M"
                            }
                        ]
                }
            ]
        }

        print(wcapi.post(f"products/{id}/variations/batch", data).json())



    def load_product_by_id(self,id):
        wcapi = self.credential()
        response = wcapi.get("products/{id}")
        return response.json()
#
# if __name__ == '__main__':
#     # url = "https://fr.aliexpress.com/item/1005002001535547.html"
#
#     # start = AliParserItemIDs(url)
#     # res = start.request_by_url()
#     # print(res)
#
#     start = SaveOnWebsite()
#     #start.connet_ping()
#     #start.create_category()
#     start.save()