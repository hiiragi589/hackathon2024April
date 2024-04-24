# hackathon2024April
Mobile App Development

### Edo's Note (per April 19th, 21:58)

Please add your venv directly under OCR folder

What you need to install in your venv : 
- pip install Flask
- pip install pytesseract
- pip install opencv-python
- pip install scikit-image
- pip install pyautogui

### Nishi's Note (per April 22th)

In addition to the above, What you need to install in your venv : 
- pip install flask-cors
- pip install opencv-contrib-python

And if you get some trouble in tesseract, you check [here](https://qiita.com/henjiganai/items/7a5e871f652b32b41a18).

receipt analyzer passed the local check!

How to try the receipt analyzer
1. chenge directory to hackathon2024April/OCR
1. excute ```myvenv\Scripts\activate```
    1. ```cd pythonAPI``` (**change Directory Name!!**)
    1. ```python .\analyzer.py```
1. open another terminal and ```curl -X POST -H "Content-Type: application/json" -d @(???)\hackathon2024April\OCR\Assets\Receipt6.json http://localhost:5000/upload```