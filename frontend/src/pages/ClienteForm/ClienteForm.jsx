import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useClientes } from '../../hooks/useCliente'
import Layout from '../../components/Layout/Layout'
import styles from './ClienteForm.module.css'
import { mascaraCpf, mascaraTelefone, apenasDigitos } from '../../utils/mascaras'

const FORM_INICIAL = {
  nome: '',
  cpf: '',
  endereco: {
    cep: '',
    logradouro: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
  },
  telefones: [{ tipo: 'CELULAR', numero: '' }],
  emails: [{ endereco: '' }],
}

export default function ClienteForm() {
  const { id } = useParams()
  const isEdicao = Boolean(id)
  const navigate = useNavigate()

  const { criar, atualizar, buscarPorId, carregando } = useClientes()

  const [form, setForm] = useState(FORM_INICIAL)
  const [errors, setErrors] = useState({})
  const [buscandoCep, setBuscandoCep] = useState(false)

  useEffect(() => {
    if (isEdicao) {
      buscarPorId(id).then((cliente) => {
        setForm({
          nome: cliente.nome,
          cpf: cliente.cpf,
          endereco: {
            cep: cliente.endereco?.cep || '',
            logradouro: cliente.endereco?.logradouro || '',
            complemento: cliente.endereco?.complemento || '',
            bairro: cliente.endereco?.bairro || '',
            cidade: cliente.endereco?.cidade || '',
            uf: cliente.endereco?.uf || '',
          },
          telefones: cliente.telefones?.length
            ? cliente.telefones.map((t) => ({ tipo: t.tipo, numero: t.numero }))
            : [{ tipo: 'CELULAR', numero: '' }],
          emails: cliente.emails?.length
            ? cliente.emails.map((e) => ({ endereco: e.endereco }))
            : [{ endereco: '' }],
        })
      })
    }
  }, [id, isEdicao]) // eslint-disable-line

  const handleChange = (e) => {
    let { name, value } = e.target

    if (name === 'cpf') {
      value = mascaraCpf(value)
    }

    setForm((prev) => ({ ...prev, [name]: value }))
    clearError(name)
  }

  const handleEnderecoChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, [name]: value },
    }))
    clearError(`endereco.${name}`)
  }

  const handleCepBlur = async () => {
    const cepLimpo = form.endereco.cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return

    setBuscandoCep(true)
    try {
      const resp = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      )
      const data = await resp.json()
      if (data.erro) {
        setErrors((prev) => ({
          ...prev,
          'endereco.cep': 'CEP não encontrado',
        }))
        return
      }
      setForm((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          uf: data.uf || '',
        },
      }))
    } catch {
      setErrors((prev) => ({
        ...prev,
        'endereco.cep': 'Erro ao consultar CEP',
      }))
    } finally {
      setBuscandoCep(false)
    }
  }

  // ---- Telefones ----

  const handleTelefoneChange = (index, campo, valor) => {
    setForm((prev) => {
      const novos = [...prev.telefones]

      if (campo === 'numero') {
        valor = mascaraTelefone(valor, novos[index].tipo)
      }

      if (campo === 'tipo') {
        novos[index] = {
          ...novos[index],
          tipo: valor,
          numero: mascaraTelefone(
            apenasDigitos(novos[index].numero),
            valor
          ),
        }
        return { ...prev, telefones: novos }
      }

      novos[index] = { ...novos[index], [campo]: valor }
      return { ...prev, telefones: novos }
    })
  }

  const addTelefone = () => {
    setForm((prev) => ({
      ...prev,
      telefones: [...prev.telefones, { tipo: 'CELULAR', numero: '' }],
    }))
  }

  const removeTelefone = (index) => {
    setForm((prev) => ({
      ...prev,
      telefones: prev.telefones.filter((_, i) => i !== index),
    }))
  }

  // ---- Emails ----

  const handleEmailChange = (index, valor) => {
    setForm((prev) => {
      const novos = [...prev.emails]
      novos[index] = { endereco: valor }
      return { ...prev, emails: novos }
    })
  }

  const addEmail = () => {
    setForm((prev) => ({
      ...prev,
      emails: [...prev.emails, { endereco: '' }],
    }))
  }

  const removeEmail = (index) => {
    setForm((prev) => ({
      ...prev,
      emails: prev.emails.filter((_, i) => i !== index),
    }))
  }

  // ---- Validação ----

  const validar = () => {
    const erros = {}

    // ----- Nome -----
    if (!form.nome.trim()) {
      erros.nome = 'Nome é obrigatório'
    } else if (form.nome.trim().length < 3) {
      erros.nome = 'Nome deve ter no mínimo 3 caracteres'
    } else if (form.nome.trim().length > 100) {
      erros.nome = 'Nome deve ter no máximo 100 caracteres'
    } else if (!/^[a-zA-ZÀ-ú0-9 ]+$/.test(form.nome.trim())) {
      erros.nome = 'Nome permite apenas letras, números e espaços (sem @, #, !, etc.)'
    }

    // ----- CPF -----
    const cpfDigitos = apenasDigitos(form.cpf)
    if (!form.cpf.trim()) {
      erros.cpf = 'CPF é obrigatório'
    } else if (cpfDigitos.length !== 11) {
      erros.cpf = 'CPF deve ter 11 dígitos'
    }

    // ----- Endereço -----
    const cepDigitos = apenasDigitos(form.endereco.cep)
    if (!form.endereco.cep.trim()) {
      erros['endereco.cep'] = 'CEP é obrigatório'
    } else if (cepDigitos.length !== 8) {
      erros['endereco.cep'] = 'CEP deve ter 8 dígitos'
    }

    if (!form.endereco.logradouro.trim()) {
      erros['endereco.logradouro'] = 'Logradouro é obrigatório — consulte o CEP ou preencha manualmente'
    }
    if (!form.endereco.bairro.trim()) {
      erros['endereco.bairro'] = 'Bairro é obrigatório — consulte o CEP ou preencha manualmente'
    }
    if (!form.endereco.cidade.trim()) {
      erros['endereco.cidade'] = 'Cidade é obrigatória — consulte o CEP ou preencha manualmente'
    }
    if (!form.endereco.uf.trim()) {
      erros['endereco.uf'] = 'UF é obrigatória (ex: SP, RJ, MG)'
    } else if (!/^[A-Z]{2}$/.test(form.endereco.uf.trim())) {
      erros['endereco.uf'] = 'UF deve ter 2 letras maiúsculas (ex: SP)'
    }

    // ----- Telefones -----
    form.telefones.forEach((tel, i) => {
      const digitos = apenasDigitos(tel.numero)
      if (!tel.numero.trim()) {
        erros[`telefone_${i}`] = 'Número é obrigatório'
      } else if (tel.tipo === 'CELULAR' && digitos.length !== 11) {
        erros[`telefone_${i}`] = 'Celular deve ter 11 dígitos — ex: (11) 99999-9999'
      } else if (tel.tipo !== 'CELULAR' && digitos.length !== 10) {
        erros[`telefone_${i}`] = 'Telefone fixo deve ter 10 dígitos — ex: (11) 9999-9999'
      }
    })

    // ----- Emails -----
    form.emails.forEach((email, i) => {
      if (!email.endereco.trim()) {
        erros[`email_${i}`] = 'Email é obrigatório'
      } else if (!/\S+@\S+\.\S+/.test(email.endereco)) {
        erros[`email_${i}`] = 'Email inválido — deve conter @ e domínio (ex: nome@email.com)'
      }
    })

    setErrors(erros)
    return Object.keys(erros).length === 0
  }

  const clearError = (campo) => {
    if (errors[campo]) {
      setErrors((prev) => ({ ...prev, [campo]: '' }))
    }
  }

  // ---- Submit ----

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validar()) return

    const payload = {
      ...form,
      cpf: apenasDigitos(form.cpf),
      endereco: {
        ...form.endereco,
        cep: apenasDigitos(form.endereco.cep),
      },
      telefones: form.telefones.map((t) => ({
        ...t,
        numero: apenasDigitos(t.numero),
      })),
    }

    try {
      if (isEdicao) {
        await atualizar(id, payload)
      } else {
        await criar(payload)
      }
      navigate('/clientes')
    } catch {
      // Toast já foi exibido pelo hook
    }
  }

  const err = (campo) => errors[campo]

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <button
            className={styles.btnVoltar}
            onClick={() => navigate('/clientes')}
          >
            ← Voltar
          </button>
          <h1>{isEdicao ? 'Editar Cliente' : 'Novo Cliente'}</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* ===== DADOS BÁSICOS ===== */}
          <section className={styles.secao}>
            <h2 className={styles.secaoTitulo}>Dados Básicos</h2>
            <div className={styles.grid2}>
              <div className={styles.campo}>
                <label>Nome *</label>
                <input
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Nome completo"
                  className={err('nome') ? styles.inputErr : ''}
                />
                {err('nome') && <span className={styles.erro}>{err('nome')}</span>}
              </div>
              <div className={styles.campo}>
                <label>CPF *</label>
                <input
                  name="cpf"
                  value={form.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  className={err('cpf') ? styles.inputErr : ''}
                />
                {err('cpf') && <span className={styles.erro}>{err('cpf')}</span>}
              </div>
            </div>
          </section>

          {/* ===== ENDEREÇO ===== */}
          <section className={styles.secao}>
            <h2 className={styles.secaoTitulo}>Endereço</h2>

            <div className={styles.cepRow}>
              <div className={styles.campo}>
                <label>CEP *</label>
                <div className={styles.inputGroup}>
                  <input
                    name="cep"
                    value={form.endereco.cep}
                    onChange={handleEnderecoChange}
                    onBlur={handleCepBlur}
                    placeholder="00000-000"
                    maxLength={9}
                    className={err('endereco.cep') ? styles.inputErr : ''}
                  />
                  {buscandoCep && (
                    <span className={styles.buscando}>Buscando...</span>
                  )}
                </div>
                {err('endereco.cep') && (
                  <span className={styles.erro}>{err('endereco.cep')}</span>
                )}
              </div>
              <div className={styles.campo} style={{ flex: 2 }}>
                <label>Logradouro *</label>
                <input
                  name="logradouro"
                  value={form.endereco.logradouro}
                  onChange={handleEnderecoChange}
                  placeholder="Preenchido automaticamente"
                  className={err('endereco.logradouro') ? styles.inputErr : ''}
                />
                {err('endereco.logradouro') && (
                  <span className={styles.erro}>{err('endereco.logradouro')}</span>
                )}
              </div>
            </div>

            <div className={styles.grid3}>
              <div className={styles.campo}>
                <label>Complemento</label>
                <input
                  name="complemento"
                  value={form.endereco.complemento}
                  onChange={handleEnderecoChange}
                  placeholder="Apto, sala..."
                />
              </div>
              <div className={styles.campo}>
                <label>Bairro *</label>
                <input
                  name="bairro"
                  value={form.endereco.bairro}
                  onChange={handleEnderecoChange}
                  placeholder="Bairro"
                  className={err('endereco.bairro') ? styles.inputErr : ''}
                />
                {err('endereco.bairro') && (
                  <span className={styles.erro}>{err('endereco.bairro')}</span>
                )}
              </div>
              <div className={styles.grid2}>
                <div className={styles.campo}>
                  <label>Cidade *</label>
                  <input
                    name="cidade"
                    value={form.endereco.cidade}
                    onChange={handleEnderecoChange}
                    placeholder="Cidade"
                    className={err('endereco.cidade') ? styles.inputErr : ''}
                  />
                  {err('endereco.cidade') && (
                    <span className={styles.erro}>{err('endereco.cidade')}</span>
                  )}
                </div>
                <div className={styles.campo}>
                  <label>UF *</label>
                  <input
                    name="uf"
                    value={form.endereco.uf}
                    onChange={handleEnderecoChange}
                    placeholder="SP"
                    maxLength={2}
                    className={err('endereco.uf') ? styles.inputErr : ''}
                  />
                  {err('endereco.uf') && (
                    <span className={styles.erro}>{err('endereco.uf')}</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ===== TELEFONES ===== */}
          <section className={styles.secao}>
            <div className={styles.secaoHeader}>
              <h2 className={styles.secaoTitulo}>Telefones</h2>
              <button
                type="button"
                className={styles.btnAdd}
                onClick={addTelefone}
              >
                + Adicionar
              </button>
            </div>

            {form.telefones.map((tel, i) => (
              <div key={i} className={styles.itemLista}>
                <div className={styles.campo} style={{ width: '160px' }}>
                  <label>Tipo</label>
                  <select
                    value={tel.tipo}
                    onChange={(e) =>
                      handleTelefoneChange(i, 'tipo', e.target.value)
                    }
                  >
                    <option value="CELULAR">Celular</option>
                    <option value="RESIDENCIAL">Residencial</option>
                    <option value="COMERCIAL">Comercial</option>
                  </select>
                </div>
                <div className={styles.campo} style={{ flex: 1 }}>
                  <label>Número *</label>
                  <input
                    value={tel.numero}
                    onChange={(e) =>
                      handleTelefoneChange(i, 'numero', e.target.value)
                    }
                    placeholder={
                      tel.tipo === 'CELULAR' ? '(11) 99999-9999' : '(11) 9999-9999'
                    }
                    className={err(`telefone_${i}`) ? styles.inputErr : ''}
                  />
                  {err(`telefone_${i}`) && (
                    <span className={styles.erro}>{err(`telefone_${i}`)}</span>
                  )}
                </div>
                {form.telefones.length > 1 && (
                  <button
                    type="button"
                    className={styles.btnRemover}
                    onClick={() => removeTelefone(i)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </section>

          {/* ===== EMAILS ===== */}
          <section className={styles.secao}>
            <div className={styles.secaoHeader}>
              <h2 className={styles.secaoTitulo}>Emails</h2>
              <button
                type="button"
                className={styles.btnAdd}
                onClick={addEmail}
              >
                + Adicionar
              </button>
            </div>

            {form.emails.map((email, i) => (
              <div key={i} className={styles.itemLista}>
                <div className={styles.campo} style={{ flex: 1 }}>
                  <label>Email {i + 1} *</label>
                  <input
                    type="email"
                    value={email.endereco}
                    onChange={(e) => handleEmailChange(i, e.target.value)}
                    placeholder="email@exemplo.com"
                    className={err(`email_${i}`) ? styles.inputErr : ''}
                  />
                  {err(`email_${i}`) && (
                    <span className={styles.erro}>{err(`email_${i}`)}</span>
                  )}
                </div>
                {form.emails.length > 1 && (
                  <button
                    type="button"
                    className={styles.btnRemover}
                    onClick={() => removeEmail(i)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </section>

          {/* ===== BOTÕES ===== */}
          <div className={styles.botoes}>
            <button
              type="button"
              className={styles.btnCancelar}
              onClick={() => navigate('/clientes')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.btnSalvar}
              disabled={carregando}
            >
              {carregando
                ? 'Salvando...'
                : isEdicao
                ? 'Salvar Alterações'
                : 'Cadastrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}