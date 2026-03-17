package com.seunome.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ClienteResponse {
    private Long id;
    private String nome;
    private String cpf;
    private EnderecoResponse endereco;
    private List<TelefoneResponse> telefones;
    private List<EmailResponse> emails;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
}
