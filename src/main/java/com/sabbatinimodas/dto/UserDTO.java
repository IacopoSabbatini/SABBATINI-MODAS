package com.sabbatinimodas.dto;

/**
 * DTO para dados do usuário (sem informações sensíveis)
 * 
 * @author Sabbatini Modas Team
 * @version 1.0.0
 */
public class UserDTO {
    
    private Long id;
    private String email;
    private String nome;
    private Boolean ativo;
    
    // Construtores
    public UserDTO() {}
    
    public UserDTO(Long id, String email, String nome, Boolean ativo) {
        this.id = id;
        this.email = email;
        this.nome = nome;
        this.ativo = ativo;
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getNome() {
        return nome;
    }
    
    public void setNome(String nome) {
        this.nome = nome;
    }
    
    public Boolean getAtivo() {
        return ativo;
    }
    
    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
    
    @Override
    public String toString() {
        return "UserDTO{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", nome='" + nome + '\'' +
                ", ativo=" + ativo +
                '}';
    }
}

