import fs from 'fs'

const checkIfFoldersExists = () => {
    if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data')
    } 
}

export default checkIfFoldersExists