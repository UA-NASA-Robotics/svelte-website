from PIL import Image
import os

CWD = os.path.dirname(os.path.realpath(__file__))  # get the directory of the script


maxImgWidth = 1920
maxImgHeight = None
excludes = []

# read the properties file
try:
    with open(os.path.join(CWD, "0ResizeProperties.csv"), "r") as f:
        properties = f.readlines()
        for line in properties:
            line = line.strip()
            print(line)
            activeChars = line.split("#")[0]  # remove comments
            print(activeChars)
            if activeChars == "":
                continue
            if "!" in activeChars:
                if activeChars[1:].split(":")[0] == "maxImgWidth":
                    maxImgWidth = int(activeChars.split(":")[1])
                    maxImgHeight = None
                elif activeChars[1:].split(":")[0] == "maxImgHeight":
                    maxImgHeight = int(activeChars.split(":")[1])
                    maxImgWidth = None

            else:
                excludes.append(activeChars.strip().split(","))
                excludes = [img for img in excludes if os.path.exists(os.path.join(CWD, img[0]))]

except FileNotFoundError:
    print("No properties file found, using defaults")
    pass

print("maxImgWidth: ", maxImgWidth)
print("maxImgHeight: ", maxImgHeight)
print("excludes: ", excludes)

# get all the images in the directory
images = os.listdir(CWD)
subdirs = [d for d in images if os.path.isdir(os.path.join(CWD, d))]
for subdir in subdirs:
    images.extend([os.path.join(subdir, img) for img in os.listdir(os.path.join(CWD, subdir))])

images = [
    img
    for img in images
    if img.endswith(".jpg")
    or img.endswith(".png")
    or img.endswith(".jpeg")
    or img.endswith(".gif")
    or img.endswith(".JPG")
    or img.endswith(".PNG")
    or img.endswith(".JPEG")
    or img.endswith(".GIF")
]
images = [img for img in images if img not in excludes]

print(images)

# resize the images
i = 0
for img in images:
    print(str(i / len(images) * 100) + "%")
    i += 1
    try:
        with Image.open(os.path.join(CWD, img)) as image:
            width, height = image.size
            if maxImgWidth and width > maxImgWidth:
                ratio = maxImgWidth / width
                newHeight = int(height * ratio)
                image = image.resize((maxImgWidth, newHeight))
            elif maxImgHeight and height > maxImgHeight:
                ratio = maxImgHeight / height
                newWidth = int(width * ratio)
                image = image.resize((newWidth, maxImgHeight))
            image.save(os.path.join(CWD, img), optimize=True, quality=65, progressive=True)
    except Exception as e:
        print(e)
        print("Error with image: ", img)
        continue

print("Done!")
