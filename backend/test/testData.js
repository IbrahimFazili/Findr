const bcrypt = require("bcrypt");

module.exports.testData =
[
    {
    name: "Sheldon Cooper",
    email: "sheldon.cooper@caltech.edu",
    password: bcrypt.hashSync("Cooper73", 10),
    gender: "M",
    uni: "California Institute of Technology",
    major: "Physics",
    age: 40,
    chats: [],
    keywords: ["CSC209", "MAT224", "PHY136"],
    bio:
        "One cries because one is sad. I cry because others are stupid and that makes me sad",
    blueConnections: [],
    greenConnections: [],
    },

    {
    name: "Leonard Hofstadter",
    email: "leonard.hofstadter@caltech.edu",
    password: bcrypt.hashSync("Hofstadter2000", 10),
    gender: "M",
    uni: "Princeton University",
    major: "Physics",
    age: 38,
    chats: [],
    keywords: ["CSC148", "MAT102", "PHY136"],
    bio:
        "I'm lactose intolerant and asthmatic.",
    blueConnections: [],
    greenConnections: [],
    },

    {
    name: "Penny Hofstadter",
    email: "penny.hofstadter@communitycollege.edu",
    password: bcrypt.hashSync("penny200", 10),
    gender: "F",
    uni: "Some Community College",
    major: "Theatre",
    age: 35,
    chats: [],
    keywords: ["ECO 100", "STA107"],
    bio:
        "Pharmaceutical Sales Representative.",
    blueConnections: [],
    greenConnections: [],
    },

    {
    name: "Meredith Grey",
    email: "meredith.grey@seattlegrace.com",
    password: bcrypt.hashSync("darkandtwisted", 10),
    gender: "F",
    uni: "Dartmouth College",
    major: "Life Sciences",
    age: 32,
    chats: [],
    keywords: ["BIO100", "CHM106", "PHY105"],
    bio:
        "Too often, the thing you want most is the one thing you can't have",
    blueConnections: [],
    greenConnections: [],
    },

    {
    name: "Cristina Yang",
    email: "cristina.yang@seattlegrace.com",
    password: bcrypt.hashSync("shark", 10),
    gender: "F",
    uni: "Stanford University",
    major: "Life Sciences",
    age: 34,
    chats: [],
    keywords: ["BIO100", "CHM106", "PHY105"],
    bio:
        "He's not the sun, you're the sun",
    blueConnections: [],
    greenConnections: [],
    },

    {
    name: "Derek Shepherd",
    email: "derek.shepherd@seattlegrace.com",
    password: bcrypt.hashSync("mcsteamy", 10),
    gender: "M",
    uni: "Harvard University",
    major: "Neuroscience",
    age: 40,
    chats: [],
    keywords: ["BIO100", "MAT224", "ECO100"],
    bio: "I got hit by a trailer.",
    blueConnections: [],
    greenConnections: [],
    },

    {
    name: "Owen Hunt",
    email: "owen.hunt@seattlegrace.com",
    password: bcrypt.hashSync("ginger", 10),
    gender: "M",
    uni: "Brown University",
    major: "Chemistry",
    age: 41,
    chats: [],
    keywords: ["CSC209", "CSC148", "MAT102"],
    bio: "Trauma Surgeon, served in Iraq",
    blueConnections: [],
    greenConnections: [],
    },

    {
    name: "Miranda Bailey",
    email: "miranda.bailey@seattlegrace.com",
    password: bcrypt.hashSync("nazi", 10),
    gender: "F",
    uni: "",
    major: "",
    age: 42,
    chats: [],
    keywords: ["STA107", "CSC207", "MAT135"],
    bio:
        "I got five rules.",
    blueConnections: [],
    greenConnections: [],
    },

    {
    name: "Mayim bialik",
    email: "mayim.bialik@ucla.com",
    password: bcrypt.hashSync("neildiamond", 10),
    gender: "F",
    uni: "",
    major: "",
    age: 42,
    chats: [],
    keywords: ["POL113", "RLG101"],
    bio:
        "A Female Sheldon Cooper.",
    blueConnections: [],
    greenConnections: [],
    },

    {
    name: "Alex Rennet",
    email: "alex.rennet@ucla.com",
    password: bcrypt.hashSync("alex2020", 10),
    gender: "M",
    uni: "",
    major: "",
    age: 39,
    chats: [],
    keywords: ["MAT102", "PHY105", "LIN101"],
    bio:
        "Teaching Stream Faculty.",
    blueConnections: [],
    greenConnections: [],
    }
];



