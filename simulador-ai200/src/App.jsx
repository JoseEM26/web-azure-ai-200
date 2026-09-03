import { useState } from 'react'
import { useExam } from './hooks/useExam'
import StartScreen from './components/StartScreen'
import ExamHeader from './components/ExamHeader'
import SidebarNav from './components/SidebarNav'
import QuestionCard from './components/QuestionCard'
import LearnAssistantPanel from './components/LearnAssistantPanel'
import NotepadModal from './components/NotepadModal'
import ConfirmModal from './components/ConfirmModal'
import ResultsScreen from './components/ResultsScreen'

export default function App() {
  const { state, startExam, answerQuestion, toggleFlag, saveNote, finishExam, resetToStart } =
    useExam()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [notepadOpen, setNotepadOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [studyMode, setStudyMode] = useState(false)

  if (state.screen === 'start') {
    return <StartScreen onStart={startExam} />
  }

  if (state.screen === 'results') {
    return (
      <ResultsScreen
        state={state}
        onRetry={() => {
          resetToStart()
          startExam()
          setCurrentIndex(0)
        }}
      />
    )
  }

  const question = state.questions[currentIndex]

  return (
    <div className="min-h-screen">
      <ExamHeader
        current={currentIndex + 1}
        total={state.questions.length}
        remainingSeconds={state.remainingSeconds}
        onOpenAssistant={() => setAssistantOpen(true)}
        onOpenNotepad={() => setNotepadOpen(true)}
        onToggleFlag={() => toggleFlag(question.id)}
        isFlagged={state.flagged.includes(question.id)}
        onFinish={() => setConfirmOpen(true)}
      />

      <div className="pt-16 flex flex-col lg:flex-row">
        <SidebarNav
          questions={state.questions}
          answers={state.answers}
          flagged={state.flagged}
          currentIndex={currentIndex}
          onSelect={setCurrentIndex}
        />

        <main className="flex-1 p-4 sm:p-8">
          <div className="max-w-3xl mx-auto flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 text-xs text-slate-400 font-mono cursor-pointer select-none">
              <input
                type="checkbox"
                checked={studyMode}
                onChange={(e) => setStudyMode(e.target.checked)}
                className="accent-azure"
              />
              Modo Estudio Inmediato
            </label>
          </div>

          <QuestionCard
            question={question}
            selected={state.answers[question.id]}
            onAnswer={(displayId) => answerQuestion(question.id, displayId)}
            studyMode={studyMode}
          />

          <div className="max-w-3xl mx-auto flex justify-between mt-6">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              className="px-4 py-2 rounded-md border border-stroke bg-panel text-sm text-slate-300 disabled:opacity-30 hover:border-azure/40 transition"
            >
              Anterior
            </button>
            <button
              disabled={currentIndex === state.questions.length - 1}
              onClick={() => setCurrentIndex((i) => Math.min(state.questions.length - 1, i + 1))}
              className="px-4 py-2 rounded-md bg-azure hover:bg-azure-hover text-white text-sm font-medium disabled:opacity-30 transition"
            >
              Siguiente
            </button>
          </div>
        </main>
      </div>

      <LearnAssistantPanel
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        question={question}
      />

      <NotepadModal
        open={notepadOpen}
        onClose={() => setNotepadOpen(false)}
        questionNumber={currentIndex + 1}
        value={state.notes[question.id]}
        onSave={(text) => saveNote(question.id, text)}
      />

      <ConfirmModal
        open={confirmOpen}
        title="Finalizar examen"
        message="¿Seguro que querés finalizar? No vas a poder seguir respondiendo preguntas después de esto."
        confirmLabel="Finalizar examen"
        onConfirm={() => {
          setConfirmOpen(false)
          finishExam('manual')
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
