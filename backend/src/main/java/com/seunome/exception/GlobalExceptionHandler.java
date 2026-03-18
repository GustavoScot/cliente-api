package com.seunome.exception;

import com.seunome.dto.response.ErroResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponse> handleValidation(MethodArgumentNotValidException ex) {
        List<String> detalhes = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.toList());

        ErroResponse erro = ErroResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .erro("Erro de Validação")
                .mensagem("Um ou mais campos estão inválidos")
                .detalhes(detalhes)
                .timestamp(LocalDateTime.now())
                .build();

        log.warn("Erro de validação: {}", detalhes);
        return ResponseEntity.badRequest().body(erro);
    }

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResponse> handleNaoEncontrado(RecursoNaoEncontradoException ex) {
        ErroResponse erro = ErroResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .erro("Não Encontrado")
                .mensagem(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        log.warn("Recurso não encontrado: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
    }

    @ExceptionHandler(CepInvalidoException.class)
    public ResponseEntity<ErroResponse> handleCepInvalido(CepInvalidoException ex) {
        ErroResponse erro = ErroResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .erro("CEP Inválido")
                .mensagem(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.badRequest().body(erro);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErroResponse> handleBadCredentials(BadCredentialsException ex) {
        ErroResponse erro = ErroResponse.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .erro("Não Autorizado")
                .mensagem("Login ou senha inválidos")
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(erro);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErroResponse> handleAccessDenied(AccessDeniedException ex) {
        ErroResponse erro = ErroResponse.builder()
                .status(HttpStatus.FORBIDDEN.value())
                .erro("Acesso Negado")
                .mensagem("Você não tem permissão para esta operação")
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(erro);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponse> handleGeneral(Exception ex) {
        ErroResponse erro = ErroResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .erro("Erro Interno")
                .mensagem("Ocorreu um erro inesperado. Tente novamente.")
                .timestamp(LocalDateTime.now())
                .build();

        log.error("Erro inesperado: ", ex);
        return ResponseEntity.internalServerError().body(erro);
    }
}
