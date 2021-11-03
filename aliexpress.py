__author__      = "Lubomir Vitol"
__copyright__   = "Copyright 2021, Planet Earth"

from bs4 import BeautifulSoup as soup
from database import Database

from utility import Utility as help_tool
import random
import requests


class AliexpressItemsParse:

    def __init__(self):
        pass


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
        print(self.parse_subcategory(content))



    def parse_parent_category(self,content):
        res = soup(content,features="lxml")
        res = res.find_all("h3")
        category_id_arr = []
        category_anchor_arr = []
        # for h3 in res:
        #     category_val = h3.find('a')
        #     category_anchor_arr(category_val['data-spm-anchor-id'])
        #     category_id_arr.append(category_val['href'])
        # return dict(zip())

    def parse_subcategory(self, content):
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

        return category_name_arr

    def fix_category_url(self, category):
        f_index = category.find('category/')
        l_index = category.rfind("/")

        subcategory = category[f_index + len('category/'):l_index]
        return subcategory


if __name__ == '__main__':

    test = AliexpressSubCategoryParse()
    #test.test_db_save()
    test.subcategory()