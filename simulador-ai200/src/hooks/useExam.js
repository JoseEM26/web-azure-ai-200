import { useCallback, useEffect, useRef, useState } from 'react'
import questionBank from '../data/questions.json'

const STORAGE_KEY = 'ai200-simulador-v1'
const TOTAL_QUESTIONS = 50
const EXAM_SECONDS = 120 * 60
const PASS_SCORE = 700

function shuffle(array) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildAttempt() {
  const picked = shuffle(questionBank).slice(0, TOTAL_QUESTIONS)
  const questions = picked.map((q) => {
    const order = shuffle(q.options.map((o) => o.id))
    const displayLetters = ['A', 'B', 'C', 'D']
    const options = order.map((originalId, idx) => ({
      displayId: displayLetters[idx],
      originalId,
      text: q.options.find((o) => o.id === originalId).text,
    }))
    const correctDisplayId = options.find((o) => o.originalId === q.correctAnswer).displayId
    return { ...q, options, correctDisplayId }
  })
  return {
    questions,
    answers: {},
    flagged: [],
    notes: {},
    remainingSeconds: EXAM_SECONDS,
    screen: 'exam',
    startedAt: Date.now(),
    finished: false,
    result: null,
  }
}

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ponytail: localStorage puede fallar (modo privado, cuota llena); el examen sigue funcionando en memoria.
  }
}

export function useExam() {
  const [state, setState] = useState(() => loadSaved() ?? { screen: 'start' })
  const tickRef = useRef(null)

  useEffect(() => {
    if (state.screen === 'exam' && !state.finished) {
      save(state)
    }
  }, [state])

  const finishExam = useCallback((reason) => {
    setState((prev) => {
      if (prev.screen !== 'exam') return prev
      const timeUsedSeconds = EXAM_SECONDS - prev.remainingSeconds
      const domainTotals = {}
      let correctCount = 0
      prev.questions.forEach((q) => {
        const chosen = prev.answers[q.id]
        const isCorrect = chosen === q.correctDisplayId
        if (isCorrect) correctCount += 1
        const d = (domainTotals[q.domain] ??= { correct: 0, total: 0 })
        d.total += 1
        if (isCorrect) d.correct += 1
      })
      const totalScore = Math.round((correctCount / prev.questions.length) * 1000)
      const result = {
        totalScore,
        passed: totalScore >= PASS_SCORE,
        correctCount,
        totalQuestions: prev.questions.length,
        timeUsedSeconds,
        autoSubmitted: reason === 'timeout',
        domainBreakdown: Object.fromEntries(
          Object.entries(domainTotals).map(([domain, v]) => [
            domain,
            { ...v, percent: Math.round((v.correct / v.total) * 100) },
          ]),
        ),
      }
      const next = { ...prev, screen: 'results', finished: true, result }
      save(next)
      return next
    })
  }, [])

  useEffect(() => {
    if (state.screen !== 'exam' || state.finished) return
    tickRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.screen !== 'exam' || prev.finished) return prev
        const remainingSeconds = prev.remainingSeconds - 1
        if (remainingSeconds <= 0) {
          return { ...prev, remainingSeconds: 0 }
        }
        return { ...prev, remainingSeconds }
      })
    }, 1000)
    return () => clearInterval(tickRef.current)
  }, [state.screen, state.finished])

  useEffect(() => {
    if (state.screen === 'exam' && !state.finished && state.remainingSeconds === 0) {
      finishExam('timeout')
    }
  }, [state.remainingSeconds, state.screen, state.finished, finishExam])

  const startExam = useCallback(() => {
    const next = buildAttempt()
    save(next)
    setState(next)
  }, [])

  const answerQuestion = useCallback((questionId, displayId) => {
    setState((prev) => ({ ...prev, answers: { ...prev.answers, [questionId]: displayId } }))
  }, [])

  const toggleFlag = useCallback((questionId) => {
    setState((prev) => {
      const flagged = prev.flagged.includes(questionId)
        ? prev.flagged.filter((id) => id !== questionId)
        : [...prev.flagged, questionId]
      return { ...prev, flagged }
    })
  }, [])

  const saveNote = useCallback((questionId, text) => {
    setState((prev) => ({ ...prev, notes: { ...prev.notes, [questionId]: text } }))
  }, [])

  const resetToStart = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState({ screen: 'start' })
  }, [])

  return {
    state,
    startExam,
    answerQuestion,
    toggleFlag,
    saveNote,
    finishExam,
    resetToStart,
    EXAM_SECONDS,
    PASS_SCORE,
  }
}
