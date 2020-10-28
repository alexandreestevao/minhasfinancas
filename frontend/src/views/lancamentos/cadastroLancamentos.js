import React from 'react';

import Card from '../../components/card';
import FormGroup from '../../components/form-group';
import SelectMenu from '../../components/select-menu';

import {withRouter } from 'react-router-dom';
import * as messages from '../../components/toastr';

import LancamentoService from '../../app/services/lancamentoService';
import LocalStorageService from '../../app/services/localstorageService';

class CadastroLancamentos extends React.Component {

    state = {
        id: null,
        descricao: '',
        ano: '',
        mes: '',
        valor: '',
        tipo: '',
        status: '',
        usuario: null,
        atualizando: false
    }

    constructor() {
        super();
        this.service = new LancamentoService();
    }

    componentDidMount() {
        const params = this.props.match.params

        if(params.id) {
            this.service
                .obterPorId(params.id)
                .then(response => {
                    this.setState({...response.data, atualizando: true}) //Spread operator ...
                }).catch(error => {
                    messages.mensagemErro(error.response.data)
                })
        }

    }

    submit = () => {
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');
        //operador destructor
        const { descricao, valor, mes, ano, tipo } = this.state;
        const lancamento = { descricao, valor, mes, ano, tipo, usuario: usuarioLogado.id };

        try{
            this.service.validar(lancamento)
        }catch(erro) {
            const mensagens = erro.mensagens;
            mensagens.forEach(msg => messages.mensagemErro(msg));

        }

        this.service
        .salvar(lancamento)
        .then(response => {
            this.props.history.push('/consulta-lancamentos')
            messages.mensagemSucesso('Lançamento cadastrado com sucesso.')
        }).catch (error => {
            messages.mensagemErro(error.response.data);
        })
    }

    atualizar = () => {
        //operador destructor
        const { descricao, valor, mes, ano, tipo, status, usuario, id } = this.state;
        const lancamento = { descricao, valor, mes, ano, tipo, status, usuario, id };

        this.service
        .atualizar(lancamento)
        .then(response => {
            this.props.history.push('/consulta-lancamentos')
            messages.mensagemSucesso('Lançamento atualizado com sucesso.')
        }).catch (error => {
            messages.mensagemErro(error.response.data);
        })
    } 

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({ [name] : value})
    }

    render() {
        const meses = this.service.obterListaMeses();
        const tipos = this.service.obterListaTipos();

        return(
            <Card title={this.state.atualizando ? 'Atualização de Lançamento' : 'Cadastro de Lançamento'}>
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup id="inputDescricao" label="Descrição: *">
                            <input  type="text" id="inputDescricao" 
                                    className="form-control"
                                    name="descricao"
                                    value={this.state.descricao}
                                    onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <FormGroup id="inputAno" label="Ano: *">
                            <input type="text" id="inputAno" 
                                    className="form-control" 
                                    name="ano"
                                    value={this.state.ano}
                                    onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className="col-md-6">
                        <FormGroup id="inputMes" label="Mês: *">
                            <SelectMenu id="inputMes" lista={meses} 
                                        className="form-control"
                                        name="mes"
                                        value={this.state.mes}
                                        onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <FormGroup id="inputValor" label="Valor: *">
                            <input type="text" id="inputValor" 
                                   className="form-control"
                                   name="valor"
                                   value={this.state.valor}
                                   onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputTipo" label="Tipo de Lançamento: *">
                            <SelectMenu id="inputTipo" 
                                        lista={tipos} 
                                        name="tipo"
                                        value={this.state.tipo}
                                        onChange={this.handleChange}
                                        className="form-control" />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputStatus" label="Status:">
                            <input type="text" 
                                   id="inputStatus" 
                                   className="form-control" 
                                   name="status"
                                   value={this.state.status}
                                   disabled />
                        </FormGroup>
                    </div> 
                    <div className="rows">
                        <div className="col-md-12">
                            {this.state.atualizando ?
                                (
                                    <button onClick={this.atualizar} 
                                            type="button" 
                                            className="btn btn-success">
                                            <i className="pi pi-refresh"> Atualizar</i>                                                
                                    </button>
                                ) : (
                                    <button onClick={this.submit} 
                                            type="button" 
                                            className="btn btn-success">
                                            <i className="pi pi-save"> Salvar</i>
                                    </button>
                                )
                            }                            
                            <button onClick={e => this.props.history.push('/consulta-lancamentos')} 
                                    type="button" 
                                    className="btn btn-danger">
                                    <i className="pi pi-times"> Cancelar</i>
                            </button>
                        </div>
                    </div>
                </div>                
            </Card>
        )
    }
}

export default withRouter(CadastroLancamentos);