import ApiService from '../api-service';

import ErroValidacao from '../exceptions/ErroValidacao';

class UsuarioService extends ApiService {

    constructor() {
        super('/api/usuarios')
    }

    autenticar(credenciais) {
        return this.post('/autenticar', credenciais)
    }

    obterSaldoPorUsuario(id) {
        return this.get(`/${id}/saldo`);
    }

    salvar(usuario) {
        return this.post('/', usuario);
    }

    validar(usuario) {
        const erros = []

        if(!usuario.nome) {
            erros.push('O campo Nome é obrigatório.')
        }
        
        if(!usuario.email) {
            erros.push('O campo E-mail é obrigatório.')
        }else if(!usuario.email.match(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]/)) {
            erros.push('Imforme um E-mail válido.')
        }

        if(!usuario.senha || !usuario.senhaRepeticao) {
            erros.push('Digite a senha 2 vezes.')   
        }else if(usuario.senha !== usuario.senhaRepeticao) {
            erros.push('As senhas não são iguais.')
        }

        if(erros && erros.length > 0) {
            throw new ErroValidacao(erros);
        }
    }

}

export default UsuarioService;