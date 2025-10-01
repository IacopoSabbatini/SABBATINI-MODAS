package com.sabbatinimodas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidade Caixa para controle financeiro
 * 
 * @author Sabbatini Modas Team
 * @version 1.0.0
 */
@Entity
@Table(name = "caixa")
public class Caixa {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "descricao", nullable = false, length = 255)
    @NotBlank(message = "Descrição é obrigatória")
    private String descricao;
    
    @Column(name = "entrada_ou_saida", nullable = false, length = 10)
    @NotBlank(message = "Tipo de operação é obrigatório")
    private String entradaOuSaida; // "entrada" ou "saida"
    
    @Column(name = "valor", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    private BigDecimal valor;
    
    @Column(name = "saldo", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Saldo é obrigatório")
    private BigDecimal saldo;
    
    @Column(name = "data", nullable = false)
    @NotNull(message = "Data é obrigatória")
    private LocalDateTime data;
    
    @Column(name = "observacoes", length = 500)
    private String observacoes;
    
    // Construtores
    public Caixa() {
        this.data = LocalDateTime.now();
    }
    
    public Caixa(String descricao, String entradaOuSaida, BigDecimal valor, BigDecimal saldo) {
        this.descricao = descricao;
        this.entradaOuSaida = entradaOuSaida;
        this.valor = valor;
        this.saldo = saldo;
        this.data = LocalDateTime.now();
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getDescricao() {
        return descricao;
    }
    
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    
    public String getEntradaOuSaida() {
        return entradaOuSaida;
    }
    
    public void setEntradaOuSaida(String entradaOuSaida) {
        this.entradaOuSaida = entradaOuSaida;
    }
    
    public BigDecimal getValor() {
        return valor;
    }
    
    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }
    
    public BigDecimal getSaldo() {
        return saldo;
    }
    
    public void setSaldo(BigDecimal saldo) {
        this.saldo = saldo;
    }
    
    public LocalDateTime getData() {
        return data;
    }
    
    public void setData(LocalDateTime data) {
        this.data = data;
    }
    
    public String getObservacoes() {
        return observacoes;
    }
    
    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
    
    @Override
    public String toString() {
        return "Caixa{" +
                "id=" + id +
                ", descricao='" + descricao + '\'' +
                ", entradaOuSaida='" + entradaOuSaida + '\'' +
                ", valor=" + valor +
                ", saldo=" + saldo +
                ", data=" + data +
                '}';
    }
}

