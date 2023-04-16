import { Data } from '../../../code/definitions';
import style from "../../../styles/Info.module.css";

interface Props {
  word: string
  firstSearch: boolean
  results: Data
}

const Info = ({firstSearch, word, results}: Props) => {
  let k = 0
  let l = 0
  let m = 0
  let n = 0
  let defs: JSX.Element[] = []

  if (results.length < 1) {
    defs.push(
      <div>
          <h3>No definitions found</h3>
          <h4>/nəʊ ˌdɛfɪˈnɪʃ(ə)nz faʊnd/</h4>
      </div>
    )
  }

  for (let i = 0; i < results.length; i++) {
    const block = results[i];

    const blockElement = (
      <div key={i}>
        <h3>{block.word}</h3>
        <h4>{block.phonetic}</h4>
        <div>
          {block.meanings.map((meaning: any) => {
            k++
            return (
              <div key={k}>
                <h5>{meaning.partOfSpeech}</h5>
                <ul>
                  {meaning.definitions.map((def: any) => {
                    l++
                    return (
                        <li key={l}>{def.definition}</li>
                    )
                  })}
                </ul>

                <h6>Synonyms:</h6>
                <ul>
                  {meaning.synonyms.map((syn: any) => {
                    m++
                    return (
                        <li key={m}>{syn}</li>
                    )
                  })}
                </ul>

                <h6>Antonyms:</h6>
                <ul>
                  {meaning.antonyms.map((ant: any) => {
                    n++
                    return (
                        <li key={n}>{ant}</li>
                    )
                  })}
                </ul>
              </div>
          )})}
        </div>
      </div>
    )
    defs.push(blockElement)
  }

  return(
    <div className={style.def_wrapper}>
      {(!firstSearch) && defs.map((def: JSX.Element) => {
        n++
        return (<div className={style.def} key={n}>{def}</div>)
      })}
    </div>
  )
}

export default Info
