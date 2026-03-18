package com.seunome.security;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final PasswordEncoder passwordEncoder;

    private final Map<String, String[]> usuarios = new HashMap<>();

    public UserDetailsServiceImpl(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
        inicializarUsuarios();
    }

    private void inicializarUsuarios() {
        usuarios.put("admin", new String[]{
                passwordEncoder.encode("123qwe!@#"), "ADMIN"
        });
        usuarios.put("user", new String[]{
                passwordEncoder.encode("123qwe123"), "USER"
        });
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String[] dados = usuarios.get(username);
        if (dados == null) {
            throw new UsernameNotFoundException("Usuário não encontrado: " + username);
        }

        return User.builder()
                .username(username)
                .password(dados[0])
                .roles(dados[1])
                .build();
    }
}