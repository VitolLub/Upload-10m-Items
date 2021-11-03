__author__      = "Lubomir Vitol"
__copyright__   = "Copyright 2021, Planet Earth"

from bs4 import BeautifulSoup as soup
from database import Database
from saveonwebsite import SaveOnWebsite
from utility import Utility as help_tool
import random
import requests


class AliexpressItemsParse:

    def __init__(self):
        self.db = Database().connect_to_db()


    def request_by_url(self,url):

        pass


    def test_db_save(self):
        Database().save_to_db()


class AliexpressSubCategoryParse:
    def __init__(self):
        pass

    def subcategory(self):
        url = "https://www.aliexpress.com/all-wholesale-products.html?spm=a2g0o.best.16005.1.6c2c2c25laMEvr"
        content = help_tool().request_by_url(url)
        return content


    #save category parent in MongoDb to reice parent category id from site
    def save_parent_category(self,parent_category):
        Database().save_parent_category(parent_category)


    #parse full parent parent_categoty
    def parse_full_parent_category(self):
        parent_category = self.parse_parent_category()
        full_parent_cat_arr = []
        for category in parent_category:
            parent_category_data = SaveOnWebsite().save_parent_category(category)
            category['site_parent_cat_id'] = parent_category_data['create'][0]['id']

            full_parent_cat_arr.append(category)
            # save data in to DBs
        self.save_parent_category(full_parent_cat_arr)


    def parse_parent_category(self):
        content = self.subcategory()
        res = soup(content,features="lxml")
        res = res.find_all("h3")
        parent_categoryes_arr = []
        for parent in res:
            parent_dict = {}
            parent_cat_name = parent.getText()
            parent_cat = parent.find("a")
            parent_cat_id = self.fix_category_url(parent_cat['href'])

            parent_dict['name'] = parent_cat_name.strip()
            parent_dict['ali_parent_cat_id'] = parent_cat_id.strip()
            parent_categoryes_arr.append(parent_dict)
        print(parent_categoryes_arr)
        return parent_categoryes_arr

    def parse_sub_category(self):
        content = self.subcategory()
        subcategory_id_arr = []
        category_name_arr = []

        res = soup(content, features="lxml")
        res_div  = res.find_all("div",{"class":"item util-clearfix"})
        for div in res_div:
            res_h3 = div.find_all("h3")
            for h3 in res_h3:
                h3 = h3.find('a')
                ali_parent = self.fix_category_url(h3['href'])
            res_li = div.find_all("li")
            for li in res_li:
                res_a = li.find_all("a")
                for category in res_a:
                    subcategory_dict = {}
                    category_name = category.getText()
                    category = category['href']

                    if category.find('category/') > 0:
                        subcategory = self.fix_category_url(category)
                        subcategory_dict['name'] = category_name
                        subcategory_dict['ali_id'] = subcategory
                        subcategory_dict['ali_parent'] = ali_parent
                        subcategory_dict['is_parent'] = 0
                        subcategory_dict['site_id'] = ""
                        subcategory_dict['site_parent'] = ""

                        category_name_arr.append(subcategory_dict)
        print(category_name_arr)
        return category_name_arr

    def fix_category_url(self, category):
        f_index = category.find('category/')
        l_index = category.rfind("/")

        subcategory = category[f_index + len('category/'):l_index]
        return subcategory



    #function do check all category in DB and save new subcategory
    def check_sub_category(self,all_subcategoues):
        index = 1
        for subcategory in all_subcategoues:
            #check parend category in DB
            print(f"Subcategory  {index}")
            if index > 207:
                print(subcategory)
                print(subcategory['ali_parent'])
                parent_category = Database().check_parent_category(subcategory['ali_parent'])
                subcategory['site_parent'] = parent_category['site_parent_cat_id']
                print(subcategory)
                subcategory_data = SaveOnWebsite().save_sub_category(subcategory)
                print("Response after save subcategory on website ")

                #save data in to DBs
                #function to save subcategory in DB
                subcategory['site_id'] = subcategory_data['create'][0]['id']
                print(f"Save full subcategory Data in DB")
                print(subcategory)
                Database().save_sub_category(subcategory)
            index += 1






if __name__ == '__main__':

    test = AliexpressSubCategoryParse()
    #test.parse_full_parent_category()

    all_subcategoues = test.parse_sub_category()
    test.check_sub_category(all_subcategoues)
