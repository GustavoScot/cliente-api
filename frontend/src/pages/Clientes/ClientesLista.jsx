import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useClientes } from '../../hooks/useCliente'
import Layout from '../../components/Layout/Layout'
import styles from './ClientesLista.module.css'

export default function ClientesLista() {
  const { usuario } = useAuth()
  const { clientes, paginacao, carregando, listar, deletar } = useClientes()
  const navigate = useNavigate()
  const [paginaAtual, setPaginaAtual] = useState(0)
  const [confirmarDelete, setConfirmarDelete] = useState(null)

  useEffect(() => {
    listar(paginaAtual)
  }, [paginaAtual, listar])

  const handleDelete = async (id) => {
    await deletar(id)
    setConfirmarDelete(null)
    listar(paginaAtual)
  }

  return (
    <Layout>
      <div className={styles.container}>

        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Clientes</h1>
            <p className={styles.subtitle}>
              {paginacao.totalElementos} cliente(s) cadastrado(s)
            </p>
          </div>
          {usuario?.isAdmin && (
            <button
              className={styles.btnNovo}
              onClick={() => navigate('/clientes/novo')}
            >
              + Novo Cliente
            </button>
          )}
        </div>

        {carregando && (
          <div className={styles.loading}>Carregando...</div>
        )}

        {!carregando && clientes.length === 0 && (
          <div className={styles.empty}>
            <p>Nenhum cliente cadastrado ainda.</p>
            {usuario?.isAdmin && (
              <button
                className={styles.btnNovo}
                onClick={() => navigate('/clientes/novo')}
              >
                Cadastrar primeiro cliente
              </button>
            )}
          </div>
        )}

        {!carregando && clientes.length > 0 && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Cidade/UF</th>
                  <th>Telefone</th>
                  <th>Email</th>
                  {usuario?.isAdmin && <th>Ações</th>}
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td><strong>{cliente.nome}</strong></td>
                    <td>{cliente.cpf}</td>
                    <td>
                      {cliente.endereco?.cidade}/{cliente.endereco?.uf}
                    </td>
                    <td>
                      {cliente.telefones?.map((tel, i) => (
                        <div key={i} style={{ fontSize: '0.85rem' }}>
                          <span style={{ color: '#888', marginRight: '0.3rem' }}>
                            {tel.tipo}:
                          </span>
                          {tel.numero}
                        </div>
                      ))}
                    </td>
                    <td>
                      {cliente.emails?.map((email, i) => (
                        <div key={i} style={{ fontSize: '0.85rem' }}>
                          {email.endereco}
                        </div>
                      ))}
                    </td>

                    {usuario?.isAdmin && (
                      <td>
                        <div className={styles.acoes}>
                          <button
                            className={styles.btnEditar}
                            onClick={() =>
                              navigate(`/clientes/${cliente.id}/editar`)
                            }
                          >
                            Editar
                          </button>
                          <button
                            className={styles.btnDeletar}
                            onClick={() => setConfirmarDelete(cliente)}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {paginacao.totalPaginas > 1 && (
          <div className={styles.paginacao}>
            <button
              disabled={paginaAtual === 0}
              onClick={() => setPaginaAtual((p) => p - 1)}
              className={styles.btnPagina}
            >
              ← Anterior
            </button>
            <span>
              Página {paginaAtual + 1} de {paginacao.totalPaginas}
            </span>
            <button
              disabled={paginaAtual >= paginacao.totalPaginas - 1}
              onClick={() => setPaginaAtual((p) => p + 1)}
              className={styles.btnPagina}
            >
              Próxima →
            </button>
          </div>
        )}
      </div>

      {confirmarDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirmar exclusão</h3>
            <p>
              Tem certeza que deseja excluir o cliente{' '}
              <strong>{confirmarDelete.nome}</strong>?
            </p>
            <p className={styles.modalAviso}>
              Esta ação não pode ser desfeita.
            </p>
            <div className={styles.modalBotoes}>
              <button
                onClick={() => setConfirmarDelete(null)}
                className={styles.btnCancelar}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmarDelete.id)}
                className={styles.btnConfirmarDelete}
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}