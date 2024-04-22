import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
from flask_cors import CORS
from flask import Flask, request, jsonify
import re
import cv2
from skimage.filters import threshold_local
import numpy as np
from pathlib import Path
import base64
import io
import json

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

app = Flask('Tesseract-OCR-API')
app.json.ensure_ascii = False
CORS(app)

@app.route("/upload", methods=["POST"])
def upload_image():
    # request is JSON
    if (not request.is_json):
        return jsonify({'status': 'error', 'message': 'Invalid request format'}), 400
    
    # # base64 images exist
    # if (not 'base64_image' in request.json):
    #     return jsonify({'status': 'error', 'message': 'No image provided'}), 400

    # result JSON
    response = []

    for base64_images in request.json:

        # decode Image
        img_stream = base64.b64decode(base64_images['base64_image'])
        # translate binary to np
        image_array = np.frombuffer(img_stream, dtype=np.uint8)
        # binary np to color np
        img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)  # cv2.IMREAD_COLOR order to read as color image
        
        # analyze
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

        # append extracted products
        result = []
        for product in products:
            result.append({'ProductName': product[0], 'Barcode': product[1], 'Price': product[2]})
        
        response.append(result)

    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000,debug=True)

### FIXME # Connect this to JS
