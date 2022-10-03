import fs from "fs"

function ensureCacheDir(){
    if (!fs.existsSync("./cache")){
        fs.mkdirSync("./cache");
    }
}

export function getCache(file){
    if (!fs.existsSync("./cache")){
        return false
    }
    
    let filePath = `./cache/${file}.json`
    if (!fs.existsSync(filePath)){
        return false
    }

    let cachedData = JSON.parse(fs.readFileSync(filePath, {encoding: "utf8", flag: "r"}))
    let currentTime = new Date().getTime() / 1000
    if (cachedData["expireTime"] <= currentTime){
        fs.rmSync(filePath)
        return false
    }
    return cachedData["data"]
}

export function setCache(file, data, expires=3600){
    ensureCacheDir()

    if (expires > -1){
        expires = (new Date().getTime() / 1000) + expires
    }

    let cachedData = {
        "expireTime": expires,
        "data": data
    }

    fs.writeFileSync(`./cache/${file}.json`, JSON.stringify(cachedData), 'utf8')
}