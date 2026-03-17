package com.seunome.dto.request;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Data
public class EmailRequest {

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String endereco;
}