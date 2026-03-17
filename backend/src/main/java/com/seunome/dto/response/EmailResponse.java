package com.seunome.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmailResponse {
    private Long id;
    private String endereco;
}
