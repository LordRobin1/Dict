import axios from 'axios'

const getEnv = () : string => {
    return process.env.NEXT_PUBLIC_AUTH_TOKEN as string
}
const TOKEN = getEnv()

const Q_URL = 'https://api.quotable.io'
const LOTR_URL = 'https://the-one-api.dev/v2'

type Index = {
    start: number,
    end: number
}
type Char = {
    id?: string,
    height?: string,
    race?: string,
    gender?: string,
    birth?: string,
    spouse?: string,
    death?: string,
    realm?: string,
    hair?: string,
    name: string,
    wikiUrl?: string
}
export type Quote = {
    quote: string[],
    lotr: boolean,
    char: Char
}

export async function quoteByKey (sq: string) : Promise<Quote> {
    try {
        let lq = await lotrQuote(sq)
        if (lq.quote.length > 0) {
            return lq
        }
    } catch (err) {
        console.log(err)
    }
    try {
        let nq = await normalQuote(sq)
        return nq
    } catch (err) {
        console.log(err)
    }
    return {quote: [], lotr: false, char: {name: ''}}
}

const normalQuote = async (sq: string) : Promise<Quote> => {
        const res = await axios.get(`${Q_URL}/search/quotes?query=${sq}`)
        const data = res.data.results
        console.log(data)
        if(data[0] === undefined) console.log(`No quote including ${sq}`);
        const pick = Math.floor(Math.random() * (data.length - 1));
        const quote = [{dialog: data[pick].content}]
        return splitQuote(sq, quote, false, data[pick]) //[`${data[0].content}`, `${data[0].author}`]
}

const character = async (id: string) : Promise<Char> => {
    try {
        const res = await axios.get(`${LOTR_URL}/character/${id}`, {
            headers: {
                'Authorization': `Bearer ${TOKEN}` 
            }
        })        
        return res.data.docs[0]
    } catch (error) {
        console.log(error)
        return {name:''}
    }
}

// const randlotrQuote = async () : Promise<void> => {
//     const num = Math.floor(Math.random() * 999)
//     const quotes = await getLOTRQuotes() //JSON.parse(await fs.readFile(path, 'utf-8'))
//     const char = await character(quotes[num].character) //this not correct syntax
// }

const getLOTRQuotes = async () : Promise<any> => {
    const res = await axios.get(`${LOTR_URL}/quote`, {
        headers: {
            'Authorization': `Bearer ${TOKEN}`
        }
    })
    return res.data.docs
}

const lotrQuote = async (sq: string) : Promise<Quote> => {
    const quotes = await getLOTRQuotes()
    if (quotes === undefined) console.log("quotes undefined")
    return splitQuote(sq, quotes, true, null)
}

const splitQuote = async (sq: string, quotes: any, lotr: boolean, data: any) : Promise<Quote> => {
    const re = new RegExp(`[^a-z]${sq}[^a-z]|^${sq}[^a-z]|[^a-z]${sq}$|^${sq}$`, 'gi')
    
    //let count = 0
    //const end = returnCustom
    for (const quote of quotes) {
        
        const dialog: string = quote.dialog
        const words = dialog.match(re)
        if (words === null) continue

        const matches: string[] = words.map(word => {
            const tword = word.toLowerCase()
            return word = word.substring(tword.indexOf(sq.toLowerCase()), tword.indexOf(sq.toLowerCase()) + sq.length)
        })
        const diaLength = dialog.length
        const matchesLength = matches.length
        const matchLength = matches[0].length
        
        const indices: Index[] = getIndices(matches, matchesLength, matchLength, dialog, diaLength)
        
        const createSubstrings = () : string[] => {
            const temp : string[] = []
            for (let i = 0; i < indices.length; i++) {
                const sub: string = dialog.substring(indices[i].start, indices[i].end)
                temp.push(sub)
            }
            return temp
        }
        const subStrings: string [] = createSubstrings()
        
        const styledQuote = reassembleQuote(subStrings, words, matches, matchesLength, quote)
        const char: Char = lotr ? await character(quote.character) : {name: data.author}
        console.table(char)
        return {quote: styledQuote, lotr: lotr, char: char}
        //if(count === end) return
        //count++
        
        // let str: string = ''
        // for (let i = 0; i < styledQuote.length; i++) {
            //     str += styledQuote[i]
            // }
            
            // console.table(styledQuote)
            // console.log('final', str, dialog === str, '\n\n')
            
        }
        return {quote: [], lotr: false, char: {name: ''}}
}

