package com.seunome.service;

import com.seunome.dto.request.LoginRequest;
import com.seunome.dto.response.LoginResponse;
import com.seunome.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public LoginResponse autenticar(LoginRequest request) {
        log.info("Tentativa de login para o usuário: {}", request.getLogin());

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getLogin(),
                            request.getSenha()
                    )
            );

            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String token = jwtUtil.gerarToken(userDetails);

            log.info("Login realizado com sucesso para: {}", request.getLogin());

            return new LoginResponse(token, "Bearer", jwtUtil.getExpiration());

        } catch (BadCredentialsException e) {
            log.warn("Credenciais inválidas para: {}", request.getLogin());
            throw new BadCredentialsException("Login ou senha inválidos");
        }
    }
}
