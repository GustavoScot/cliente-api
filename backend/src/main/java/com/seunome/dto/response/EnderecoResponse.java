package com.seunome.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EnderecoResponse {
    private Long id;
    private String cep;
    private String logradouro;
    private String complemento;
    private String bairro;
    private String cidade;
    private String uf;
}