const getIndices = (matches: string[], matchesLength: number, matchLength: number, dialog: string, diaLength: number) : Index[] => {
    let temp: Index[] = []
    let startedZero
    
    for (let i = 0; i < matchesLength; i++) {
        let index : Index = {start: 0, end: 0}
        
        
        
        if (i === 0) {
            if (dialog.indexOf(matches[i]) === 0) {
                index.start = matchLength
                index.end = i < matchesLength - 1 ? recursiveIndex(i + 1, 0, 0, dialog, matches) : diaLength
                startedZero = false
                temp.push(index)
            }
            else {
                index.start = 0
                index.end = dialog.indexOf(matches[i])
                startedZero = true
                temp.push(index)
                
                if (matchesLength === 1) {
                    return secondIndex(temp, i, matchLength, diaLength)
                }
            }
            continue
        }
        if(startedZero) {
            index.start = temp[i - 1].end + matchLength
            index.end = dialog.indexOf(matches[i], temp[i - 1].end + 1)
            temp.push(index)
            if (i === matchesLength - 1) temp = secondIndex(temp, i, matchLength, diaLength)
            continue
        }
        index.start = dialog.indexOf(matches[i], temp[i - 1].end + 1) + matchLength
        index.end = recursiveIndex(i + 1, 0, 0, dialog, matches)
        temp.push(index)
        if (i === matchesLength - 1) temp = secondIndex(temp, i, matchLength, diaLength)
    }
    return temp
}

const secondIndex = (temp: Index[], i: number, matchLength: number, diaLength: number) : Index[] => {
    const index : Index ={
        start: temp[i].end + matchLength,
        end: diaLength
    }
    temp.push(index)
    return temp
}

const recursiveIndex = (i: number, a: number, j: number, dialog: string, matches: string[]) : number => {
    a = dialog.indexOf(matches[j], a)
    if (j === i) return a
    return recursiveIndex(i, a + 1, j + 1, dialog, matches)
}


const reassembleQuote = (subStrings: string[], words: RegExpMatchArray, matches: string[], matchesLength: number, quote: any) : string[] => {
    const diff = subStrings.length - words.length
    const styledQuote : string[] = []
    if(diff > 0) {
        for (let i = 0; i < subStrings.length; i++) {
            const last = i == subStrings.length - 1
            styledQuote.push(subStrings[i])
            if(!last){
                styledQuote.push(matches[i])
            }
        }
        return styledQuote
    }
    if(diff < 0){
        for (let i = 0; i < matchesLength; i++) {
            const last = i == matchesLength - 1
            styledQuote.push(matches[i])
            if(!last){
                styledQuote.push(subStrings[i])
            }
        }
        return styledQuote
    }
    if(diff === 0) {
        const isZero = quote.dialog.indexOf(matches[0]) === 0
        if(isZero) {
            for (let i = 0; i < matchesLength; i++) {
                styledQuote.push(matches[i])
                styledQuote.push(subStrings[i])
            }
            return styledQuote
        }
        for (let i = 0; i < subStrings.length; i++) {
            styledQuote.push(subStrings[i])
            styledQuote.push(matches[i])
        }
        return styledQuote
    }
    return styledQuote
} 

// async function test () {
//     let res = await quoteByKey('Sauron')
//     console.log(res)
// }

// test()