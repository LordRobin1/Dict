import style from "../../../styles/Info.module.css";

const Info = (results: string[]) => {
    let key = 0;
    return (
      <div className={style.flex}>
        {results.map((entry: string) => {
            key++
            return(<div key={key}>{entry}</div>)
        })}
      </div>
    )
}

export default Info
