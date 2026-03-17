package com.seunome.dto.request;

import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.*;
import java.util.List;

@Data
public class ClienteRequest {

    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 100, message = "Nome deve ter entre 3 e 100 caracteres")
    @Pattern(regexp = "^[a-zA-ZÀ-ú0-9 ]+$", message = "Nome permite apenas letras, números e espaços")
    private String nome;

    @NotBlank(message = "CPF é obrigatório")
    @Pattern(regexp = "\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}",
            message = "CPF inválido. Use formato 000.000.000-00 ou apenas dígitos")
    private String cpf;

    @NotNull(message = "Endereço é obrigatório")
    @Valid
    private EnderecoRequest endereco;

    @NotNull
    @Size(min = 1, message = "Ao menos um telefone é obrigatório")
    @Valid
    private List<TelefoneRequest> telefones;

    @NotNull
    @Size(min = 1, message = "Ao menos um email é obrigatório")
    @Valid
    private List<EmailRequest> emails;
}
