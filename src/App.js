import React from "react"
import {useState, useEffect} from "react"
import Question from "./Question"
import {nanoid} from "nanoid"


export default function App(){

    const [page, setPage] = useState(true)
    const [allData, setAllData] = useState([])
    const [score,setScore]= useState(0)
    const [gameOver, setGameOver] = useState(false)
    const [count, setCount]=useState(0)

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array
    } // Fisher Yates shuffle algorithm, added a return for our case

    function extendAnswer(answer, isCorrect){
        return {
            id:nanoid(),
            text:answer,
            selected: false,
            isCorrect: isCorrect
        }
    }
    // extend object 

    useEffect(() => {
        async function getQuestions() {
            const res = await fetch("https://opentdb.com/api.php?amount=5&category=21&difficulty=easy&type=multiple")
            const data = await res.json()
            setAllData(data.results.map(prev=>{
                let answers = prev.incorrect_answers.map(answer =>{
                    return  extendAnswer(answer, false)
                })
                answers.push(extendAnswer(prev.correct_answer,true))
                answers= shuffleArray(answers) // *here 
                return {
                    id: nanoid(),
                    question:prev.question,
                    answers:answers
                }
            }))
            console.log(allData);
            // console.log(data.results)
        }
        getQuestions()
    }, [count])
  // useEffect hook + useState hook used to create the desired array of objects (includes a property which has another array of objects)

    const handleChangePage = () =>{
        setPage(prev=>!prev)
    }
   //swith from "start quiz" page to "quiz" page

    const holdAnswer =(id, selected)=>{
        if (gameOver===false){
            setAllData(
                    prev=>prev.map(que=>
                            que.id===id
                            ?{
                                ...que,
                                answers:que.answers.map(answ=>{
                                    return(
                                        answ.id===selected
                                            ?{...answ, selected: !answ.selected}
                                            :{...answ, selected: false}
                                )}
                                ),
                            }   
                            :{...que}
                        )
            )
        }         
    }
    // useState hook used with 2 parameters(which come from the Question component)
    const checkAnswers = () =>{
        setScore(
            allData.filter(
                ele=>ele.answers.findIndex(
                    it=> it.selected === true && it.isCorrect===true)
                        !==-1)
                             .length)
        
        setGameOver(true)
    }
    // useState hook used to keep track of score
    const handlePlayAgain = () =>{
        setScore(0)
        setGameOver(false)
        setCount(count=>count+1)
      
    }
    // play again button
    const questionElements = allData.map(que=> (
        
        <Question
            question={que.question}
            answers={que.answers}
            id={que.id}  
            holdAnswer={holdAnswer}
            gameOver={gameOver}
        />
    ))
    // mapping over allData to create react elements 
    return (
        <div>
             {page && <div className="first--page--container">
             <h1 className="first--page--title">Quizzical</h1>
                <p className="first--page--description">Test your sports knowledge!</p>
                <button className="first--page--button"onClick={handleChangePage} >Start quiz </button>
            <div className="blob--one"></div>
            <div className="blob--two"></div>            
        </div>
            }
            <div className="quiz--container">
                {questionElements}
                <div className="check--answer--button--container">
                    {gameOver
                        ?<div className="play--again--container">
                            <h1>You scored {score}/5 correct answers</h1>
                            <button className="play--again--button"
                                     onClick = {handlePlayAgain}
                                    >Play again
                            </button>
                        </div>
                        :<button className="check--answer--button"
                                onClick = {checkAnswers}
                                >Check answers
                        </button>
                    }
                </div>
                    <div className="blob--one"></div>
                    <div className="blob--two"></div> 
            </div>
            
        </div>
    )
}