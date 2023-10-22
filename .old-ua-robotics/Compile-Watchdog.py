# not part of PELICAN
# just runs compile script when "do-compile.txt" is changed
# compiler runs on linux sever, so this script is run on linux server not by clients

import os, time

# path to file to watch
path_to_watch = os.path.dirname(os.path.abspath(__file__)) + "/do-compile.txt"

print("Watching " + path_to_watch + " for changes...")
while True:
    with open(path_to_watch, "r+") as f:
        data = f.read()
        if data != "FALSE":
            os.system("rm -rf output/*")
            os.system("pelican")
            print("Pelican compiled at " + time.strftime("%H:%M:%S", time.localtime()))

            f.truncate(0)
            f.seek(0)
            f.write("FALSE")

    time.sleep(5)
