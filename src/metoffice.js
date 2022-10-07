import fs from "fs"
import got from "got"
import { getCache, setCache } from "./cache.js"

function getApiKey(){
    return JSON.parse(fs.readFileSync("./secret.json", {encoding: "utf8", flag: "r"}))["api_key"]
}

function getURL({operation="wxfcs", format="json", request="", params=[]}){
    const url = (
        "http://datapoint.metoffice.gov.uk/public/data/val/"
        + `${operation}/all/${format}/${request}?key=${getApiKey()}&${params.join("&")}`
    )
    console.log(url)
    return got(url).json()  // this assumes format is json
}

export async function getLocations(){
    let locations = getCache("locations")
    if (locations === false){
        locations = await getURL({request: "sitelist"})
        setCache("locations", locations, 3600)
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

export async function getForecast(locationId){
    let forecastCache = getCache("forecast")
    if (forecastCache !== false && locationId in forecastCache){
        var forecast = forecastCache[locationId]
    } else {
        var forecast = await getURL({request: locationId, params:["res=3hourly"]})
        let cacheEntry = new Object()
        cacheEntry[locationId] = forecast
        setCache("forecast", cacheEntry, 3600)
    }
    return forecast
}

export function parseForecast(fc){
    let result = {}

    for (let day of fc["SiteRep"]["DV"]["Location"]["Period"]){
        let key = day["value"]
        let chunks = []

        for (let chunk of day["Rep"]){
            chunks.push({
                "temp": chunk["T"],
                "feels_like": chunk["F"],
                "wind_speed": chunk["S"],
                "gusts": chunk["G"],
                "precipitation_chance": chunk["Pp"],
                "time": chunk["$"]
            })
        }

        result[key] = chunks
    }
    return result
}