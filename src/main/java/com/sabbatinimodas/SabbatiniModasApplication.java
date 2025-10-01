package com.sabbatinimodas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

/**
 * Classe principal da aplicação Sabbatini Modas
 * Sistema Web para Loja de Roupas
 * 
 * @author Sabbatini Modas Team
 * @version 1.0.0
 */
@SpringBootApplication
@CrossOrigin(origins = "*")
public class SabbatiniModasApplication {

    public static void main(String[] args) {
        SpringApplication.run(SabbatiniModasApplication.class, args);
        System.out.println("=================================");
        System.out.println("Sabbatini Modas Backend iniciado!");
        System.out.println("Servidor rodando na porta: 8080");
        System.out.println("Contexto: /api");
        System.out.println("=================================");
    }
}

