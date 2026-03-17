package com.seunome.dto.request;

import com.seunome.entity.Telefone.TipoTelefone;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Data
public class TelefoneRequest {

    @NotNull(message = "Tipo do telefone é obrigatório")
    private TipoTelefone tipo;

    @NotBlank(message = "Número do telefone é obrigatório")
    @Pattern(regexp = "\\d{10,11}", message = "Número deve conter 10 ou 11 dígitos (sem máscara)")
    private String numero;
}
