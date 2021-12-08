#!/usr/bin/env python
# -*- coding: utf-8 -*-
__author__      = "Lubomir Vitol"
__copyright__   = "Copyright 2021, Planet Earth"
"""
File contain help functions
"""
import re
from googletrans import Translator
translator = Translator()
import json
import ast
from urllib.error import HTTPError
import random
import requests

class Utility:
    def __init__(self):
        pass
    #cut all no needed infor from img after parsing
    def cut_img(self,img_link):
        try:
            return img_link.replace('_50x50.jpg','')
        except Exception as e:
            return f"During imgage {img_link} upon error {e}"


    #load proxy from db or file
    def proxy_load(self):
        return ["159.203.31.27:8118","88.198.24.108:3128","5.252.161.48:3128","163.172.157.7:80","175.184.232.74:8080","193.57.43.193:81","51.195.201.93:80","143.110.151.242:3128","51.79.220.22:8080", "51.79.220.50:8080", "185.49.69.134:8888", "206.253.164.198:80"]

    def load_subcategory_id(self):
        pass

    def translate(self,value, all_translate_values):
        if self.has_cyrillic(value)==True:
            return self.find_translate(all_translate_values,value)
        else:
            return value


    def has_cyrillic(self,text):
        return bool(re.search('[а-яА-Я]', text))


    def save_translate_file(self,dict):
        f = open("translate_file.txt", "w")
        f.write(str(dict))
        f.close()

    def read_translate_file(self):
        # reading the data from the file
        with open('translate_file.txt', encoding="utf-8") as f:
            data = f.read()

        res = ast.literal_eval(data)
        return res

    def find_translate(self,translate_dic,value):
        translated_value = ''
        for key, val in translate_dic.items():
            if key==value.strip():
                translated_value = val
                break
        if len(translated_value) == 0:
            try:
                print(f'value {value}')
                translated_value = translator.translate(value, dest='en').text
                translate_dic[value] = translated_value
            except Exception as e:
                print(e)
        return translated_value

    def fix_video_url(self, param):
        position = param.rfind('`')
        if position > 0:
            video_url = param[0:position]
        else:
            video_url = param

        video_embed = "[embed]" + str(video_url) + "[/embed]"
        return video_embed



    def request_by_url(self,url):
        proxy_arr =  self.proxy_load()
        try:
            proxies = {'http': proxy_arr[random.randint(0, len(proxy_arr) - 1)]}
            print(f"Request with proxy {proxies}")
            # prepeare to request
            session = requests.Session()
            session.cookies.set('Host', 'aliexpress.com', domain='.aliexpress.com', path='/')
            session.cookies.set('region', 'US', domain='.aliexpress.com', path='/')
            headers = {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.5"
            }

            # set cookies, VERY IMPORTANT
            cookies = {'aep_usuc_f': 'region=US&site=glo&b_locale=en_US&c_tp=USD', 'intl_locale': 'en_US',
                       'xman_us_f': 'x_l=0&x_locale=en_US'}
            response = session.get(url, timeout=20, headers=headers, proxies=proxies, cookies=cookies)
            print(response.status_code)
            if response.status_code == 200:
                print('Request Success')
                return response.content


        except HTTPError as http_err:
            print(f'HTTP error occurred: {http_err}')  # Python 3.6
        except Exception as err:
            print(f'Other error occurred: {err}')  # Python 3.6

    def convert_array_to_dict(self, product_id_arr, site_id):
        site_ids = []
        site_ids.append(site_id)
        product_id_list = []
        #add every product id to dict
        for product_id in product_id_arr:
            product_id_dict = {}
            product_id_dict['product_id'] = product_id
            product_id_dict['site_id'] = site_ids
            product_id_dict['status'] = 0

            #add to list
            product_id_list.append(product_id_dict)
        return product_id_list



    def get_url_by_id(self, param):
        url = 'https://www.aliexpress.com/item/' +param + '.html'
        return url

    def price_fix(self, param):
        # calculate price with 100% profit
        price = float(param)
        price = price * 2
        price = round(price, 2)
        return price




    """
    Checker section
    """
    async def proxy_load_checkerd(self):
        return ["213.142.134.79:808","103.216.82.37:6666","46.4.96.137:8080","47.241.19.33:8088","206.253.164.101:80","45.199.148.36:80","51.195.201.93:80","143.110.151.242:3128","51.79.220.22:8080", "51.79.220.50:8080", "185.49.69.134:8888", "206.253.164.198:80"]



    async def get_url_by_id_checker(self, param):
        url = f"https://www.aliexpress.ru/item/{str(param) }.html?c_tp=RUB&region=UK&b_locale=en_US"
        return url

    async def request_by_url_checker(self, url):
        proxy_arr = await self.proxy_load_checkerd()
        try:
            proxies = {'http': proxy_arr[random.randint(0, len(proxy_arr) - 1)]}
            print(f"Request with proxy {proxies}")
            # prepeare to request
            session = requests.Session()
            session.cookies.set('Host', 'aliexpress.com', domain='.aliexpress.com', path='/')
            session.cookies.set('region', 'US', domain='.aliexpress.com', path='/')
            headers = {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.5"
            }

            # set cookies, VERY IMPORTANT
            cookies = {'aep_usuc_f': 'region=US&site=glo&b_locale=en_US&c_tp=USD', 'intl_locale': 'en_US',
                       'xman_us_f': 'x_l=0&x_locale=en_US'}
            response = session.get(url, timeout=20, headers=headers, proxies=proxies, cookies=cookies)
            print(response.status_code)
            if response.status_code == 200:
                print('Request Success')
                return response.content


        except HTTPError as http_err:
            print(f'HTTP error occurred: {http_err}')  # Python 3.6
        except Exception as err:
            print(f'Other error occurred: {err}')  # Python 3.6

    def tranlsate_text(self, param):
        res = translator.translate(param, dest='en').text
        return res



