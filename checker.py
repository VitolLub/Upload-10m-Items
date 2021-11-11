__author__      = "Lubomir Vitol"
__copyright__   = "Copyright 2021, Planet Earth"

import json

"""

Class check every item have some changes
If changes available  then change data by product ID
Read data from aliexpress_all_product_id DB 

"""
from woocommerce import API
from datetime import datetime
from database import Database
from utility import Utility
import asyncio
from bs4 import BeautifulSoup as soup

class Checker:
    def __init__(self):
        self.db = Database()
        self.utility = Utility()

    #function to add fiels is_checked to DB
    async def add_is_checked(self, id:int):
        await self.db.add_is_checked(id)

    async def credentials(self):
        wcapi = API(
            url="https://newdropship.a2hosted.com/",
            consumer_key="ck_34e7f3f1e99a0b0911283a82b61280bbe422d789",
            consumer_secret="cs_e8838c981a6b91b89cbdfc8364152a569740e87d",
            timeout=40
        )

        return wcapi

    async def load_is_checked(self):
        return await self.db.load_is_checked()

    async def start(self):
        ids = await self.load_is_checked()
        for id in ids:
            try:
                #request by product ID
                url = await self.utility.get_url_by_id_checker(id['product_id'])

                response = await self.utility.request_by_url_checker(url)
                print(f"Start parse data from response {id['site_product_id']}")


                # function to extract  json data from string
                extract_json_data_response = await self.extract_json_data_from_response(response)

                """
                function responsible for data from website what we will be compare with data from aliexpress request
                """
                # function to load data from web site by product ID
                extract_site_product_data = await self.load_data_by_id_checker(int(id['site_product_id']))

                # function to update attributes and values
                update_attributes_arr = await self.update_attributes(extract_json_data_response, extract_site_product_data)

                # update attributes and values and return array of attributes and values


                await self.update_request(update_attributes_arr,int(id['site_product_id']))

                # function to update is_checked to 1 in DB
                await self.add_is_checked(int(id['site_product_id']))
            except Exception as e:
                print(f"start error {e}")



    async def load_data_by_id_checker(self, site_product_id: int)->list:
        wcapi = await self.credentials()
        res = wcapi.get(f"products/{str(site_product_id)}/variations").json()
        return res


    async def extract_json_data_from_response(self, response)->list:
        try:
            #soup string to lxml
            res = soup(response, features="lxml")
            full_script_data = res.find("script", {'id': '__AER_DATA__'})
            res = full_script_data.getText()

            # string to json
            y = json.loads(res)
            price_list = y['widgets'][0]['children'][7]['children'][0]['props']['skuInfo']['priceList']
            return price_list
        except Exception as e:
            print(f"extract_json_data_from_response error {e}")

    async def update_attributes(self, extract_json_data_response, extract_site_product_data)->list:
        updated_product_data_arr = []
        for element in extract_site_product_data:
            for key, value in element.items():
                if key == 'sku':
                    for site_element in extract_json_data_response:
                        for site_key, site_value in site_element.items():
                            if site_value == value:
                                element['regular_price'] = await self.fix_price(site_element['amount']['value'])  #
                                element['sale_price'] = await self.fix_price(site_element['activityAmount']['value'])
                                element['price'] = await self.fix_price(site_element['activityAmount']['value'])
                                element['stock_quantity'] = site_element['availQuantity']
                                if site_element['availQuantity'] > 0:
                                    element['manage_stock'] = True
                                    element['stock_status'] = 'instock'
                                    element['purchasable'] = True
                                    element['status'] = 'publish'
                                if site_element['availQuantity'] == 0:
                                    element['manage_stock'] = False
                                    element['stock_status'] = 'outofstock'
                                    element['purchasable'] = False
                                    element['status'] = 'private'
                                updated_product_data_arr.append(element)
        return updated_product_data_arr

    async def fix_price(self, param):
        # calculate price with 100% profit
        price = float(param)
        price = price * 2
        price = round(price, 2)
        return price

    async def update_request(self, update_attributes_arr, product_id:int):
        try:
            data = {
                "update": update_attributes_arr
            }
            wcapi = await self.credentials()
            res = wcapi.post(f"products/{product_id}/variations/batch", data).json()
        except Exception as e:
            print(e)



if __name__ == '__main__':
    checker = Checker()
    while True:
        loop = asyncio.get_event_loop()
        loop.run_until_complete(checker.start())
