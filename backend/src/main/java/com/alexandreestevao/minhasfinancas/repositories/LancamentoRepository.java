package com.alexandreestevao.minhasfinancas.repositories;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.alexandreestevao.minhasfinancas.entities.Lancamento;
import com.alexandreestevao.minhasfinancas.entities.enums.StatusLancamento;
import com.alexandreestevao.minhasfinancas.entities.enums.TipoLancamento;

public interface LancamentoRepository extends JpaRepository<Lancamento, Long> {
	
	@Query("SELECT sum(l.valor) from Lancamento l join l.usuario u "
			+ " WHERE u.id = :idUsuario AND l.tipo = :tipo AND l.status = :status GROUP BY u")
	BigDecimal obterSaldoPorTipoLancamentoEUsuarioEStatus(
			@Param("idUsuario") Long idUsuario, 
			@Param("tipo") TipoLancamento tipo, 
			@Param("status") StatusLancamento status);

}
