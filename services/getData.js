import fetch from 'node-fetch'
import environmentVariables from '../environmentVariables.js'
import fs from 'fs'

const KEY = environmentVariables.KEY 
const baseURL = environmentVariables.baseURL

const getData = async (commodityCode, marketYear) => {
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
        console.log(error)
    }
}

const saveData = (data, marketYear, commodityCode) => {
    fs.createWriteStream(`./data/${marketYear}+${commodityCode}.json`).write(`${data}\n`)
}

export default getData