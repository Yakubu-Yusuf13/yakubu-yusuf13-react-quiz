# Quiz Club

A React quiz app powered by the [Open Trivia Database](https://opentdb.com/).

## Features

- Choose a trivia category and difficulty, then play 10 multiple-choice questions.
- Answer each question within 15 seconds; correct and incorrect answers are highlighted.
- Use the keyboard: **1–4** to select an answer and **Enter** to continue.
- Keep your high score and last-used quiz settings in local storage.
- Hear answer feedback through an accessible live region.

## Screenshot

<!-- Replace this placeholder with a screenshot of the quiz UI. -->
![Quiz Club screenshot](./screenshots/quiz-club.png)

## Run locally

```sh
npm install
npm run dev
```

Create a production build and serve it locally:

```sh
npm run build
npm run preview
```

The production files are written to `dist/`.

## Deploy to Vercel

1. Push this repository to GitHub.
2. On [vercel.com](https://vercel.com/), choose **Add New → Project**.
3. Import the GitHub repository. Vercel detects the Vite app automatically.
4. Choose **Deploy**.

## What I learned about hooks

- **`useReducer`** keeps related quiz transitions—loading, answering, scoring, timing, and finishing—in one predictable state machine.
- **`useEffect`** synchronizes with external systems such as the trivia API, the interval timer, and browser keyboard events. Dependency arrays identify the values that restart an effect; cleanup aborts requests, clears timers, and removes event listeners.
- **`useLocalStorageState`** combines React state with browser persistence so preferences and the best score survive reloads.
- **Derived values** such as progress and maximum points stay synchronized with the questions without duplicating state.
