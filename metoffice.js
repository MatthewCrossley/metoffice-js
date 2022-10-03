import fs from "fs"
import got from "got"
import { getCache, setCache } from "./cache.js"

function getApiKey(){
    return JSON.parse(fs.readFileSync("./secret.json", {encoding: "utf8", flag: "r"}))["api_key"]
}

async function getURL({operation="wxfcs", format="json", request=""}){
    const url = (
        "http://datapoint.metoffice.gov.uk/public/data/val/"
        + `${operation}/all/${format}/${request}?key=${getApiKey()}`
    )
    return await got(url).json()  // this assumes format is json
}

export async function getLocations(){
    let locations = getCache("locations")
    if (locations === false){
        locations = await getURL({request: "sitelist"})
        setCache("locations", locations, 5)
    }
    return locations["Locations"]["Location"]
}

export async function searchLocations(searchTerm){
    const locations = await getLocations()
    let possibleResult = null
    searchTerm = searchTerm.toLowerCase()

    for (let loc of locations){
        let lc = loc["name"].toLowerCase()
        if (searchTerm === lc){
            return loc
        }
        if (lc.indexOf(searchTerm) !== -1){
            loc["searchRelevance"] = lc.length - searchTerm.length
            if (possibleResult === null || possibleResult["searchRelevance"] > loc["searchRelevance"]){
                possibleResult = loc
            }
        }
    }

    return possibleResult
}