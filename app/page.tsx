import styles from '../styles/Home.module.css';
import Main from './main/page';

const Homepage = async () => {
    return(
        <div className={styles.container}>
            <div className={styles.gradient}></div>
            <div className={styles.background}></div>
            <h1 className={styles.heading}>Snaz!</h1>
            <h4>Was machen Sachen</h4>
            <p>Look up a word, get some information, and a quote (maybe even a LOTR quote :p)</p>
            <Main/>
        </div>
    )
}

export default Homepage