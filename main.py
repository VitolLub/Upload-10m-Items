# This is a sample Python script.
from urllib.error import HTTPError

import content as content
import lxml.html
import asyncio
import requests
from bs4 import BeautifulSoup as soup
from requests_html import AsyncHTMLSession
import pyppdf.patch_pyppeteer
from browser import Browser
# Consumer key: ck_34e7f3f1e99a0b0911283a82b61280bbe422d789
# Consumer secret: cs_e8838c981a6b91b89cbdfc8364152a569740e87d
import mechanize
from bs4 import BeautifulSoup as soup
import requests
from requests_html import AsyncHTMLSession
import random
#import pyppdf.pyppeteer
from utility import Utility as help_tool


class AliParserItemIDs:
    def __init__(self,url):
        self.url = url

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
            print(response.content)
            self.parse_content(response.content)

        except HTTPError as http_err:
            print(f'HTTP error occurred: {http_err}')  # Python 3.6
        except Exception as err:
            print(f'Other error occurred: {err}')  # Python 3.6
        else:
            print('Success!')


    def parse_content(self,content):
        res = soup(content, features="lxml")

        print(self.img_parse(res))
        print(self.title_parse(res))
        print(self.price_parse(res))
        print(self.discount_parse(res))
        #print(self.description_parse(res))


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
            description = res.find_all("")
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


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    url = 'https://aliexpress.com/item/1005001967669349.html'
    start = AliParserItemIDs(url)
    start.request_by_url()


