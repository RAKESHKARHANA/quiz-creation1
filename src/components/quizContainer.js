import React from 'react'
import QuizDetail from './quizDetail'

function QuizContainer() {
    return (
        <React.Fragment>
            <div className="container">
                <div className="row mt-5">
                    <QuizDetail title = {'Quiz 1'}/>
                    <QuizDetail title = {'Quiz 2'}/>
                </div>
            </div>
        </React.Fragment>
    )
}

export default QuizContainer
