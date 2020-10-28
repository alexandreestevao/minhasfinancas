package com.alexandreestevao.minhasfinancas.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.alexandreestevao.minhasfinancas.entities.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
	
	boolean existsByEmail(String email);  //Query Methods
	
	Optional<Usuario> findByEmail(String email);

}
