import { useEffect, useReducer } from 'react';
import StartScreen from './StartScreen.jsx';
import Question from './Question.jsx';
import ResultScreen from './ResultScreen.jsx';
import {
  quizCategories,
  quizDifficulties,
  questionCounts,
  sampleQuestions,
} from '../data/questions.js';

const secondsPerQuestion = 20;

const initialState = {
  status: 'idle',
  questions: [],
  index: 0,
  answer: null,
  points: 0,
  secondsRemaining: secondsPerQuestion,
  highscore: 0,
};

function finishQuiz(state) {
  return {
    ...state,
    status: 'finished',
    highscore: Math.max(state.highscore, state.points),
  };
}

function quizReducer(state, action) {
  switch (action.type) {
    case 'start':
      if (state.status === 'ready') {
        return { ...state, status: 'active' };
      }
      if (state.status === 'idle' || state.status === 'error') {
        return { ...state, status: 'loading' };
      }
      return state;
    case 'dataReceived':
      if (state.status !== 'loading' || action.questions.length === 0) {
        return state.status === 'loading' ? { ...state, status: 'error' } : state;
      }
      return {
        ...state,
        status: 'ready',
        questions: action.questions,
        index: 0,
        answer: null,
        points: 0,
        secondsRemaining: secondsPerQuestion,
      };
    case 'dataFailed':
      return state.status === 'loading' ? { ...state, status: 'error' } : state;
    case 'newAnswer': {
      if (state.status !== 'active' || state.answer !== null) return state;
      const question = state.questions[state.index];
      if (
        !question ||
        !Number.isInteger(action.answer) ||
        action.answer < 0 ||
        action.answer >= question.answers.length
      ) {
        return state;
      }
      return {
        ...state,
        answer: action.answer,
        points: state.points + (action.answer === question.correctAnswerIndex ? 1 : 0),
      };
    }
    case 'nextQuestion':
      if (state.status !== 'active' || state.answer === null) return state;
      return {
        ...state,
        index: state.index + 1,
        answer: null,
        secondsRemaining: secondsPerQuestion,
      };
    case 'finish':
      return state.status === 'active' ? finishQuiz(state) : state;
    case 'restart':
      return { ...initialState, highscore: state.highscore };
    case 'tick':
      if (state.status !== 'active' || state.answer !== null) return state;
      return state.secondsRemaining <= 1
        ? finishQuiz({ ...state, secondsRemaining: 0 })
        : { ...state, secondsRemaining: state.secondsRemaining - 1 };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  useEffect(() => {
    if (state.status === 'loading') {
      dispatch({ type: 'dataReceived', questions: sampleQuestions });
    } else if (state.status === 'ready') {
      dispatch({ type: 'start' });
    }
  }, [state.status]);

  useEffect(() => {
    if (state.status !== 'active' || state.answer !== null) return undefined;
    const timerId = window.setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => window.clearInterval(timerId);
  }, [state.status, state.answer, state.index]);

  const currentQuestion = state.questions[state.index];
  const maxPoints = state.questions.length;

  function handleNextQuestion() {
    if (state.index === state.questions.length - 1) {
      dispatch({ type: 'finish' });
    } else {
      dispatch({ type: 'nextQuestion' });
    }
  }

  return (
    <main className="app-shell">
      <a className="brand" href="#home" aria-label="Quiz Club home">
        <span className="brand-mark" aria-hidden="true">Q</span>
        <span>quiz club</span>
      </a>

      {(state.status === 'idle' || state.status === 'error') && (
        <>
          {state.status === 'error' && (
            <p role="alert">We couldn&apos;t load the quiz. Please try again.</p>
          )}
          <StartScreen
            categories={quizCategories}
            difficulties={quizDifficulties}
            questionCounts={questionCounts}
            onStart={() => dispatch({ type: 'start' })}
          />
        </>
      )}

      {state.status === 'loading' && <p role="status">Loading your quiz…</p>}

      {state.status === 'active' && currentQuestion && (
        <Question
          question={currentQuestion}
          questionNumber={state.index + 1}
          totalQuestions={maxPoints}
          seconds={state.secondsRemaining}
          answer={state.answer}
          onAnswer={(answer) => dispatch({ type: 'newAnswer', answer })}
          onNext={handleNextQuestion}
          isLastQuestion={state.index === maxPoints - 1}
        />
      )}

      {state.status === 'finished' && (
        <ResultScreen
          score={state.points}
          total={maxPoints}
          highscore={state.highscore}
          onRestart={() => dispatch({ type: 'restart' })}
        />
      )}

      <footer className="app-footer">
        Made for curious minds <span aria-hidden="true">✳</span>
      </footer>
    </main>
  );
}
