package com.seunome.service;

import com.seunome.dto.request.ClienteRequest;
import com.seunome.dto.request.EmailRequest;
import com.seunome.dto.request.TelefoneRequest;
import com.seunome.dto.response.ClienteResponse;
import com.seunome.dto.response.ViaCepResponse;
import com.seunome.entity.Cliente;
import com.seunome.entity.Email;
import com.seunome.entity.Endereco;
import com.seunome.entity.Telefone;
import com.seunome.exception.RecursoNaoEncontradoException;
import com.seunome.mapper.ClienteMapper;
import com.seunome.repository.ClienteRepository;
import com.seunome.util.MascaraUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final ClienteMapper clienteMapper;
    private final ViaCepService viaCepService;

    public ClienteResponse criar(ClienteRequest request) {
        log.info("Criando cliente: {}", request.getNome());

        String cepLimpo = MascaraUtil.limparCep(request.getEndereco().getCep());
        ViaCepResponse viaCep = viaCepService.consultarCep(cepLimpo);

        Cliente cliente = clienteMapper.toEntity(request);

        Endereco endereco = cliente.getEndereco();
        endereco.setCep(cepLimpo);
        endereco.setLogradouro(viaCep.getLogradouro());
        endereco.setBairro(viaCep.getBairro());
        endereco.setCidade(viaCep.getCidade());
        endereco.setUf(viaCep.getUf());

        Cliente salvo = clienteRepository.save(cliente);
        log.info("Cliente criado com ID: {}", salvo.getId());

        return clienteMapper.toResponse(salvo);
    }

    @Transactional(readOnly = true)
    public Page<ClienteResponse> listar(Pageable pageable) {
        log.debug("Listando clientes - página: {}, tamanho: {}", pageable.getPageNumber(), pageable.getPageSize());
        return clienteRepository.findAll(pageable)
                .map(clienteMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscarPorId(Long id) {
        log.debug("Buscando cliente ID: {}", id);
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado com ID: " + id));
        return clienteMapper.toResponse(cliente);
    }

    public ClienteResponse atualizar(Long id, ClienteRequest request) {
        log.info("Atualizando cliente ID: {}", id);

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado com ID: " + id));

        cliente.setNome(request.getNome());
        cliente.setCpf(MascaraUtil.limparCpf(request.getCpf()));

        String cepLimpo = MascaraUtil.limparCep(request.getEndereco().getCep());
        ViaCepResponse viaCep = viaCepService.consultarCep(cepLimpo);

        Endereco endereco = cliente.getEndereco();
        endereco.setCep(cepLimpo);
        endereco.setLogradouro(viaCep.getLogradouro());
        endereco.setComplemento(request.getEndereco().getComplemento());
        endereco.setBairro(viaCep.getBairro());
        endereco.setCidade(viaCep.getCidade());
        endereco.setUf(viaCep.getUf());

        cliente.getTelefones().clear();
        for (TelefoneRequest telReq : request.getTelefones()) {
            Telefone telefone = Telefone.builder()
                    .tipo(telReq.getTipo())
                    .numero(MascaraUtil.limparTelefone(telReq.getNumero()))
                    .build();
            cliente.addTelefone(telefone);
        }

        cliente.getEmails().clear();
        for (EmailRequest emailReq : request.getEmails()) {
            Email email = new Email();
            email.setEndereco(emailReq.getEndereco());
            cliente.addEmail(email);
        }

        Cliente atualizado = clienteRepository.save(cliente);
        log.info("Cliente ID {} atualizado com sucesso", id);
        return clienteMapper.toResponse(atualizado);
    }

    public void deletar(Long id) {
        log.info("Deletando cliente ID: {}", id);
        if (!clienteRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Cliente não encontrado com ID: " + id);
        }
        clienteRepository.deleteById(id);
        log.info("Cliente ID {} deletado com sucesso", id);
    }
}