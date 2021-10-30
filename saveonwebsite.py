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


        # print(attr_name_arr)
        # print(attrribute_value_full_arr)

        #img array
        img_arr = []
        img_in_description = []
        for img in self.data[1]:
            img_dict = {}
            img_dict['src'] = img
            img_dict['alt'] = self.data[4]
            img_arr.append(img_dict)

            img_tag = f'<img src="{img_dict["src"]}" alt="{img_dict["alt"]}" ><br>'
            img_in_description.append(img_tag)


        # create oprion fro every attribute
        #look code below
        """
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
        """
        attr_option_arr = []

        for index, attr_option in enumerate(attr_name_arr):
            attr_option_dict = {}
            attr_option_dict['id'] = index + 1
            attr_option_dict['name'] = attr_option
            attr_option_dict['visible'] = "True"
            attr_option_dict['variation'] = "True"

            val = []
            for a in attrribute_value_full_arr[index]:
                val.append(a['name'])
            attr_option_dict['options'] = val
            # #attrribute_value_full_arr[index]
            attr_option_arr.append(attr_option_dict)

        wcapi = self.credential()

        product_data = {
            "name": self.data[4],
            "type": "variable",
            "sku":self.data[0],
            "regular_price": "",
            'price':"",
            "total_sales":50,
            "stock_quantity": 1000,
            'stock_status': 'instock',
            'price_html': '',

            "short_description": self.data[4],
            "description": str(self.data[5])+str(" ".join(img_in_description)),
            "categories": [
                {
                    "id": 39618
                }
            ],

            "images": img_arr,


            "attributes": attr_option_arr,
            "default_attributes": [
                {
                    "id":10,
                    "name":'AAA',
                    "option":'test'
                }
            ]
        }
        print(product_data)
        response = wcapi.post('products', product_data)
        return response.json()


    def load_attributes(self):
        wcapi = self.credential()
        response = wcapi.get('products/attributes')
        print(response.json())


    def delete_product(self,id):
        wcapi = self.credential()
        response = wcapi.delete(f'products/{id}')
        print(response.json())
        return response.json()

    def add_attributes(self,id,res):
        res1 = res[6]
        res2 = res[7]
        # print(res1 )
        # print(res2)


        attrribute_value_id_arr = self.extract_attrbute_nameAndId(res1)
        print(attrribute_value_id_arr)
        attrribute_skuPropIds_arr = self.extract_attrbute_skuPropIds(res2,attrribute_value_id_arr)

        print('attrribute_skuPropIds_arr')
        print(attrribute_skuPropIds_arr)

        wcapi = self.credential()
        data = {
            "create": attrribute_skuPropIds_arr
        }

        print(wcapi.post(f"products/{id}/variations/batch", data).json())



    def load_product_by_id(self,id):
        wcapi = self.credential()
        response = wcapi.get(f"products/{id}")
        return response.json()

    def extract_attrbute_nameAndId(self, res1):
        """
                code extract attr name and attribute ID
                follow data need to extract attributes value from skuPropIds
                Example format we receive from Aliexpress 'skuPropIds': '1254,200000990,201336100'
                """
        attr_name_arr = []
        attrribute_value_full_arr = []
        for attr_count in res1:
            attr_name_arr.append(attr_count['name'])
            attr_dict = attr_count['values']

            attrribute_value_arr = []
            for attr_value in attr_dict:
                attributes_dict = {}
                attributes_dict['name'] = attr_value['name']
                attributes_dict['id'] = attr_value['id']
                attrribute_value_arr.append(attributes_dict)
            attrribute_value_full_arr.append(attrribute_value_arr)

        #return array with attr name and attr id
        return attrribute_value_full_arr

    #extract skuPropIds
    def extract_attrbute_skuPropIds(self, res2,attrribute_value_id_arr):
        """
        variation on aliexpress save like follow
        skuPropIds:1254,200003528,201336100 where
         1254 - color name
        200003528 - size name
        201336100 - country of shippig

        we need extracte data parse for atributes on our website
        """
        skuPropIds_addition_value_arr = []
        skuPropIds_arr = []
        for element in res2:
            #parse skuPropIds and send value for ID
            skuPropIds = element['skuPropIds']
            skuPropIds_arr = skuPropIds.split(",")
            attributes = self.receive_skuPropIds_data(skuPropIds_arr,attrribute_value_id_arr)


            #extract addition data of skuPropIds
            data_of_variation = {}
            data_of_variation['regular_price'] = element['amount']['value']
            data_of_variation['sale_price'] = element['activityAmount']['value']
            data_of_variation['stock_quantity'] = element['availQuantity']
            data_of_variation['stock_status'] = 'instock'
            data_of_variation['attributes'] = attributes
            skuPropIds_addition_value_arr.append(data_of_variation)
        return skuPropIds_addition_value_arr


    def receive_skuPropIds_data(self, skuPropIds_arr,attrribute_value_id_arr):

        attr_id_value = []
        for skuid in skuPropIds_arr:
            for index, e in enumerate(attrribute_value_id_arr):
                print(e)
                print(index + 1)
                for i, item in enumerate(e):
                    value_dict = {}
                    if item["id"] == skuid:
                        value_dict['id'] = index + 1
                        value_dict['option'] = item["name"]
                        attr_id_value.append(value_dict)

        #print(attr_id_value)
        return attr_id_value
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