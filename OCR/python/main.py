import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
import re
import cv2
from skimage.filters import threshold_local
import numpy as np
from pathlib import Path
import cv2

from utils import cropImage

##### CHANGED PART ######
def parse_product_data(text):
    lines = text.split('\n')
    products = []
    current_product = {}
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
        
        if '軽' in line:
            if '個' in line:
                quantity_part, price_part = line.split('個')
                quantity = quantity_part.strip()
                price = price_part.split()[0].strip()
                
                if current_product.get('productName'):
                    quantity = quantity.split(" ")[-1]
                    current_product['quantity'] = int(quantity)
                    current_product['pricePerPiece'] = int(int(price) / int(quantity))
                    products.append(current_product)
                    current_product = {}
            else:
                parts = line.split()
                index = parts.index('軽')
                if index > 0 and parts[index-1].isdigit():
                    price = parts[index-1]
                    product_name = ' '.join(parts[:index-1])
                    if product_name: 
                        current_product['productName'] = product_name
                        current_product['quantity'] = 1
                        current_product['pricePerPiece'] = price
                        products.append(current_product)
                        current_product = {}
        else:
            current_product['productName'] = line
        
        
    return products
#########################

def convert_circled_numerals_to_arabic(text):
    circled_numeral_mapping = {
        '①': '1', '②': '2', '③': '3', '④': '4',
        '⑤': '5', '⑥': '6', '⑦': '7', '⑧': '8',
        '⑨': '9', '⑩': '10', '⑪': '11', '⑫': '12',
        '⑬': '13', '⑭': '14', '⑮': '15', '⑯': '16',
        '⑰': '17', '⑱': '18', '⑲': '19', '⑳': '20'
    }
    return ''.join(circled_numeral_mapping.get(char, char) for char in text)

img = cv2.imread(".\\..\\Assets\\Receipt13.jpg") #FIXME #Connect this to img from JS
bw_image= cropImage(img)
pil_image = Image.fromarray(bw_image)
enhancer = ImageEnhance.Contrast(pil_image)
img_enhanced = enhancer.enhance(2.0)  # Increase contrast
img_enhanced = img_enhanced.filter(ImageFilter.MedianFilter())  # Reduce noise

# OCR configuration for Japanese text
config_japanese = '--oem 1 --psm 6'
text_japanese = pytesseract.image_to_string(img_enhanced, lang='jpn', config=config_japanese)
print(text_japanese)

# Convert circled numerals to numerals in the OCR output
result_text = convert_circled_numerals_to_arabic(text_japanese)
print(result_text)

##### CHANGED PART ######
product_list = parse_product_data(result_text)
for product in product_list:
    print(product)
#########################

### FIXME # Connect this to JS
