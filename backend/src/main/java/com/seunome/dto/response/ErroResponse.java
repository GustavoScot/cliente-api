package com.seunome.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ErroResponse {
    private int status;
    private String erro;
    private String mensagem;
    private LocalDateTime timestamp;
    private List<String> detalhes;
}
