package com.sabbatinimodas.controller;

import com.sabbatinimodas.dto.LoginRequest;
import com.sabbatinimodas.dto.LoginResponse;
import com.sabbatinimodas.dto.UserDTO;
import com.sabbatinimodas.model.User;
import com.sabbatinimodas.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * Controller para autenticação de usuários
 * 
 * @author Sabbatini Modas Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    /**
     * Endpoint de login
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            boolean autenticado = userService.autenticar(loginRequest.getEmail(), loginRequest.getSenha());
            
            if (autenticado) {
                Optional<User> userOpt = userService.buscarPorEmail(loginRequest.getEmail());
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    UserDTO userDTO = new UserDTO(user.getId(), user.getEmail(), user.getNome(), user.getAtivo());
                    
                    // Por enquanto, retornamos um token simples (em produção, usar JWT)
                    String token = "token_" + user.getId() + "_" + System.currentTimeMillis();
                    
                    LoginResponse response = new LoginResponse(true, "Login realizado com sucesso", token, userDTO);
                    return ResponseEntity.ok(response);
                }
            }
            
            LoginResponse response = new LoginResponse(false, "Email ou senha inválidos");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            
        } catch (Exception e) {
            LoginResponse response = new LoginResponse(false, "Erro interno do servidor: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Endpoint de cadastro
     */
    @PostMapping("/cadastro")
    public ResponseEntity<LoginResponse> cadastro(@Valid @RequestBody User user) {
        try {
            // Verifica se o email já existe
            if (userService.emailJaExiste(user.getEmail())) {
                LoginResponse response = new LoginResponse(false, "Email já cadastrado");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }
            
            // Salva o novo usuário
            User novoUser = userService.salvar(user);
            UserDTO userDTO = new UserDTO(novoUser.getId(), novoUser.getEmail(), novoUser.getNome(), novoUser.getAtivo());
            
            // Gera token para login automático após cadastro
            String token = "token_" + novoUser.getId() + "_" + System.currentTimeMillis();
            
            LoginResponse response = new LoginResponse(true, "Usuário cadastrado com sucesso", token, userDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            LoginResponse response = new LoginResponse(false, "Erro ao cadastrar usuário: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Endpoint de logout
     */
    @PostMapping("/logout")
    public ResponseEntity<LoginResponse> logout() {
        // Por enquanto, apenas retorna sucesso (em produção, invalidar JWT)
        LoginResponse response = new LoginResponse(true, "Logout realizado com sucesso");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Endpoint de teste
     */
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("API de autenticação funcionando!");
    }
}

