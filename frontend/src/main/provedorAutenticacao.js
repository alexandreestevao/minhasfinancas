import React from 'react'

import AuthService from '../app/services/authService'

export const AuthContext = React.createContext()
export const AuthConsumer = AuthContext.Consumer;
const AuthProvider = AuthContext.Provider;

class ProvedorAutenticacao extends React.Component {
    
    state = {
        usuarioAutenticado: null,
        isAutenticado: false
    }

    iniciarSessao = (usuario) => {
        AuthService.logar(usuario);
        this.setState({ isAutenticado: true, usuarioAutenticado: usuario })
    }

    encerrarSessao = () => {
        AuthService.removerUsuarioAutenticado();
        this.setState({ isAutenticado: false, usuarioAutenticado: null })
    }

    render(){

        const contexto = {
            usuarioAutenticado: this.state.usuarioAutenticado,
            isAutenticado: this.state.isAutenticado,
            iniciarSessao: this.state.iniciarSessao,
            encerrarSessao: this.state.encerrarSessao
        }

        return(
            <AuthProvider value={contexto}>
                {this.props.AuthContext}
            </AuthProvider>
        )
    }
}

export default ProvedorAutenticacao