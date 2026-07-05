import os
import json

ROOT_PATH = os.getcwd()

def searchVerse():
    language = "en"
    version = "NEW KING JAMES VERSION"
    book = "Genesis"
    chapter = "1"
    verse = 1

    filePath = os.path.join(ROOT_PATH, "data", "versions", language, f"{version}.json")

    with open(filePath, "r", encoding='utf-8') as file:
        data = json.load(file)
    
    
    # print(data['Genesis']['1']['1'])
    multipleVerses = {}
    
    for i in range(1, 4):     
        # Build the Multiple Verses Functionality
        multipleVerses[str(i)] = data[book][chapter][str(i)]
        print(data[book][chapter][str(i)])
    
    print(multipleVerses)
    

searchVerse()