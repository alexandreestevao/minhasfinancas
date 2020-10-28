package com.alexandreestevao.minhasfinancas.services;

import java.util.Optional;

import com.alexandreestevao.minhasfinancas.entities.Usuario;

public interface UsuarioService {
	
	Usuario autenticar(String email, String senha);
	
	Usuario salvarUsuario(Usuario usuario);
	
	void validarEmail(String email);
	
	Optional<Usuario> obterPorId(Long id);

}
