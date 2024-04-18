from PIL import Image
import pytesseract

img = Image.open('C:\\Users\\eduar\\Videos\\React_Native\\hackathon2024April\\hackathon\\Assets\\Receipt1.jpg')
text = pytesseract.image_to_string(img)
print(text)
# Make sure to adjust the path to an image on your system
# text = pytesseract.image_to_string(Image.open('C:\\Users\\eduar\\Videos\\React_Native\\hackathon2024April\\hackathon\\Assets\\Receipt1.jpg'))
# print(text)
