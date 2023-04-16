import axios from 'axios'

const wordURL = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

export type Data = Array<{
    word: string,
    phonetic: string,
    meanings: Array<any>,
    lincense: object,
    sourceUrls: Array<any>
}>

export async function wordDefs(word: string): Promise<Data> {
    try {
        const res = await axios.get(`${wordURL}${word}`)
        return res.data
    } catch (err) {
        return []
    }
}