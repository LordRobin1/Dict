'use client';
import axios from 'axios';
import { useState } from 'react';
import { Quote, quoteByKey } from '../../code/quotes';
import styles from '../../styles/SearchBar.module.css';
import Info from './[data]/page';
import Word from './[search]/page';

const Main = () => {
    const [input, setInput] = useState<string>('')
    const [quote, setQuote] = useState<Quote>()

    const [info, setInfo] = useState([]);
    const wordURL = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

    const submit = async (e: any) => {
        e.preventDefault()
        if (input === '') return

        let q = await quoteByKey(input)
        console.log(q)
        setQuote(q)
        const res = await axios.get(`${wordURL}${input}`)
        console.table(res.data)
        checkDictRes(res.data) && setInfo(res.data)
    }

    return (
        <div className={styles.main}>
            <form onSubmit={e => submit(e)} style={{margin: '10px auto'}}>
                <input className={styles.input} type="text" onChange={e => {setInput(e.target.value); console.log(input)}} placeholder='Search...'/>            
                <button className={styles.button} type='submit'>Go!</button>
            </form>
            <Word input={input} quote={quote as Quote}></Word>
            <Info results={info}></Info>
        </div>
  )
}

export default Main

const checkDictRes = (res: any) => {
    return res.title === (null || undefined)
}