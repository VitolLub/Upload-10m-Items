# coding=utf-8
__author__      = "Lubomir Vitol"
__copyright__   = "Copyright 2021, Planet Earth"

import re

from bs4 import BeautifulSoup

"""
Class describe login and nethods to save data on veblite - https://newdropship.a2hosted.com/
# Consumer key: ck_34e7f3f1e99a0b0911283a82b61280bbe422d789
# Consumer secret: cs_e8838c981a6b91b89cbdfc8364152a569740e87d
"""
from woocommerce import API
from utility import Utility as utility




class SaveOnWebsite:

    def __init__(self,data=None):
        self.data = data
        self.all_translate_values = utility().read_translate_file()

    #website credential
    def credential(self):
        wcapi = API(
            # url="https://newdropship.a2hosted.com/",
            # consumer_key="ck_e7206cd4ca57cac8a978d9cdbee19d320cad6235",
            # consumer_secret="cs_19b8c87f70d22168e9faa096b9b6178769247903",
            url="http://195.181.243.90",
            consumer_key="ck_8a23912a6156503227cd48970bb221e394aabd6c",
            consumer_secret="cs_a6af47b5c7b36fde6222c95159e9fbd2e59f56c1",
            timeout=1000
        )

        return wcapi

    #test connet
    def connet_ping(self):


        wcapi = API(
            url="https://newdropship.a2hosted.com/",
            consumer_key="ck_34e7f3f1e99a0b0911283a82b61280bbe422d789",
            consumer_secret="cs_e8838c981a6b91b89cbdfc8364152a569740e87d",
            timeout=80
        )
        response = wcapi.get('products/categories/39617')
        return response.json()


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
        return response.json()

    #save data on website
    def save(self,site_id):

        categories_arr = []

        #create array wih site_id array
        for id in site_id:
            categories_dict = {}
            categories_dict['id'] = id
            categories_arr.append(categories_dict)

        # prepear video url
        try:

            if len(self.data[3])>0:
                video_embed = utility().fix_video_url(self.data[3][0])
            else:
                video_embed = ''
        except Exception as e:
            print(f"Video array {e}")


        attr_name_arr = []
        attrribute_value_full_arr = []
        #print("self.data[6]")
        #print(self.data[6])
        for attr_count in self.data[6]:
            attr_name_arr.append(attr_count['name'])
            attr_dict = attr_count['values']

            attrribute_value_arr = []

            for attr_value in attr_dict:
                attributes_dict = {}
                attributes_dict['name']= attr_value['displayName']
                attributes_dict['displayName'] = attr_value['displayName']
                attributes_dict['id'] = attr_value['id']
                attrribute_value_arr.append(attributes_dict)
            attrribute_value_full_arr.append(attrribute_value_arr)



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


        # create oprion for every attribute
        #look code below

        attr_option_arr = []

        for index, attr_option in enumerate(attr_name_arr):
            attr_option_dict = {}
            attr_option_dict['id'] = self.get_attr_id(attr_option)

            #translate att name
            attr_option_dict['name'] = utility().translate(attr_option,self.all_translate_values)
            attr_option_dict['visible'] = "True"
            attr_option_dict['variation'] = "True"

            val = []
            for a in attrribute_value_full_arr[index]:
                if len(a['name'])>2:
                    name = self.attr_upper_case(a['name'])
                    #print(name)
                    result = utility().translate(name,self.all_translate_values)
                else:
                    result = a['name']
                val.append(result)
            attr_option_dict['options'] = val
            # #attrribute_value_full_arr[index]
            attr_option_arr.append(attr_option_dict)


        #add addition attributes
        for index, attr_atidion in enumerate(self.data[13]):
            attr_adition_dict = {}
            attr_adition_dict['name'] = attr_atidion['title']
            attr_adition_dict['visible'] = "True"
            attr_adition_dict['variation'] = "False"
            attr_adition_dict['options'] = [attr_atidion['value']]
            attr_option_arr.append(attr_adition_dict)

        wcapi = self.credential()


        #remove all links with word aliexpress  self.data[12]
        full_description = self.remove_all_links(self.data[12])
        clean_description = self.clen_description(full_description)

        product_data = {
            "name": self.data[4],
            "type": "variable",
            "sku":self.data[0],
            "regular_price": "",
            'price':"",

            "short_description": self.data[4],
            "description": "<div class='description'>"+"<div = 'video'>"+video_embed+"</div>"+clean_description+"</div>",
            "categories": categories_arr,

            "images": img_arr,


            "attributes": attr_option_arr
        }
        #print(product_data)
        #quit()
        response = wcapi.post('products', product_data).json()
        print('Data saving')
        return response


    def load_attributes(self):
        wcapi = self.credential()
        response = wcapi.get('products/attributes')
        return response.json()


    def delete_product(self,id):
        try:
            wcapi = self.credential()
            response = wcapi.delete(f'products/{id}')
            return response.json()
        except Exception as e:
            print(f"Error in delete product {e}")

    def add_attributes(self,id,res, attributes_ids):
        res1 = res[6]
        res2 = res[7]
        attributes_ids = self.remove_not_used_attributes(attributes_ids)

        attrribute_value_id_arr = self.extract_attrbute_nameAndId(res1)

        attrribute_skuPropIds_arr = self.extract_attrbute_skuPropIds(res2,attrribute_value_id_arr,attributes_ids)


        #print(attrribute_skuPropIds_arr)
        print("attrribute_skuPropIds_arr")
        print(len(attrribute_skuPropIds_arr))

        if len(attrribute_skuPropIds_arr) <= 40:
            self.save_all_attributes(attrribute_skuPropIds_arr, id)
        else:
            iteration = list(self.divide_chunks(attrribute_skuPropIds_arr, 40))

            for iteration_val in iteration:
                try:
                    print("Run code if elements more  then  40")
                    self.save_all_attributes(iteration_val, id)
                except Exception as e:
                    print(f"During savind attributes in function add_attributes upon error {e}")


        return attrribute_skuPropIds_arr




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

                if len(attr_value['displayName'])>3:
                    name = utility().translate(attr_value['displayName'],self.all_translate_values)
                    attributes_dict['name'] = self.attr_upper_case(name)
                else:
                    attributes_dict['name'] = self.attr_upper_case(attr_value['displayName'])
                attributes_dict['id'] = attr_value['id']
                attributes_dict['imageMainUrl'] = attr_value['imageMainUrl']
                attrribute_value_arr.append(attributes_dict)
            attrribute_value_full_arr.append(attrribute_value_arr)

        return attrribute_value_full_arr

    #extract skuPropIds
    def extract_attrbute_skuPropIds(self, res2, attrribute_value_id_arr, attributes_ids):


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

            attributes = self.receive_skuPropIds_data(skuPropIds_arr,attrribute_value_id_arr, attributes_ids)

            # add profit to price
            regular_price = str(utility().price_fix(element['amount']['value']))
            try:
                sale_price = str(utility().price_fix(element['activityAmount']['value']))
            except:
                sale_price = str(utility().price_fix(element['amount']['value']))

                #extract addition data of skuPropIds
            data_of_variation = {}
            data_of_variation['regular_price'] = regular_price

            # if no any discount
            try:
                data_of_variation['sale_price'] = sale_price
            except:
                data_of_variation['sale_price'] = regular_price
            data_of_variation['sku'] = element['skuId']+"_v1" #add _v1 for all sku. If product have just one single variation then code show dublication of sku
            if int(element['availQuantity']) > 0:
                data_of_variation['stock_quantity'] = element['availQuantity']
                data_of_variation['stock_status'] = 'instock'
                data_of_variation['manage_stock'] = 'true'
            else:
                data_of_variation['stock_quantity'] = element['availQuantity']
                data_of_variation['stock_status'] = 'outofstock'
                data_of_variation['manage_stock'] = 'false'
                data_of_variation['status'] = 'private'
                data_of_variation['purchasable'] = 'false'
            img = self.find_img_for_attr(attributes)
            if len(img)>0:
                data_of_variation["image"] = {
                    "src": img
                }
            #data_of_variation['image'] =
            data_of_variation['attributes'] = attributes
            skuPropIds_addition_value_arr.append(data_of_variation)

        return skuPropIds_addition_value_arr

    #parse skuPropIds
    def receive_skuPropIds_data(self, skuPropIds_arr,attrribute_value_id_arr, attributes_ids):

        attr_id_value = []
        for skuid in skuPropIds_arr:
            for index, e in enumerate(attrribute_value_id_arr):

                for i, item in enumerate(e):
                    value_dict = {}
                    if item["id"] == skuid:
                        value_dict['id'] = self.find_attr_id(item["name"], attributes_ids)
                        value_dict['option'] = item["name"]
                        if 'imageMainUrl' in item.keys():
                            value_dict['imageMainUrl'] = item["imageMainUrl"]
                        attr_id_value.append(value_dict)

        return attr_id_value

    def save_all_attributes(self,attrribute_skuPropIds_arr,id):
        print(f"save_all_attributes for ID {id}")
        wcapi = self.credential()


        data = {
            "create": attrribute_skuPropIds_arr
        }
        try:
            print('Run code')
            response = wcapi.post(f"products/{id}/variations/batch", data).json()
            #print(response)
        except:
            print('Some problem, attributes dont saved. Run code again')
            print(attrribute_skuPropIds_arr,id)
            self.save_all_attributes(attrribute_skuPropIds_arr,id)

    def save_parent_category(self,parent_categoty_dict):
        wcapi = self.credential()
        try:
            parent_id = parent_categoty_dict['site_parent']
        except Exception as e:
            parent_id = ''
        #check if exist parent_categoty_dict['ali_parent_cat_id']
        try:
            ali_id = parent_categoty_dict['ali_parent_cat_id']
        except:
            ali_id = parent_categoty_dict['ali_id']


        batch_data = {
            'create': [
                {
                    'id': ali_id,
                    'name': parent_categoty_dict['name'],
                    'slug': parent_categoty_dict['name'],
                    'parent': parent_id,
                    'description': parent_categoty_dict['name'],
                    'display': 'default',
                    'image': None,
                    'menu_order': 0,
                    'count': 0,
                    '_links': {
                        'self': [
                            {'href': f'http://localhost/wp-json/wc/v3/products/categories/{ali_id}'}
                        ],
                        'collection': [
                            {'href': 'http://localhost/wp-json/wc/v3/products/categories'}
                        ]
                    }
                }
            ]
        }
        response = wcapi.post('products/categories/batch', batch_data)
        return response.json()

    def save_sub_category(self, subcategory):
        return self.save_parent_category(subcategory)

    def remove_all_links(self, param):
        #find all links with href param aliexpress using soup
        soup = BeautifulSoup(param, 'html.parser')

        #find single a tag with aliexpress text

        #len for a_tag
        a_tag = soup.find_all('a', href=re.compile('aliexpress'))
        # len for a_tag
        if len(a_tag) > 0:
            #links = soup.find_all('a')
            for link in a_tag:
                try:
                    if link['href'].find('aliexpress') > 0:
                        # remove parent tag
                        link.decompose()
                except Exception as e:
                    print(f"aliexpress link no found {e}")

            #remove first img tag
            try:
                img = soup.find('img')
                img.decompose()
            except Exception as e:
                print(f"During remove first img from description {e}")

        #check all tags what containt text hello
        adminAccountIds = soup.find_all(text=re.compile('window.adminAccountId'))
        for adminAccountId in adminAccountIds:
            fixed_text = adminAccountId.replace(adminAccountId, '')
            adminAccountId.replace_with(fixed_text)

        return soup.prettify()

    def get_attr_id(self, attr_option):
        wcapi = self.credential()
        arrributes = wcapi.get("products/attributes").json()
        value = attr_option
        attr_id = 0
        for arrribute in arrributes:
            # check every attribute in dict
            if arrribute['name'] == value:
                attr_id = arrribute['id']
                break

        if attr_id == 0:
            data = {
                "name": value,
                "slug": "pa_" + str(value.lower()),
                "type": "select",
                "has_archives": True
            }

            wcapi.post("products/attributes", data).json()

        return attr_id

    def find_attr_id(self, param, attributes_ids):
        # function to find attribute id by attribute name
        # attributes neccecary to create product with attributes value. If you don't add additional attributes id the
        # product will added and attributes don't ne active
        # attributes_ids array contain all attributes id

        attribute_id = 0
        for attribute in attributes_ids:
            if attribute['id'] != 0:
                options = attribute['options']
                for option in options:
                    if option == param:
                        attribute_id = attribute['id']
                        break
        return attribute_id

    def find_img_for_attr(self, attributes):
        img_url = ''
        for attribute in attributes:
            if 'imageMainUrl' in attribute.keys():
                if attribute['imageMainUrl'] is not None:
                    img_url = attribute['imageMainUrl']
                    break
        return img_url

    def remove_not_used_attributes(self, attributes_ids):
        attributes_ids_array = []
        #remove attributes_ids and remove all elements with id = 0
        attributes_ids_array = []
        # remove attributes_ids and remove all elements with id = 0
        for attribute in attributes_ids:
            # check if id is 0
            if attribute['id'] != 0:
                # move to new array
                correct_option = []
                for options in attribute['options']:
                    name = self.attr_upper_case(options)
                    correct_option.append(name)
                attribute['options'] = correct_option
                attributes_ids_array.append(attribute)
        return attributes_ids_array

    def attr_upper_case(self, param):
        name_arr = []
        for word in param.split():
            if word[0].isupper():
                name_arr.append(word)
            else:
                name_arr.append(word.capitalize())
        name = " ".join(name_arr)
        return name

    def divide_chunks(self, attrribute_skuPropIds_arr, param):
        # looping till length l
        for i in range(0, len(attrribute_skuPropIds_arr), param):
            yield attrribute_skuPropIds_arr[i:i + param]

    def remove_from_site(self, param):
        wcapi = self.credential()
        wcapi.delete(f"products/{param}", params={"force": True}).json()

    def clen_description(self, full_description):
        # find all span tags and remove the style attribute
        soup = BeautifulSoup(full_description, 'html.parser')
        for span in soup.find_all('span'):
            span.attrs.pop('style', None)
        for span in soup.find_all('div'):
            span.attrs.pop('style', None)
        return soup.prettify()






