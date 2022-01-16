import React, { useEffect } from 'react';
import './quizDetail.css';

function QuizDetail(props) {

  const defaultCriteria = {
    totalQuestion: 20,
    operators: ''
  }

  const [isQuizStarted, setIsQuizStarted] = React.useState(false);
  const [formData, setFormData] = React.useState([]);
  const [questionNo, setQuestionNo] = React.useState(0);
  const [viewFinalScore, setViewFinalScore] = React.useState(false);
  const [selectedCriteria, setSelectedCriteria] = React.useState(defaultCriteria);
  const [errMessage,setErrMessage] = React.useState('');

  useEffect(() => {
    genrateQuestionAnswer();
    setQuestionNo(1)
  }, [isQuizStarted]);


  const genrateQuestionAnswer = () => {
    let tempData = []
    let tempOperatorArray = selectedCriteria.operators && selectedCriteria.operators.split(',')
    tempOperatorArray = Array.isArray(tempOperatorArray) && tempOperatorArray.filter(ditem => ditem);
    for (let temp = 1; temp <= selectedCriteria.totalQuestion; temp++) {
      const firstNumber = Math.floor(Math.random() * 10);
      const secondNumber = Math.floor(Math.random() * 10);
      const tempIndex = Math.floor(Math.random() * (tempOperatorArray.length))
      const operator = tempOperatorArray[tempIndex]
      const realAnswer = calculateAnswer(firstNumber, secondNumber, operator)
      let tempObj = {
        'queNo': temp,
        'answer': '',
        'queAsked': `${firstNumber} ${operator} ${secondNumber} = ?`,
        'realAnswer': realAnswer
      };
      tempData.push(tempObj)
    }
    setFormData(tempData)
  }

  const calculateAnswer = (firstNumber, secondNumber, operator) => {
    let tempAnswer = 0
    const tempString = firstNumber + operator + secondNumber
    tempAnswer = eval(tempString)
    tempAnswer = tempAnswer % 1 ? tempAnswer.toFixed(2) : tempAnswer;
    return tempAnswer;
  }

  const updateFormData = (filedKey, fieldValue) => {
    const tempFormData = formData && Array.isArray(formData) && formData.map(dItem => {
      if (dItem && dItem.queNo == questionNo) {
        const tempObj = { ...dItem, ...{ [filedKey]: Number(fieldValue) } }
        return (tempObj)
      } else{
        return (dItem)
      }
    })
    setFormData(tempFormData)
  }

  const updateCriteria = (filedKey, fieldValue) => {
    setErrMessage('');
    setSelectedCriteria({ ...selectedCriteria, ...{ [filedKey]: fieldValue } })
  }

  const onClickStartQuiz = () => {
    if(selectedCriteria.operators && selectedCriteria.totalQuestion){
      setIsQuizStarted(true)
    }else if(!selectedCriteria.totalQuestion){
      setErrMessage('Please Enter Total No. of question')
    }else if(!selectedCriteria.operators){
      setErrMessage('Please Enter operators')
    }
  }

  const onClickNextQue = () => {
    let tempQueNo = questionNo + 1;
    setQuestionNo(tempQueNo);
  }

  const onClickEndQuiz = () => {
    setViewFinalScore(true);
  }

  const renderCalculatePoints = () => {
    let tempScore = 0
    const tempRendercontent = formData && Array.isArray(formData) && formData.map((data, index) => {
      const tempAnswer = data.answer && (data.answer % 1 ? data.answer.toFixed(2) : data.answer);
      const currentAnswer = tempAnswer && (data.realAnswer == tempAnswer)
      tempScore = currentAnswer ? tempScore + 1 : tempScore;
      return (<tr key={index}>
        {currentAnswer ?
          <tr>
            <td>Question : </td>
            <td>{data.queAsked}&nbsp;&nbsp;</td>
            <td>Answer : </td>
            <td>{data.answer}</td>
          </tr> :
          <tr>
            <td>Question : </td>
            <td className='error'>{data.queAsked}&nbsp;&nbsp;</td>
            <td className='error'>Correct Answer : </td>
            <td className='error'>{data.realAnswer}</td>
          </tr>}
      </tr>)
    })


    return (
      <tbody>
        <thead><h2 className='totalScore'>{props.title} Total Score: {tempScore} / {selectedCriteria.totalQuestion}</h2></thead>
        {tempRendercontent}
        <tr><button className="btn btn-primary btn-sm" onClick={onClickStartNewQuiz}>Start New Quiz</button></tr>
      </tbody>)
  }

  const onClickStartNewQuiz = () => {
    setIsQuizStarted(false);
    setViewFinalScore(false);
    setSelectedCriteria(defaultCriteria);
  }

  return (
    <div className="col-lg-5 offset-lg-1" >
      {!viewFinalScore && <div className="card bg-card" >
        <div className="card-body">
          <div className="form-group">
            <h2 htmlFor="quiz1">{props.title}</h2>
            {!isQuizStarted && <div>
              <label>
                Enter Total number of Question: <input type="number" 
                onChange={e => updateCriteria('totalQuestion', e.target.value)}
                  value={selectedCriteria.totalQuestion} />
              </label>
              <label>
                Enter Operators by comma-separated : 
                <input onChange={e => updateCriteria('operators', e.target.value)}
                  value={selectedCriteria.operators} placeholder='e.g.:  +,-,*,/,%' />
              </label>
              {errMessage &&<span className='error'>{errMessage}</span>}
            </div>}
          </div><br />
          {isQuizStarted && formData && Array.isArray(formData) && <div className="form-group">
            <label htmlFor="answer" className='Quelabel'
            >Question {questionNo}:</label>&nbsp;
            <span>{formData[questionNo - 1] && formData[questionNo - 1].queAsked}</span>
            <input type="number" name="answer" id="answer"
              className="form-control" placeholder="Please enter only number here"
              onChange={e => updateFormData('answer', e.target.value)}
              value={formData[questionNo - 1] && formData[questionNo - 1].answer} />
          </div>
          }
          <br />
          <div className='buttonsGrp'>
            {!isQuizStarted ? <button name="startQuiz" type="submit"
              className="btn btn-primary btn-block" onClick={onClickStartQuiz}>
              Start Quiz
            </button> :
              <React.Fragment>
                {questionNo < selectedCriteria.totalQuestion ? 
                <button name="nextQueue" type="submit"
                  className="btn btn-primary btn-block" onClick={onClickNextQue}>
                  Next Question
                </button> : 
                <button name="endQuiz" type="submit"
                  className="btn btn-primary btn-block" onClick={onClickEndQuiz}>
                  End Quiz
                </button>}
              </React.Fragment>}
          </div>
        </div>
      </div>}
      {viewFinalScore && <table className='table table-striped table-bordered '>
        {renderCalculatePoints()}
      </table>}
    </div>
  )
}

export default QuizDetail;
