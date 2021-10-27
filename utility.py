"""
File contain help functions
"""

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
        return ["51.79.220.22:8080", "51.79.220.50:8080", "185.49.69.134:8888", "206.253.164.198:80"]

    def load_subcategory_id(self):
        pass
