import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
import re
import cv2
from skimage.filters import threshold_local
import numpy as np
from pathlib import Path
import cv2

from utils import cropImage

def convert_circled_numerals_to_arabic(text):
    circled_numeral_mapping = {
        '①': '1', '②': '2', '③': '3', '④': '4',
        '⑤': '5', '⑥': '6', '⑦': '7', '⑧': '8',
        '⑨': '9', '⑩': '10', '⑪': '11', '⑫': '12',
        '⑬': '13', '⑭': '14', '⑮': '15', '⑯': '16',
        '⑰': '17', '⑱': '18', '⑲': '19', '⑳': '20'
    }
    return ''.join(circled_numeral_mapping.get(char, char) for char in text)

img = cv2.imread(".\\..\\Assets\\Receipt5.jpg") #FIXME #Connect this to img from JS
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

# Get the data using regex
product_regex = re.compile(r"\*?\s*(.*?)\s*(\d{13})[^\r\n]*?(\d+)")

# Extracting products
products = product_regex.findall(result_text)

# Display extracted products
for product in products:
    print(f"Product Name: {product[0]}, Barcode: {product[1]}, Price: {product[2]}")

### FIXME # Connect this to JS
