from flask import Flask, render_template, request, jsonify
import os
import json
import datetime
import random

ROOT_PATH = os.getcwd()

app = Flask(__name__)
app.json.sort_keys = False

def loadJSONFile(filePath):
    with open(filePath, "r", encoding='utf-8') as file:
            data = json.load(file)
            return data
    
def saveJSONFile(data, filePath):
    with open(filePath, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False)
        return True

    
def findFilePath(searchInfo):
    language = searchInfo["lang"]
    version = searchInfo["bibleVersion"]
   
    filePath = os.path.join(ROOT_PATH, "data", "versions", language, f"{version}.json")

    return filePath

def getBooksList():
    filePath = os.path.join(ROOT_PATH, "data", "booksList.json")
    return filePath

def selectRandomNum(length):
    return random.randint(1, length)

def getRandomVerse(metadata):
    filePath = findFilePath(metadata)
    data = loadJSONFile(filePath)

    bookListPath = getBooksList()
    bookList = loadJSONFile(bookListPath)["books"]
    
    randomNum = random.randint(0, len(bookList) - 1)
    randomBook = bookList[randomNum]

    chapterNum = selectRandomNum(len(data[randomBook]))
    verseNum = selectRandomNum(len(data[randomBook][str(chapterNum)]))
    randomVerse = data[randomBook][str(chapterNum)][str(verseNum)]
   
    return {"book": randomBook, "chapter": chapterNum,"verse": verseNum,"content": randomVerse}

@app.get("/.well-known/appspecific/com.chrome.devtools.json")
def devtools_config():
    return {}


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/searchVerse", methods=['POST'])
def searchVerse():
    try:
        requestInfo = request.json
   
        book = requestInfo["book"]
        chapter = requestInfo["chapter"]
        startingVerse = requestInfo["startingVerse"]
        endingVerse = requestInfo["endingVerse"]

        filePath = findFilePath(requestInfo)
        data = loadJSONFile(filePath)


        if (endingVerse == "" or endingVerse == "1"):
            return jsonify(data[book][chapter][startingVerse])
        else:
            multipleVerses = {}

            for i in range(int(startingVerse), int(endingVerse) + 1):
                multipleVerses[str(i)] = data[book][chapter][str(i)]

            print(multipleVerses)
            return jsonify(multipleVerses)
        
    except NameError:
        print(NameError)
        return jsonify({"success" : False})

@app.route("/api/randomverse", methods=["POST"])
def randomVerse():  
    
    metadata = request.json
    verse = getRandomVerse(metadata)

    return jsonify(verse)

@app.route("/api/verseOfTheDay", methods=["POST"])
def verseOfTheDay():
    today = datetime.datetime.today().date()
    
    metadata = request.json
    
    filepath = os.path.join(ROOT_PATH, "data", "verseOfTheDay.json")
    savedData = loadJSONFile(filepath)
    savedDate = savedData["dateChosen"]
    savedVerse = savedData["randomVerse"]

    if savedDate != str(today):
        randomVerse = getRandomVerse(metadata)
        verse = {"dateChosen": str(today), "randomVerse": randomVerse}
        saveJSONFile(verse, filepath)
        return jsonify(verse)
    else:
        return jsonify(savedData)
    

@app.route("/api/getBookList")
def getBookList():
   
    filePath = os.path.join(ROOT_PATH, "data", "booksList.json")
    data = loadJSONFile(filePath)['chronologicalSort']

    return jsonify({"sortedBooks" : data})



if __name__ == "__main__":
    app.run(debug=True)