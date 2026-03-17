package com.seunome.service;

import com.seunome.dto.response.ViaCepResponse;
import com.seunome.exception.CepInvalidoException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Slf4j
@Service
@RequiredArgsConstructor
public class ViaCepService {

    private final WebClient webClient;

    @Value("${app.viacep.url}")
    private String viaCepUrl;

    public ViaCepResponse consultarCep(String cep) {
        log.info("Consultando ViaCEP para o CEP: {}", cep);

        try {
            ViaCepResponse response = webClient
                    .get()
                    .uri(viaCepUrl + "/{cep}/json/", cep)
                    .retrieve()
                    .bodyToMono(ViaCepResponse.class)
                    .block();

            if (response == null || response.isCepInvalido()) {
                log.warn("CEP não encontrado: {}", cep);
                throw new CepInvalidoException("CEP " + cep + " não encontrado");
            }

            log.info("CEP {} encontrado: {}, {}", cep, response.getLogradouro(), response.getCidade());
            return response;

        } catch (WebClientResponseException e) {
            log.error("Erro ao consultar ViaCEP: {}", e.getMessage());
            throw new CepInvalidoException("Erro ao consultar CEP: " + e.getMessage());
        }
    }
}
