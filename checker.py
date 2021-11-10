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
    def add_is_checked(self):
        self.db.add_is_checked()

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
        print(ids)
        for id in ids:

            #request by product ID
            print(id)
            url = await self.utility.get_url_by_id_checker(id['product_id'])
            print(url)
            response = await self.utility.request_by_url_checker(url)
            print(f"Start save data {id['site_product_id']}")


            # function to extract  json data from string

            extract_json_data = await self.extract_json_data_from_response(response)
            # """
            # function responsible for data from website what we will be compare with data from aliexpress request
            # """
            # # function to load data from web site by product ID
            # site_product_data = await self.load_data_by_id_checker(id['site_product_id'])
            #
            # #function to parse price, stock, weight, length, width, height from site
            # data_from_site = await self.parse_data_checker(site_product_data)

            break

    async def load_data_by_id_checker(self, site_product_id: int) -> object:
        wcapi = await self.credentials()

        res = wcapi.get(f"products/{str(site_product_id)}/variations").json()
        return res

    async def parse_data_checker(self, site_product_data):
        # parse json
        print(site_product_data[0])

    async def extract_json_data_from_response(self, response):
        #soup string to lxml
        res = soup(response, features="lxml")
        full_script_data = res.find("script", {'id': '__AER_DATA__'})
        res = full_script_data.getText()


        # string to json

        y = json.loads(res)

        price_list = y['widgets'][0]['children'][7]['children'][0]['props']['skuInfo']['priceList']
        print(price_list)


if __name__ == '__main__':
    checker = Checker()
    loop = asyncio.get_event_loop()
    loop.run_until_complete(checker.start())