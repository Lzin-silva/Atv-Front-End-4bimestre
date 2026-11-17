
import { useEffect, useState } from 'react'

function App() {
  const [novaTarefa, setNovaTarefa] = useState('')
  const [tarefas, setTarefas] = useState(() => {
    const salvas = localStorage.getItem('minhas-tarefas')
    return salvas ? JSON.parse(salvas) : []
  })
  const [filtro, setFiltro] = useState('todas')

  // Salva as tarefas automaticamente
  useEffect(() => {
    localStorage.setItem('minhas-tarefas', JSON.stringify(tarefas))
  }, [tarefas])

  // Adiciona tarefa
  function adicionarTarefa(e) {
    e.preventDefault()

    if (!novaTarefa.trim()) return

    const nova = {
      id: crypto.randomUUID(),
      nome: novaTarefa.trim(),
      concluida: false,
    }

    setTarefas((atuais) => [...atuais, nova])
    setNovaTarefa('')
  }

  // Marca como concluída
  function alternarTarefa(id) {
    setTarefas((atuais) =>
      atuais.map((tarefa) =>
        tarefa.id === id
          ? { ...tarefa, concluida: !tarefa.concluida }
          : tarefa
      )
    )
  }

  // Exclui tarefa
  function excluirTarefa(id) {
    setTarefas((atuais) =>
      atuais.filter((tarefa) => tarefa.id !== id)
    )
  }

  // Limpa tarefas concluídas
  function limparConcluidas() {
    setTarefas((atuais) =>
      atuais.filter((tarefa) => !tarefa.concluida)
    )
  }

  const concluidas = tarefas.filter((t) => t.concluida).length
  const pendentes = tarefas.length - concluidas

  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtro === 'pendentes') return !tarefa.concluida
    if (filtro === 'concluidas') return tarefa.concluida
    return true
  })

  const progresso = tarefas.length
    ? Math.round((concluidas / tarefas.length) * 100)
    : 0

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:py-12">
      <div className="mx-auto w-full max-w-2xl">

        {/* Cabeçalho */}
        <header className="mb-8">
          <span className="text-sm font-bold tracking-widest text-blue-400">
            ORGANIZAÇÃO PESSOAL
          </span>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Minha lista de tarefas
          </h1>

          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Organize seu dia, uma tarefa de cada vez.
          </p>
        </header>

        {/* Formulário */}
        <form
          onSubmit={adicionarTarefa}
          className="mb-6 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={novaTarefa}
            onChange={(e) => setNovaTarefa(e.target.value)}
            placeholder="O que você precisa fazer?" 
            placeholder2="algo em mente?" 
            maxLength={100}
            className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />

          <button
            type="submit"
            disabled={!novaTarefa.trim()}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            + Adicionar
          </button>
        </form>

        {/* Indicadores */}
        <section className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm text-slate-400">Total</p>
            <p className="mt-1 text-2xl font-bold">{tarefas.length}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-sm text-slate-400">Pendentes</p>
            <p className="mt-1 text-2xl font-bold text-yellow-400">
              {pendentes}
            </p>
          </div>

          <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:col-span-1">
            <p className="text-sm text-slate-400">Concluídas</p>
            <p className="mt-1 text-2xl font-bold text-green-400">
              {concluidas}
            </p>
          </div>
        </section>

        {/* Barra de progresso */}
        <section className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="mb-3 flex justify-between text-sm">
            <span className="text-slate-300">Seu progresso</span>
            <span className="font-bold text-blue-400">{progresso}%</span>
          </div>

          <div
            className="h-2 overflow-hidden rounded-full bg-slate-700"
            role="progressbar"
            aria-valuenow={progresso}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso das tarefas"
          >
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </section>

        {/* Filtros */}
        <section className="mb-5 flex flex-wrap gap-2">
          {[
            { valor: 'todas', nome: 'Todas' },
            { valor: 'pendentes', nome: 'Pendentes' },
            { valor: 'concluidas', nome: 'Concluídas' },
          ].map((opcao) => (
            <button
              key={opcao.valor}
              onClick={() => setFiltro(opcao.valor)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filtro === opcao.valor
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {opcao.nome}
            </button>
          ))}
        </section>

        {/* Lista */}
        <section className="space-y-3">
          {tarefasFiltradas.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
              <p className="font-semibold text-slate-300">
                {tarefas.length === 0
                  ? 'Sua lista está vazia!'
                  : 'Nenhuma tarefa encontrada.'}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {tarefas.length === 0
                  ? 'Adicione sua primeira tarefa para começar.'
                  : 'Experimente selecionar outro filtro.'}
              </p>
            </div>
          ) : (
            tarefasFiltradas.map((tarefa) => (
              <article
                key={tarefa.id}
                className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 transition hover:border-slate-700"
              >
                <input
                  type="checkbox"
                  checked={tarefa.concluida}
                  onChange={() => alternarTarefa(tarefa.id)}
                  className="h-5 w-5 shrink-0 cursor-pointer accent-blue-500"
                  aria-label={`Concluir ${tarefa.nome}`}
                />

                <span
                  className={`min-w-0 flex-1 break-words text-sm sm:text-base ${
                    tarefa.concluida
                      ? 'text-slate-500 line-through'
                      : 'text-slate-100'
                  }`}
                >
                  {tarefa.nome}
                </span>

                <button
                  type="button"
                  onClick={() => excluirTarefa(tarefa.id)}
                  className="shrink-0 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                  aria-label={`Excluir ${tarefa.nome}`}
                >
                  Excluir
                </button>
              </article>
            ))
          )}
        </section>

        {/* Rodapé */}
        {concluidas > 0 && (
          <footer className="mt-6 flex justify-end">
            <button
              onClick={limparConcluidas}
              className="text-sm text-red-400 transition hover:text-red-300"
            >
              Limpar tarefas concluídas
            </button>
          </footer>
        )}

        <footer className="mt-12 border-t border-slate-800 pt-5 text-center text-xs text-slate-500">
          Desenvolvido com React e Tailwind CSS
        </footer>

      </div>
    </main>
  )
}

export default App
