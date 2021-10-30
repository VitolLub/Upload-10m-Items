# This is a sample Python script.
import time
from urllib.error import HTTPError

import content as content
import lxml.html
import asyncio
import requests
from bs4 import BeautifulSoup as soup
from requests_html import AsyncHTMLSession
import pyppdf.patch_pyppeteer
from browser import Browser

import mechanize
from bs4 import BeautifulSoup as soup
import requests
from requests_html import AsyncHTMLSession
import random
import json
#import pyppdf.pyppeteer
from utility import Utility as help_tool
from saveonwebsite import SaveOnWebsite

class AliParserItemIDs:
    def __init__(self,url):

        self.url = url

        #list of attributes for rasing
        self.color_attr = 'Product_SkuValuesBar__container__6ryfe'
        self.lenght_attr = 'ali-kit_Base__base__1odrub ali-kit_Base__default__1odrub ali-kit_Label__label__1n9sab ali-kit_Label__size-s__1n9sab'


    #
    def parse_subcategory(self,content):
        res = soup(content, features="lxml")
        res = res.find_all("a")
        subcategory_arr = []
        for category in res:
            category = category['href']
            if category.find('category/') > 0:
                # f_index = category.find('category/')
                # l_index = category.rfind("/")
                # subcategory = category[f_index + len('category/'):l_index]
                subcategory_arr.append(category)

        print(subcategory_arr)
        print(len(subcategory_arr))
    #load every category id to parse subcatecory by subcatecory
    def load_category_id(self):
        return help_tool().load_subcategory_id()

    #load data by url
    #prxy include
    def request_by_url(self):
        proxy_arr = help_tool().proxy_load()
        try:
            proxies = {'http': proxy_arr[random.randint(0, len(proxy_arr) - 1)]}

            #prepeare to request
            session = requests.Session()
            headers = {'user-agent': 'my-app/0.0.1'}
            #set 5s. timeout
            response = session.get(url, timeout=5, headers=headers, proxies=proxies)
            # print(session.cookies.get_dict())

            #print(response.content)

            #return self.parse_subcategory(response.content)
            return self.parse_content(response.content)

        except HTTPError as http_err:
            print(f'HTTP error occurred: {http_err}')  # Python 3.6
        except Exception as err:
            print(f'Other error occurred: {err}')  # Python 3.6
        else:
            print('Success!')


    def parse_content(self,content):
        res = soup(content, features="lxml")

        # self.title_parse(res)
        # self.video_parse(res)
        # self.img_parse(res)
        # self.price_parse(res)
        # self.discount_parse(res)
        # self.description_parse(res)
        # self.raiting_parse(res)
        # self.product_attributes(res)
        # self.orders_count(res)

        return self.read_javascript(res)

    # parse images from single page
    def img_parse(self, res):
        img_arr = []
        img_serch_block = res.find_all("img", {'loading': 'eager', 'class': 'ali-kit_Image__image__1jaqdj'})
        for im_block in img_serch_block:
            find_img = str(im_block).find('https://ae04')

            # receive full img link
            if find_img > 0:
                img = help_tool().cut_img(im_block['src'])
                img_arr.append(img)

        #retrun full list of imgs
        return img_arr

    #parse title from single page
    def title_parse(self, res):
        try:
            title = res.find("title")
            return title.getText()
        except Exception as e:
            return (f"During title parsing upon error {e}")

    #parse descriptio
    def description_parse(self, res):
        try:
            descriptions = res.find("div",{'class':'ProductDescription-module_content__1xpeo'})
            return descriptions.getText()
        except Exception as error:
            return f"During parse description upon eror {error}"

    #price parse
    def price_parse(self,res):
        try:
            #product-price-current
            curre_price = res.find_all("span", {'class':'product-price-current'})
            for pri in curre_price:
                 return pri.getText()
        except Exception as e:
            return f"During parse price upon error {e}"

    #parse discount
    def discount_parse(self, res):
        try:
            # product-price-current
            curre_discount = res.find_all("span", {'class': 'product-discount'})
            for discount in curre_discount:
                return discount.getText()
        except Exception as e:
            return f"During parse discount upon error {e}"

    #parse star raiting
    def raiting_parse(self, res):

        try:
            # product-price-current
            curre_raiting = res.find_all("div", {'class': 'Product_Stars__rating__tfb6k'})
            for raiting in curre_raiting:
                return raiting.getText()
        except Exception as e:
            return f"During parse raiting upon error {e}"

    def product_attributes(self, res):
        try:
            arrtibute_arr = []
            title_arr = []
            lenght_attr = []

            img_arr = []
            alt_arr = []
            # parse title of attributes
            curre_product_attributes = res.find_all("div", {'class': 'Product_Sku__container__1f7i6'})
            #print(curre_product_attributes)

            # parse lenght attr
            for lenght_search in curre_product_attributes:
                lenght_attr_list = lenght_search.find_all("span", {'class':'ali-kit_Label__size-s__1n9sab'})
                for lengh_value in lenght_attr_list:
                    print(lengh_value)
                    lenght_attr.append(lengh_value.getText())

            #firnd attribute title
            for attr_title in curre_product_attributes:
                title_res = attr_title.find_all("div",{'class':'Product_SkuItem__title__rncuf'})
                for item_attr_name in title_res:
                    title_arr.append(item_attr_name.getText())

            # parse color attr
            for product_attributes in curre_product_attributes:
                product_attributes = product_attributes.find_all("div", {'class': self.color_attr})
                for value in product_attributes:
                    alt_img = value.find_all("img")
                    for values in alt_img:
                        try:
                            img_arr.index(values['src'])
                        except Exception as e:
                            img_arr.append(values['src'])
                            alt_arr.append(values['alt'])


            #convers arrays to dict
            color_arr = dict(zip(alt_arr, img_arr))
            attributes_titles = title_arr
            return attributes_titles, color_arr,lenght_attr

        except Exception as e:
            return f"During parse product attributes upon error {e}"

    def video_parse(self, res):
        try:
            video_link = res.find("video")
            return video_link['src']
        except:
            return False

    def orders_count(self, res):
        order_count = res.find_all("span",{'class':'ali-kit_Label__label__1n9sab ali-kit_Label__size-s__1n9sab'})
        for order_value in order_count:
            print(order_value.getText())

    def read_javascript(self, res):
        #
        full_script_data = res.find("script",{'id':'__AER_DATA__'})
        res = full_script_data.getText()
        #load full js
        y = json.loads(res)
        #index 4 - store info
        id = y['widgets'][0]['children'][7]['children'][0]['props']['id']

        gallery = y['widgets'][0]['children'][7]['children'][0]['props']['gallery']

        original_imgs_arr = []
        preview_imgs_arr = []
        video_arr = []
        for images in gallery:
            original_imgs_arr.append(images['imageUrl'])
            preview_imgs_arr.append(images['previewUrl'])
            if images['videoUrl'] is not None:
                video_arr.append(images['videoUrl'])

        name = y['widgets'][0]['children'][7]['children'][0]['props']['name']

        description = y['widgets'][0]['children'][7]['children'][0]['props']['description']

        propertyList = y['widgets'][0]['children'][7]['children'][0]['props']['skuInfo']['propertyList']

        price_list = y['widgets'][0]['children'][7]['children'][0]['props']['skuInfo']['priceList']

        tradeCount = y['widgets'][0]['children'][7]['children'][0]['props']['tradeInfo']['tradeCount']

        likes  = y['widgets'][0]['children'][7]['children'][0]['props']['likes']

        reviews = y['widgets'][0]['children'][7]['children'][0]['props']['reviews']

        discount = y['widgets'][0]['children'][7]['children'][0]['props']['price']['discount']

        return id,original_imgs_arr,preview_imgs_arr,video_arr,name,description,propertyList,price_list,tradeCount,likes,reviews,discount
        #print(y['widgets'][0]['children'][7]['children'][0]['props'])

# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    url = 'https://aliexpress.com/item/1005002001535547.html'
    start = AliParserItemIDs(url)
    res = start.request_by_url()
    #print(res)


    save_class = SaveOnWebsite(res)
    after_save = save_class.save()
    #print(after_save)

    #save_class.delete_product(623519)

    # print(after_save['id'])
    # save_class.add_attributes(after_save['id'])
    #
    # time.sleep(500)
    # save_class.delete_product(after_save['id'])



