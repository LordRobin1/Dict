import { Quote } from '../../../code/quotes';
import styles from '../../../styles/Quote.module.css';

interface Props  {
    input: string,
    quote: Quote
}

const Word = ({input, quote}: Props) => {
    return (
        <div className={styles.wrapper}>
            <h2 className={styles.heading}>{input.charAt(0).toUpperCase() + input.slice(1)}</h2>
            <div className={styles.quote}>
                {quote !== undefined && <Quote input={input} quote={quote}></Quote>}
            </div>
        </div>
    )
}


const Quote = ({input, quote}: Props) => {
    let key = 0
    let author = quote.char.name
    console.log(author)
    return(
        <div>
            {(quote.quote as string[]).map(str => {
                if (str.toLowerCase() === input.toLowerCase()) {
                    key++
                    return <span style={{fontWeight: '1000',fontSize: '18px', color: '#21cdef'}} key={key}>{str}</span>
                } else {
                    key++
                    return <span key={key}>{str}</span>
                }
            })}
            <p>- {author === '' ? 'ohno' : author}</p>
        </div>
    )
}

export default Word