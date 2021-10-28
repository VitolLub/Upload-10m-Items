""""""
"""
Class describe login and nethods to save data on veblite - https://newdropship.a2hosted.com/

"""


class SaveOnWebsite:

    def __init__(self,title,price,discount,raiting,description,img,product_attributes,video):
        self.title = title
        self.price = price
        self.discount = discount
        self.raiting = raiting
        self.description = description
        self.img = img
        self.video = video
        self.product_attributes = product_attributes


    #test connet
    def connet_ping(self):
        pass

    #save data on website
    def save(self):
        pass