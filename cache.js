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

    return JSON.parse(fs.readFileSync(filePath, {encoding: "utf8", flag: "r"}))
}

export function setCache(file, data){
    ensureCacheDir()

    fs.writeFileSync(`./cache/${file}.json`, JSON.stringify(data), 'utf8')
}