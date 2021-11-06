__author__      = "Lubomir Vitol"
__copyright__   = "Copyright 2021, Planet Earth"
"""

Class check every item have some changes
If changes available  then change data by product ID
Read data from aliexpress_all_product_id DB 

"""
from datetime import datetime
from database import Database
from utility import Utility

class Checker:
    def __init__(self):
        self.db = Database()
        self.utility = Utility()

    #function to add fiels is_checked to DB
    def add_is_checked(self):
        self.db.add_is_checked()


    def load_is_checked(self):
        self.db.load_is_checked()

    def start(self):
        ids = self.load_is_checked()
        for id in ids:
            #request by product ID
            print(id['product_id'])
            url = self.utility.get_url_by_id(id['product_id'])
            response = self.utility.request_by_url(url)
            break

if __name__ == '__main__':
    checker = Checker()
    checker.add_is_checked()