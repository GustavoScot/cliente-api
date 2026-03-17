package com.seunome.util;

public final class MascaraUtil {

    private MascaraUtil() {
        throw new UnsupportedOperationException("Classe utilitária não deve ser instanciada");
    }

    public static String formatarCpf(String cpf) {
        if (cpf == null || cpf.length() != 11) return cpf;
        return cpf.replaceAll("(\\d{3})(\\d{3})(\\d{3})(\\d{2})", "$1.$2.$3-$4");
    }

    public static String limparCpf(String cpf) {
        if (cpf == null) return null;
        return cpf.replaceAll("[^\\d]", "");
    }

    public static String formatarCep(String cep) {
        if (cep == null || cep.length() != 8) return cep;
        return cep.replaceAll("(\\d{5})(\\d{3})", "$1-$2");
    }

    public static String limparCep(String cep) {
        if (cep == null) return null;
        return cep.replaceAll("[^\\d]", "");
    }

    public static String formatarTelefone(String numero) {
        if (numero == null) return null;
        String digits = numero.replaceAll("[^\\d]", "");
        if (digits.length() == 11) {
            return digits.replaceAll("(\\d{2})(\\d{5})(\\d{4})", "($1) $2-$3");
        } else if (digits.length() == 10) {
            return digits.replaceAll("(\\d{2})(\\d{4})(\\d{4})", "($1) $2-$3");
        }
        return numero;
    }

    public static String limparTelefone(String numero) {
        if (numero == null) return null;
        return numero.replaceAll("[^\\d]", "");
    }
}