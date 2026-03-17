package com.seunome.mapper;

import com.seunome.dto.request.ClienteRequest;
import com.seunome.dto.request.EmailRequest;
import com.seunome.dto.request.EnderecoRequest;
import com.seunome.dto.request.TelefoneRequest;
import com.seunome.dto.response.*;
import com.seunome.entity.Cliente;
import com.seunome.entity.Email;
import com.seunome.entity.Endereco;
import com.seunome.entity.Telefone;
import com.seunome.util.MascaraUtil;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ClienteMapper {

    public Cliente toEntity(ClienteRequest request) {
        Cliente cliente = new Cliente();
        cliente.setNome(request.getNome());
        cliente.setCpf(MascaraUtil.limparCpf(request.getCpf()));

        Endereco endereco = toEnderecoEntity(request.getEndereco());
        cliente.setEndereco(endereco);

        for (TelefoneRequest tel : request.getTelefones()) {
            Telefone telefone = toTelefoneEntity(tel);
            cliente.addTelefone(telefone);
        }

        for (EmailRequest em : request.getEmails()) {
            Email email = new Email();
            email.setEndereco(em.getEndereco());
            cliente.addEmail(email);
        }

        return cliente;
    }

    public ClienteResponse toResponse(Cliente cliente) {
        return ClienteResponse.builder()
                .id(cliente.getId())
                .nome(cliente.getNome())
                .cpf(MascaraUtil.formatarCpf(cliente.getCpf()))
                .endereco(toEnderecoResponse(cliente.getEndereco()))
                .telefones(toTelefonesResponse(cliente.getTelefones()))
                .emails(toEmailsResponse(cliente.getEmails()))
                .dataCriacao(cliente.getDataCriacao())
                .dataAtualizacao(cliente.getDataAtualizacao())
                .build();
    }

    private Endereco toEnderecoEntity(EnderecoRequest request) {
        return Endereco.builder()
                .cep(MascaraUtil.limparCep(request.getCep()))
                .logradouro(request.getLogradouro())
                .complemento(request.getComplemento())
                .bairro(request.getBairro())
                .cidade(request.getCidade())
                .uf(request.getUf())
                .build();
    }

    private Telefone toTelefoneEntity(TelefoneRequest request) {
        return Telefone.builder()
                .tipo(request.getTipo())
                .numero(MascaraUtil.limparTelefone(request.getNumero()))
                .build();
    }

    private EnderecoResponse toEnderecoResponse(Endereco endereco) {
        if (endereco == null) return null;
        return EnderecoResponse.builder()
                .id(endereco.getId())
                .cep(MascaraUtil.formatarCep(endereco.getCep()))
                .logradouro(endereco.getLogradouro())
                .complemento(endereco.getComplemento())
                .bairro(endereco.getBairro())
                .cidade(endereco.getCidade())
                .uf(endereco.getUf())
                .build();
    }

    private List<TelefoneResponse> toTelefonesResponse(List<Telefone> telefones) {
        return telefones.stream()
                .map(t -> TelefoneResponse.builder()
                        .id(t.getId())
                        .tipo(t.getTipo().name())
                        .numero(MascaraUtil.formatarTelefone(t.getNumero()))
                        .build())
                .collect(Collectors.toList());
    }

    private List<EmailResponse> toEmailsResponse(List<Email> emails) {
        return emails.stream()
                .map(e -> EmailResponse.builder()
                        .id(e.getId())
                        .endereco(e.getEndereco())
                        .build())
                .collect(Collectors.toList());
    }
}
