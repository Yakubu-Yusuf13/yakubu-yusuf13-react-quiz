import { useEffect, useReducer, useState } from 'react';
import StartScreen from './StartScreen.jsx';
import Question from './Question.jsx';
import ResultScreen from './ResultScreen.jsx';
import Loading from './Loading.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import { quizDifficulties } from '../data/questions.js';
import useLocalStorageState from '../hooks/useLocalStorageState.js';

const secondsPerQuestion = 15;
const questionsPerQuiz = 10;

const initialState = {
  status: 'idle',
  questions: [],
  index: 0,
  answer: null,
  points: 0,
  secondsRemaining: secondsPerQuestion,
  categoryId: null,
  difficulty: 'easy',
  errorMessage: '',
};

const responseCodeMessages = {
  1: 'No questions matched that category and difficulty. Try a different selection.',
  2: 'The quiz request had invalid options. Please change your selection and try again.',
  3: 'The trivia service could not find the requested session. Please retry.',
  4: 'The trivia session has run out of questions. Please retry.',
  5: 'The trivia service is busy. Wait a moment and try again.',
};

function finishQuiz(state) {
  return { ...state, status: 'finished' };
}

function quizReducer(state, action) {
  switch (action.type) {
    case 'start':
      if (state.status === 'ready') {
        return { ...state, status: 'active' };
      }
      if (state.status === 'idle' || state.status === 'error') {
        return {
          ...state,
          status: 'loading',
          categoryId: action.categoryId ?? state.categoryId,
          difficulty: action.difficulty ?? state.difficulty,
          errorMessage: '',
        };
      }
      return state;
    case 'dataReceived':
      if (state.status !== 'loading' || action.questions.length === 0) {
        return state.status === 'loading'
          ? { ...state, status: 'error', errorMessage: 'The trivia service returned no questions.' }
          : state;
      }
      return {
        ...state,
        status: 'ready',
        questions: action.questions,
        index: 0,
        answer: null,
        points: 0,
        secondsRemaining: secondsPerQuestion,
        errorMessage: '',
      };
    case 'dataFailed':
      return state.status === 'loading'
        ? { ...state, status: 'error', errorMessage: action.message }
        : state;
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
      return { ...initialState };
    case 'tick':
      if (state.status !== 'active' || state.answer !== null) return state;
      return state.secondsRemaining <= 1
        ? finishQuiz({ ...state, secondsRemaining: 0 })
        : { ...state, secondsRemaining: state.secondsRemaining - 1 };
    default:
      return state;
  }
}

function decodeHtml(value) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
}

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function createQuestions(results) {
  return results.map((item, index) => {
    if (!Array.isArray(item.incorrect_answers) || typeof item.correct_answer !== 'string') {
      throw new Error('The trivia service returned an invalid question.');
    }

    const choices = shuffle([
      { text: decodeHtml(item.correct_answer), correct: true },
      ...item.incorrect_answers.map((answer) => ({
        text: decodeHtml(answer),
        correct: false,
      })),
    ]);

    return {
      id: index,
      category: decodeHtml(item.category),
      text: decodeHtml(item.question),
      answers: choices.map((choice) => choice.text),
      correctAnswerIndex: choices.findIndex((choice) => choice.correct),
    };
  });
}

