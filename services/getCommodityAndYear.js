import fetch from 'node-fetch'
import fs from 'fs'

import environmentVariables from '../environmentVariables.js'
import checkIfFileExists from '../helpers/checkIfFileExists.js'
import getData from './getData.js'

const KEY = environmentVariables.KEY 
const baseURL = environmentVariables.baseURL

const usedCommodityCode = [801, 401]

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
        const commodityCode = data[i].commodityCode
        const marketYear = data[i].marketYear
      
        if(mostRecentYears.indexOf(marketYear) != -1 && usedCommodityCode.indexOf(commodityCode) != -1) {         
            checkIfFileExists(marketYear, commodityCode)
            getData(commodityCode, marketYear)
        } 
        
        i++
    }
}



export default getCommodityAndYear