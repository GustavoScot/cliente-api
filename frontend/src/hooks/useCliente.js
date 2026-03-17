import { useState, useCallback } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

export function useClientes() {
  const [clientes, setClientes] = useState([])
  const [paginacao, setPaginacao] = useState({
    paginaAtual: 0,
    totalPaginas: 0,
    totalElementos: 0,
    tamanhoPagina: 10,
  })
  const [carregando, setCarregando] = useState(false)

  const listar = useCallback(async (pagina = 0, tamanho = 10) => {
    setCarregando(true)
    try {
      const { data } = await api.get('/clientes', {
        params: { page: pagina, size: tamanho, sort: 'nome,asc' },
      })
      setClientes(data.content)
      setPaginacao({
        paginaAtual: data.number,
        totalPaginas: data.totalPages,
        totalElementos: data.totalElements,
        tamanhoPagina: data.size,
      })
    } catch (error) {
      toast.error('Erro ao carregar clientes')
      console.error(error)
    } finally {
      setCarregando(false)
    }
  }, [])

  const buscarPorId = useCallback(async (id) => {
    setCarregando(true)
    try {
      const { data } = await api.get(`/clientes/${id}`)
      return data
    } catch (error) {
      toast.error('Cliente não encontrado')
      throw error
    } finally {
      setCarregando(false)
    }
  }, [])

  const criar = useCallback(async (dadosCliente) => {
    setCarregando(true)
    try {
      const { data } = await api.post('/clientes', dadosCliente)
      toast.success('Cliente cadastrado com sucesso!')
      return data
    } catch (error) {
      const mensagem =
        error.response?.data?.mensagem ||
        error.response?.data?.detalhes?.join(', ') ||
        'Erro ao cadastrar cliente'
      toast.error(mensagem)
      throw error
    } finally {
      setCarregando(false)
    }
  }, [])

  const atualizar = useCallback(async (id, dadosCliente) => {
    setCarregando(true)
    try {
      const { data } = await api.put(`/clientes/${id}`, dadosCliente)
      toast.success('Cliente atualizado com sucesso!')
      return data
    } catch (error) {
      const mensagem =
        error.response?.data?.mensagem || 'Erro ao atualizar cliente'
      toast.error(mensagem)
      throw error
    } finally {
      setCarregando(false)
    }
  }, [])

  const deletar = useCallback(async (id) => {
    setCarregando(true)
    try {
      await api.delete(`/clientes/${id}`)
      toast.success('Cliente removido com sucesso!')
      setClientes((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {
      toast.error('Erro ao remover cliente')
      throw error
    } finally {
      setCarregando(false)
    }
  }, [])

  const consultarCep = useCallback(async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return null
    try {
      const { data } = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      ).then((r) => r.json())
      if (data?.erro) return null
      return data
    } catch {
      return null
    }
  }, [])

  return {
    clientes,
    paginacao,
    carregando,
    listar,
    buscarPorId,
    criar,
    atualizar,
    deletar,
    consultarCep,
  }
}