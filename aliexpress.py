__author__      = "Lubomir Vitol"
__copyright__   = "Copyright 2021, Planet Earth"

import json

from bs4 import BeautifulSoup as soup
from database import Database
from saveonwebsite import SaveOnWebsite
from utility import Utility as help_tool
import random
import requests


class AliexpressItemsParse:

    def __init__(self):
        self.db = Database().connect_to_db()

    #check if product_id exist in aliexpress_all_product_ids table
    def check_if_product_id_exist(self, product_id):
        db = self.db
        db = db['aliexpress_all_product_ids']
        product_id_exist = db.find_one({'product_id': product_id})
        if product_id_exist:
            return True
        else:
            return False

    #save parammeter in aliexpress_all_product_ids
    def save_all_product_ids(self, product_id, site_id):
        db = self.db
        #save product_id in aliexpress_all_product_ids
        db = db['aliexpress_all_product_ids']
        db.insert_one({'product_id': product_id, 'category_site_id': site_id })
        return True

    #load ali_id from aliexpress_sub_category
    def load_all_ali_ids(self):
        db = self.db
        db = db['aliexpress_sub_category']
        all_ali_ids = db.find({})
        return all_ali_ids

    #create url frm ali_id
    def create_url(self, ali_id, page=1):
        url = f"https://www.aliexpress.com/af/category/{ali_id}.html?ltype=affiliate&isFreeShip=y&isFavorite=y&SortType=default&page={page}&isrefine=y"
        return url

    def get_content(self, url):
        #get content from url and parse content by BeautifulSoup
        proxies_arr = help_tool().proxy_load()
        proxies = {'http': proxies_arr[random.randint(0, len(proxies_arr) - 1)]}
        headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
        response = requests.get(url, headers=headers, proxies=proxies)
        content = soup(response.text, 'html.parser')

        return content

    def parse_item(self, content, site_id):
        #parse content by beautifulsoup
        content = soup(content, 'html.parser')
        #find all script tag what cantain text window._isCrawler
        script_tag = content.find_all('script')
        for script in script_tag:
            if 'window._isCrawler' in script.text:
                #if script tag contain text window._isCrawler then return False
                #conver script text to json

                """
                Remove all the comments from the script
                """
                script_text = script.text.replace('\n', '').replace('\t', '').replace('\r', '')
                script_text = script_text.encode('ascii', 'ignore').decode('ascii')
                #print(script_text)

                # from window.runParams=
                #to ;window.runParams
                #find position window.runParams= in script text
                start_position = script_text.find('window.runParams = {"mods')
                print(start_position)
                #second position  ;window.runParams in script text
                end_position = script_text.find('window.runParams.csrfToken')
                print(end_position)
                #get text from start_position to end_position
                script_text = script_text[start_position:end_position]
                print(script_text)
                #script_text to json
                #script_text = json.loads(script_text)
                #print(script_text)


                break

        # items = content.find_all('div', class_='product-container')
        # for item in items:
        #     ids = item.find_all('a')
        #     for id in ids:
        #         product_id = id['href']
        #         print(f"Href = {product_id}")
                # #extract product_id from url beetween /item/ and .html
                # product_id = product_id.split('/')[-1].split('.')[0]
                # print(f"product_id {product_id}")
                # #check if product_id exist in aliexpress_all_product_ids table
                # if not self.check_if_product_id_exist(product_id):
                #     #save product_id in aliexpress_all_product_ids
                #     site_id_arr = []
                #     site_id_arr.append(site_id)
                #     self.save_all_product_ids(product_id, site_id_arr)
                # else:
                #     #update site_id in aliexpress_all_product_ids
                #     db = self.db
                #     db = db['aliexpress_all_product_ids']
                #     db.update_one({'product_id': product_id}, {'$push': {'category_site_id': site_id}})



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

    """
    AliexpressSubCategoryParse class contain parsers for category and subcategory
    Use once to parse all category and subcategory
    """
    # test = AliexpressSubCategoryParse()
    # #test.parse_full_parent_category()
    #
    # all_subcategoues = test.parse_sub_category()
    # test.check_sub_category(all_subcategoues)


    """
    class AliexpressItemsParse contain parsers for items
    code crawly all items in category and subcategory one by one and save in MongoDB
    """
    item = AliexpressItemsParse()
    ali_ids = item.load_all_ali_ids()
    for id in ali_ids:
        id['ali_id'] = "200214073"
        print(id['ali_id'])
        #for page in range(1,50):
        page = 1
        url = item.create_url(id['ali_id'],page)

        #make request to get content
        content = help_tool().request_by_url(url)
        site_id = id['site_id']
        #function to extract data from content
        item_data = item.parse_item(content,site_id)


        break
        #
