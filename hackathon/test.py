import pytesseract
from PIL import Image

# 画像ファイルを開く
img = Image.open('C:\\Users\\eduar\\Videos\\React_Native\\hackathon2024April\\hackathon\\Assets\\Receipt1.jpg')

# # Tesseractのパスを設定（環境によって異なる場合があります）
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# 日本語でOCRを実行
text = pytesseract.image_to_string(img, lang="jpn")

print(text)