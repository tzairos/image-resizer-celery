from celery import Celery
import time
from PIL import Image

app = Celery('tasks',backend='redis://localhost', broker='redis://localhost')

@app.task
def add(x, y):
    time.sleep(10)
    return x + y

@app.task
def resize_image(image_path,image_name,image_ext):
    time.sleep(10)
    img = Image.open(image_path+image_name+image_ext)
    original_width=img.size[0]
    original_height=img.size[1]
    img = img.resize((int(original_width/2), int(original_height/2)), Image.ANTIALIAS)
    img.save(image_path+"thumbs/"+image_name+image_ext)
    return image_path+"thumbs/"+image_name+image_ext
