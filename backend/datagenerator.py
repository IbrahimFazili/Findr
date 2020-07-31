import json
import csv
from random import randint


"""
name: req.body.name,
email: req.body.email,
password: bcrypt.hashSync(req.body.password, 10),
gender: req.body.gender,
uni: req.body.uni,
major: req.body.major,
age: Number(req.body.age),
keywords
"""
UNI = "University of Toronto"
MAJORS = ["Computer Science", "Life Sciences", "Physics", "Mathematics", "Statistics"]
KEYWORDS = ["CSC108", "MAT135", "CSC148", "MAT102", "MAT223", "MAT232", "POLL113", "ANT102", "RLG101", "LIN101"
"MAT202", "CSC207", "CSC236", "CSC209", "CSC263" , "MAT244", "MAT224", "CSC338", "MAT301", "MAT344"]

def getRandomMajor():
    return MAJORS[randint(0, len(MAJORS) - 1)]


def getRandomGender():
    value = randint(0, 100)
    gender  = 'M' if (value < 50) else 'F'
    return gender


def getKeywords(poolSize):
    if poolSize > len(KEYWORDS): poolSize = len(KEYWORDS)
    selectionPool = KEYWORDS[:poolSize]
    
    numKeywords = randint(2, min(7, len(selectionPool)))
    selectedKeywords = []

    while len(selectedKeywords) < numKeywords:

        k = selectionPool[randint(0, len(selectionPool) - 1)]
        if k not in selectedKeywords:   
            selectedKeywords.append(k)

    return selectedKeywords

class User:
    def __init__(self, name, email, password, gender, uni, major, age, keywords):
        self.name = name
        self.email = email
        self.password = password
        self.gender = gender
        self.uni = uni
        self.major = major
        self.age = age
        self.keywords = keywords

    def getJSON(self):
        user = {
            "name" : self.name,
            "email" : self.email,
            "password" : self.password,
            "gender" : self.gender,
            "uni" : self.uni,
            "major" : self.major,
            "age" : self.age,
            "keywords" : self.keywords
        }
        
        return user


class DataSet:
    def __init__(self, size: int=10):
        self.size = size
        self.elements = []

    def saveJSON(self, filepath: str='out.json'):
        jsonData = json.dumps(self.elements, indent=4)
        out = open(filepath, 'w')
        out.write(jsonData)
        out.close()
    
    def saveCSV(self, filepath: str='out.csv'):
        keys = self.elements[0].keys()
        with open(filepath, 'w') as output_file:
            dict_writer = csv.DictWriter(output_file, keys)
            dict_writer.writeheader()
            dict_writer.writerows(self.elements)
    
    def generateUsers(self):
        for i in range(self.size):
            user = User("User " + str(i), "user" + str(i) + "@domain.com", "User_" + str(i),
                        getRandomGender(), UNI, getRandomMajor(), randint(16, 28),
                        getKeywords(8))
            self.elements.append(user.getJSON())


data = DataSet(500)
data.generateUsers()
data.saveJSON("test/500.json")
data.saveCSV("test/500.csv")


