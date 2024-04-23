import os

pages = []
dir = os.listdir(os.path.join(os.getcwd(), "src/routes"))
print(dir)
for file in dir:
    if file == "+page.svelte":
        pages.append(file)
    if os.path.isdir(os.path.join(os.getcwd(), "src/routes", file)):
        subdir = os.listdir(os.path.join(os.getcwd(), "src/routes", file))
        print(subdir)
        for subfile in subdir:
            if subfile == "+page.svelte":
                pages.append(file + "/" + subfile)

print(pages)
print("Pages acquired!")

for page in pages:
    with open(os.path.join(os.getcwd(), "src/routes", page), "rw") as file:
        data = file.read()
        data = data.replace("/src/lib/images/", "/images/")
        file.write(data)
