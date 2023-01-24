'use client';
import { useState } from 'react';
import { Quote, quoteByKey } from '../../code/quotes';
import styles from '../../styles/SearchBar.module.css';
import Word from './[id]/page';

const Main = () => {
    const [input, setInput] = useState<string>('')
    // const [search, setSearch] = useState<boolean>(false)
    const [quote, setQuote] = useState<Quote>()
    const submit = async (e: any) => {
        e.preventDefault()
        // setSearch(true)
        let q = await quoteByKey(input)
        console.log(q)
        setQuote(q)
    }

    return (
        <div className={styles.main}>
            <form onSubmit={e => submit(e)} style={{margin: '10px auto'}}>
                <input className={styles.input} type="text" onChange={e => {setInput(e.target.value); console.log(input)}} placeholder='Search...'/>            
                <button className={styles.button} type='submit'>Go!</button>
            </form>
            <Word input={input} quote={quote as Quote}></Word>
        </div>
  )
}

export default Main