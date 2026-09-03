import { useCallback, useEffect, useRef, useState } from 'react'

const PASS_SCORE = 700

function shuffle(array) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildAttempt(questionBank, totalQuestions, examSeconds) {
  const picked = shuffle(questionBank).slice(0, totalQuestions)
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
    remainingSeconds: examSeconds,
    screen: 'exam',
    startedAt: Date.now(),
    finished: false,
    result: null,
  }
}

function loadSaved(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function save(storageKey, state) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state))
  } catch {
    // ponytail: localStorage puede fallar (modo privado, cuota llena); el examen sigue funcionando en memoria.
  }
}

export function useExam({ examId, questionBank, totalQuestions, durationMinutes }) {
  const storageKey = `${examId}-simulador-v1`
  const examSeconds = durationMinutes * 60
  const [state, setState] = useState(() => loadSaved(storageKey) ?? { screen: 'start' })
  const tickRef = useRef(null)

  useEffect(() => {
    if (state.screen === 'exam' && !state.finished) {
      save(storageKey, state)
    }
  }, [state, storageKey])

  const finishExam = useCallback(
    (reason) => {
      setState((prev) => {
        if (prev.screen !== 'exam') return prev
        const timeUsedSeconds = examSeconds - prev.remainingSeconds
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
        save(storageKey, next)
        return next
      })
    },
    [examSeconds, storageKey],
  )

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
    const next = buildAttempt(questionBank, totalQuestions, examSeconds)
    save(storageKey, next)
    setState(next)
  }, [questionBank, totalQuestions, examSeconds, storageKey])

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
    localStorage.removeItem(storageKey)
    setState({ screen: 'start' })
  }, [storageKey])

  return {
    state,
    startExam,
    answerQuestion,
    toggleFlag,
    saveNote,
    finishExam,
    resetToStart,
    EXAM_SECONDS: examSeconds,
    PASS_SCORE,
  }
}
