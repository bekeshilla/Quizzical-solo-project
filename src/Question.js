import React from "react"
export default function Question (props){

   let styles ={}
    const answerElements = props.answers.map((answ)=>{
        if (props.gameOver===true){
            styles = {
                backgroundColor: answ.isCorrect ? '#94D7A2' : 'white',
                border: answ.isCorrect ? 'none' : '0.794239px solid #4D5B9E' 
                 }
         }
        if (props.gameOver===true && answ.isCorrect===false){
            styles = {
                 backgroundColor: answ.selected ? '#F8BCBC' : 'white',
                 border: answ.selected ? 'none' : '0.794239px solid #4D5B9E' 
                    }
            }
        if(props.gameOver===false){
            styles = {
                backgroundColor: answ.selected ? '#D6DBF5' : 'white',
                border: answ.selected ? 'none' : '0.794239px solid #4D5B9E' 
                 }
                }
        
        return(
            <button className="answer--button"
                onClick = {()=>props.holdAnswer(props.id, answ.id)}
                style={styles}   
                >{answ.text}
            </button>
    )})
   
   
    return(
        <div>
            <div className="container--questions--answers">
                <h1 className="container--questions">{props.question}</h1>
                <div className="container--answers">
                    {answerElements}
                </div>
            
            </div>
            
        </div>
    )
}
