from flask import Flask, request, jsonify
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Users\eduar\AppData\Local\Programs\Tesseract-OCR'
from PIL import Image
import io

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'receipt' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['receipt']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        # Read the image via file.stream
        img = Image.open(file.stream)
        text = pytesseract.image_to_string(img)
        return jsonify({"extracted_text": text})

if __name__ == '__main__':
    app.run(debug=True)

import sys 
print("Python executable : ", sys.executable)