export default function App() {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const [savedHighscore, setSavedHighscore, highscoreStorageError] = useLocalStorageState(
    'quiz-highscore',
    0,
  );
  const [savedSettings, setSavedSettings, settingsStorageError] = useLocalStorageState(
    'quiz-last-settings',
    { categoryId: null, difficulty: 'easy' },
  );
  const [categoryState, setCategoryState] = useState({
    status: 'loading',
    categories: [],
    errorMessage: '',
  });
  const [categoryRetry, setCategoryRetry] = useState(0);
  const highscore = Number.isFinite(savedHighscore) && savedHighscore >= 0
    ? savedHighscore
    : 0;
  const lastSettings = savedSettings && typeof savedSettings === 'object'
    ? savedSettings
    : { categoryId: null, difficulty: 'easy' };
  const storageErrors = [highscoreStorageError, settingsStorageError].filter(Boolean);

  useEffect(() => {
    if (state.status === 'finished' && state.points > highscore) {
      setSavedHighscore(state.points);
    }
  }, [state.status, state.points, highscore, setSavedHighscore]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      setCategoryState({ status: 'loading', categories: [], errorMessage: '' });
      try {
        const response = await fetch('https://opentdb.com/api_category.php', {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Category request failed (${response.status}).`);
        }

        const data = await response.json();
        if (!Array.isArray(data.trivia_categories) || data.trivia_categories.length === 0) {
          throw new Error('The trivia service returned an invalid category list.');
        }
        if (!controller.signal.aborted) {
          setCategoryState({
            status: 'ready',
            categories: data.trivia_categories,
            errorMessage: '',
          });
        }
      } catch (error) {
        if (error.name !== 'AbortError' && !controller.signal.aborted) {
          setCategoryState({
            status: 'error',
            categories: [],
            errorMessage: error.message || 'Could not load quiz categories.',
          });
        }
      }
    }

    loadCategories();
    return () => controller.abort();
  }, [categoryRetry]);

  useEffect(() => {
    if (state.status !== 'loading') return undefined;

    const controller = new AbortController();

    async function loadQuestions() {
      try {
        const params = new URLSearchParams({
          amount: String(questionsPerQuiz),
          category: String(state.categoryId),
          difficulty: state.difficulty,
          type: 'multiple',
        });
        const response = await fetch(`https://opentdb.com/api.php?${params}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Question request failed (${response.status}).`);
        }

        const data = await response.json();
        if (!data || data.response_code !== 0) {
          throw new Error(
            responseCodeMessages[data?.response_code] ??
              `The trivia service returned error code ${data?.response_code ?? 'unknown'}.`,
          );
        }
        if (!Array.isArray(data.results)) {
          throw new Error('The trivia service returned an invalid question list.');
        }

        const questions = createQuestions(data.results);
        if (!controller.signal.aborted) {
          dispatch({ type: 'dataReceived', questions });
        }
      } catch (error) {
        if (error.name !== 'AbortError' && !controller.signal.aborted) {
          dispatch({
            type: 'dataFailed',
            message: error.message || 'Could not load quiz questions.',
          });
        }
      }
    }

    loadQuestions();
    return () => controller.abort();
  }, [state.status, state.categoryId, state.difficulty]);

  useEffect(() => {
    if (state.status === 'ready') {
      dispatch({ type: 'start' });
    }
  }, [state.status]);

  useEffect(() => {
    if (state.status !== 'active' || state.answer !== null) return undefined;
    const timerId = window.setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => window.clearInterval(timerId);
  }, [state.status, state.answer, state.index]);

  useEffect(() => {
    if (state.status !== 'active') return undefined;

    function handleKeyDown(event) {
      const target = event.target;
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        (target instanceof HTMLElement &&
          (target.isContentEditable || target.closest('input, textarea, select')))
      ) {
        return;
      }

      if (/^[1-4]$/.test(event.key) && state.answer === null) {
        event.preventDefault();
        dispatch({ type: 'newAnswer', answer: Number(event.key) - 1 });
      } else if (event.key === 'Enter' && state.answer !== null) {
        event.preventDefault();
        dispatch({
          type: state.index === state.questions.length - 1 ? 'finish' : 'nextQuestion',
        });
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.status, state.answer, state.index, state.questions.length]);

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

      {storageErrors.length > 0 && (
        <p className="storage-warning" role="status">
          Your quiz settings or high score could not be saved: {storageErrors.join(' ')}
        </p>
      )}

      {categoryState.status === 'loading' && state.status === 'idle' && (
        <Loading message="Loading quiz categories…" />
      )}

      {categoryState.status === 'error' && state.status === 'idle' && (
        <ErrorMessage
          message={categoryState.errorMessage}
          onRetry={() => setCategoryRetry((retry) => retry + 1)}
        />
      )}

      {state.status === 'idle' && categoryState.status === 'ready' && (
        <StartScreen
          categories={categoryState.categories}
          difficulties={quizDifficulties}
          lastSettings={lastSettings}
          onStart={({ categoryId, difficulty }) => {
            setSavedSettings({ categoryId, difficulty });
            dispatch({ type: 'start', categoryId, difficulty });
          }}
        />
      )}

      {state.status === 'loading' && <Loading message="Loading your questions…" />}

      {state.status === 'error' && (
        <ErrorMessage
          message={state.errorMessage}
          onRetry={() => dispatch({ type: 'start' })}
        />
      )}

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
          highscore={highscore}
          onRestart={() => dispatch({ type: 'restart' })}
        />
      )}

      <footer className="app-footer">
        Made for curious minds <span aria-hidden="true">✳</span>
      </footer>
    </main>
  );
}
