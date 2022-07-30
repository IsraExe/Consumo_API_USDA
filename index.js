import fetch from 'node-fetch'
import fs from "fs"
import path from 'path'
import { dirname } from 'path'
import {fileURLToPath} from 'url'
import environmentVariables from './environmentVariables.js'

const KEY = environmentVariables.KEY 
const baseURL = environmentVariables.baseURL

const __dirname = dirname(fileURLToPath(import.meta.url))

const checkIfFolderExists = (() => {
    if (fs.existsSync('./data')) return
    
    fs.mkdirSync('./data')
})()

const findRecentYears = (async () => {
    const url = `${baseURL}/datareleasedates`
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json',
            'api_key': KEY
        }
    }

    const data = await (await fetch(url, options)).json()

    const getRecentYears = new Set([])

    let i = 0
    while (i < data.length) {
        const year = data[i].marketYear
        getRecentYears.add(year)
        i++
    }

    const mostRecentYears = Array.from(getRecentYears).slice(0, 7)

    getCommodityAndYear(mostRecentYears)
})()

const getCommodityAndYear = async (mostRecentYears) => {
    const url = `${baseURL}/datareleasedates`

    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json',
            'api_key': KEY,
        }
    }

    const data = await (await fetch(url, options)).json()

    let i = 0   
    while (i < data.length) {
        const dataLength = data.length
        const commodityCode = data[i].commodityCode
        const marketYear = data[i].marketYear

        const usedCommodityCode = [801, 401]
      
        if(mostRecentYears.indexOf(marketYear) != -1 && usedCommodityCode.indexOf(commodityCode) != -1) {
            
            checkIfFileExists(marketYear, commodityCode)
            getDataFromUSDA(commodityCode, marketYear, i, dataLength )
        } 
        
        i++
    }
}

const checkIfFileExists = (marketYear, commodityCode) => {
    try {
        fs.readFileSync(`./data/${marketYear}+${commodityCode}.json`)
    } catch (error) {
        fs.createWriteStream(
            path.join(__dirname, './data', `${marketYear}+${commodityCode}.json`), { flags: 'a' }
        ) 
    }
}

const getDataFromUSDA = async (commodityCode, marketYear) => {
    try {
        const url = `${baseURL}/exports/commodityCode/${commodityCode}/allCountries/marketYear/${marketYear}`

        const options = {
            method: 'GET',
            mode: 'cors',
            headers: {
                'content-type': 'application/json',
                'api_key': KEY
            }
        }
        
        const data = JSON.stringify(await (await fetch(url, options)).json(), null, 2)

        saveData(data, marketYear, commodityCode)
                   
    } catch (error) {
        fs.writeFileSync(path.join(__dirname, './error', `error.log`), error)
    }
}

const saveData = (data, marketYear, commodityCode) => {
    fs.createWriteStream(`./data/${marketYear}+${commodityCode}.json`).write(`${data}\n`)
}