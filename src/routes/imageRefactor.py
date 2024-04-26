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
    pageData = ""
    tagsToAdd = []
    imageNames = []
    with open(os.path.join(os.getcwd(), "src/routes", page), "r") as file:
        data = file.readlines()
        for line in data:
            if "/src/lib/images/" in line:
                imageNames.append(
                    line.split("/src/lib/images/")[1]
                    .split(".")[0]
                    .replace("/", "")
                    .replace("-", "")
                )
                tagsToAdd.append(
                    "import "
                    + imageNames[-1]
                    + " from '$lib/images/"
                    + line.split("/src/lib/images/")[1].split('"')[0]
                    + "';"
                )
                pageData += line.replace(
                    '"/src/lib/images/' + line.split("/src/lib/images/")[1].split('"')[0] + '"',
                    "{" + imageNames[-1] + "}",
                )  # replace image path with image name
                continue
            pageData += line
        if "</script>" in pageData:  # there is a script tag
            scriptIndex = pageData.index("</script>")
            pageData = (
                pageData[:scriptIndex] + "\n".join(tagsToAdd) + "\n" + pageData[scriptIndex:]
            )  # add imports before script tag
        else:  # there is no script tag
            pageData = (
                "<script>\n" + "\n".join(tagsToAdd) + "\n</script>\n" + pageData
            )  # add script tag and imports

    print(imageNames)
    print(tagsToAdd)
    print(pageData)
    with open(os.path.join(os.getcwd(), "src/routes", page), "w") as file:
        file.write(pageData)
