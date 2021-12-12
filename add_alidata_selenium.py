#!/usr/bin/env python
# -*- coding: utf-8 -*-
__author__      = "Lubomir Vitol"
__copyright__   = "Copyright 2021, Planet Earth"


# collect selenium librairies
import pyautogui
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import time
from selenium.webdriver.support import expected_conditions as EC
from database import Database

def goto_website():
    # go to website
    chrome_options = Options()
    #chrome_options.add_argument('headless')

    prefs2 = {"profile.default_content_setting_values.notifications": 2}
    chrome_options.add_experimental_option("prefs", prefs2)
    prefs = {"profile.managed_default_content_settings.images": 2}
    chrome_options.add_experimental_option("prefs", prefs)
    chrome_options.add_argument(
        "user-data-dir=C:\\Users\\Vitol\\AppData\\Local\\Google\\Chrome\\User Data\\Default")  # Path to your chrome profile
    driver = webdriver.Chrome('chromedriver.exe', options=chrome_options)

    driver.get("http://195.181.243.90/wp-admin")

    time.sleep(2)
    # set login data by name
    driver.find_element(By.XPATH, "//input[@name='log']").send_keys("admin")
    driver.find_element(By.XPATH, "//input[@name='pwd']").send_keys("8786727a8682a9bf")
    time.sleep(2)
    # click login button
    driver.find_element(By.XPATH, "//input[@id='wp-submit']").click()


    return driver


def get_data_fromdb():
    # get data from database
    db = Database()
    product_id,product_sku = db.get_data()
    return product_id,product_sku


def update_alidrop_status(param):
    # update alidrop status
    db = Database()
    db.update_alidrop_status(param)


def edit_post(driver):
    #load data from DB
    id_arr, item_arr = get_data_fromdb()
    # wait until the page is loaded
    for index, elem in enumerate(id_arr):
        time.sleep(2)
        # go to link
        #driver.set_page_load_timeout(20)
        print(item_arr[index])
        product_id = str(item_arr[index])
        product_id = product_id.strip()
        driver.get("http://google.com/")
        pyautogui.press('enter')
        driver.get(f"http://195.181.243.90/wp-admin/post.php?post={product_id}&action=edit")

        time.sleep(20)
        # delete element id="wp-content-wrap"

        #element = driver.find_element(By.XPATH, "//div[@id='wp-content-wrap']")
        driver.execute_script("""
        var element = document.getElementById("wp-content-wrap");
        element.parentNode.removeChild(element);
        """)
        driver.execute_script("""
           var element = document.getElementById("_custom_metabox_product_options");
           element.parentNode.removeChild(element);
           """)
        driver.execute_script("""
           var element = document.getElementById("submitdiv");
           element.parentNode.removeChild(element);
           """)
        driver.execute_script("""
           var element = document.getElementById("product_catdiv");
           element.parentNode.removeChild(element);
           """)
        driver.execute_script("""
               var element = document.getElementById("tagsdiv-product_tag");
               element.parentNode.removeChild(element);
               """)
        driver.execute_script("""
                   var element = document.getElementById("product_branddiv");
                   element.parentNode.removeChild(element);
                   """)
        driver.execute_script("""
                   var element = document.getElementById("postimagediv");
                   element.parentNode.removeChild(element);
                   """)
        driver.execute_script("""
                       var element = document.getElementById("woocommerce-product-images");
                       element.parentNode.removeChild(element);
                       """)
        driver.execute_script("""
                           var element = document.getElementById("side-sortables");
                           element.parentNode.removeChild(element);
                           """)
        driver.execute_script("""
                               var element = document.getElementById("postexcerpt");
                               element.parentNode.removeChild(element);
                               """)




        # click on the button
        driver.find_element(By.XPATH, "//li[@class='adswsupplier_options adswsupplier_tab hide_if_grouped hide_if_virtual hide_if_external']").click()
        time.sleep(10)
        #set data for id _productUrl
        driver.find_element(By.XPATH,"//input[@name='_productUrl']").send_keys(f"https://aliexpress.com/item/{str(elem)}.html")
        time.sleep(2)
        #click save button
        driver.find_element(By.XPATH,"//button[@class='button save_adswsupplier button-primary']").click()

        update_alidrop_status(item_arr[index])
    edit_post(driver)



# id  wp-content-wrap
# id _custom_metabox_product_options
# id submitdiv
# id product_catdiv
# id tagsdiv-product_tag
# id product_branddiv
# id postimagediv
# id woocommerce-product-images
# id side-sortables
# id postexcerptUOk
#
# id woocommerce-product-data




if __name__ == '__main__':
    while True:
        try:
            driver = goto_website()
            # edit post function
            edit_post(driver)
        except Exception as e:
            print(e)

    # product_sku, product_id = get_data_fromdb()
    # print(product_sku)
    # print(product_id)



