module.exports = {
    "nsfw": {
        "path": "file://./models/nsfwjs/",
        "size": 299
    },
    "mobilenet": {
        "path": "file://./models/cats/model.json"
    },
    "training": {
        "path": "file://./models/cats/",
        "epochsValue": 1000,
        "batchSize": 100
    },
    "size": 224,
    "imageChannels": 3,
    "labels": [
        "Cats",
        "Not cats"
    ],
    "loadModelTimeout": 5
}