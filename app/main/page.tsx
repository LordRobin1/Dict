'use client';
import { useState } from 'react';
import { Data, wordDefs } from '../../code/definitions';
import { Quote, quoteByKey } from '../../code/quotes';
import styles from '../../styles/SearchBar.module.css';
import Info from './[data]/page';
import Word from './[search]/page';

const Main = () => {
    const [input, setInput] = useState<string>('')
    const [search, setSearch] = useState<string>('')
    const [quote, setQuote] = useState<Quote>()
    const [info, setInfo] = useState<Data>([])
    const [firstSearch, SetFirstSearch] = useState(true)

    const submit = async (e: any) => {
        e.preventDefault()
        if (input === '') return
        if (firstSearch) SetFirstSearch(false)
        
        let q = await quoteByKey(input)
        console.log(q)
        setQuote(q)
        const res = await wordDefs(input)
        setInfo(res)
        setSearch(input)
    }

    return (
        <div className={styles.main}>
            <form onSubmit={e => submit(e)} style={{margin: '10px auto'}}>
                <input className={styles.input} type="text" onChange={e => {setInput(e.target.value); console.log(input)}} placeholder='Search...'/>            
                <button className={styles.button} type='submit'>Go!</button>
            </form>
            <Word search={search} input={input} quote={quote as Quote}></Word>
            <Info firstSearch={firstSearch} word={input} results={info}></Info>
        </div>
  )
}

export default Main