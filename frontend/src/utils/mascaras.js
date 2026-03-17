export function mascaraCpf(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function mascaraTelefone(valor, tipo) {
  const digitos = valor.replace(/\D/g, '')

  if (tipo === 'CELULAR') {
    return digitos
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
  }

  return digitos
    .slice(0, 10)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4})(\d{1,4})$/, '$1-$2')
}

export function apenasDigitos(valor) {
  return valor ? valor.replace(/\D/g, '') : ''
}