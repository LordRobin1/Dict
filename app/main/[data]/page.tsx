import { JsxElement } from "typescript";
import style from "../../../styles/Info.module.css";

const Info = (results: any) => {
  let k = 0
  let l = 0
  let m = 0
  let n = 0
  let defs: JSX.Element[] = []

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
                {meaning.definitions.map((def: any) => {
                  l++
                  return (
                    <div key={l}>
                      <p>{def.definition}</p>
                    </div>
                  )
                })}
                <h6>Synonyms:</h6>
                {meaning.synonyms.map((syn: any) => {
                  m++
                  return (
                    <div key={m}>
                      <p>{syn}</p>
                    </div>
                  )
                })}
                <h6>Antonyms:</h6>
                {meaning.antonyms.map((ant: any) => {
                  m++
                  return (
                    <div key={m}>
                      <p>{ant}</p>
                    </div>
                  )
                })}
              </div>
          )})}
        </div>
      </div>
    )
    defs.push(blockElement)
  }

  console.table(defs)

  return(
    <div className={style.flex}>
      {defs.map((def: JSX.Element) => {
        n++
        return (<div key={n}>{def}</div>)
      })}
    </div>
  )
}

export default Info
