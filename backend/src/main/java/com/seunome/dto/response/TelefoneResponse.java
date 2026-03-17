package com.seunome.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TelefoneResponse {
    private Long id;
    private String tipo;
    private String numero;
}
