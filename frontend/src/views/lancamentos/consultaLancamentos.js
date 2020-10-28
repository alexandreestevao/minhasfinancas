import React from 'react';
import { withRouter } from 'react-router-dom';

import Card from '../../components/card';
import FormGroup from '../../components/form-group';
import SelectMenu from '../../components/select-menu';
import TableLancamentos from './tableLancamentos';
import LancamentoService from '../../app/services/lancamentoService';
import LocalStorageService from '../../app/services/localstorageService';

import * as messages from '../../components/toastr';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

class ConsultaLancamentos extends React.Component {

    state = {
        descricao: '',
        ano: '',
        mes: '',
        tipo: '',
        showConfirmDialog: false,
        lancamentoDeletar: {},
        lancamentos: []
    }

    constructor() {
        super();
        this.service = new LancamentoService();
    }

    buscar = () => {
        if(!this.state.ano) {
            messages.mensagemErro('O campo Ano é obrigatório.');
            return false;
        }

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');
        
        const lancamentoFiltro = {
            descricao: this.state.descricao,
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            usuario: usuarioLogado.id
        }

        this.service
                .consultar(lancamentoFiltro)
                .then( resposta => {
                    const lista = resposta.data;
                    if(lista.length < 1) {
                        
                        messages.mensagemAlerta('Nenhum resultado foi encontrado.');
                    }
                    this.setState({lancamentos: lista})
                }).catch(error => {
                    console.log(error)
                })
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-lancamentos/${id}`)
    }

    confirmar = (lancamento) => {
        this.setState({showConfirmDialog: true, lancamentoDeletar: lancamento})
    }

    cancelarDelecao = () => {
        this.setState({showConfirmDialog: false, lancamentoDeletar: {}})
    }

    deletar = () => {
        this.service
            .deletar(this.state.lancamentoDeletar.id)
            .then (response => {
                const lancamentos = this.state.lancamentos;
                const index = this.state.lancamentos.indexOf(this.state.lancamentoDeletar)
                lancamentos.splice(index, 1);
                this.setState({lancamentos: lancamentos, showConfirmDialog: false})
                messages.mensagemSucesso('Lançamento deletado com sucesso.')
            }).catch(error => {
                messages.mensagemErro('Ocorreu um erro ao tentar deletar o Lançamento.')
            })
    }

    preparaFormularioCadastro = () => {
        this.props.history.push('/cadastro-lancamentos')
    }

    alterarStatus = (lancamento, status) => {
        this.service
            .alterarStatus(lancamento.id, status)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(lancamento);
                if(index !== -1) { //se o index não encontrar elemento retorna -1
                    lancamento['status'] = status;
                    lancamentos[index] = lancamento
                    this.setState({lancamento});
                }
                messages.mensagemSucesso('Status atualizado com sucesso!')
            })
    }

    render() {
        const meses = this.service.obterListaMeses();
        const tipos = this.service.obterListaTipos();   
        
        const confirmDialogFooter = (
            <div>
                <Button label="Sim" icon="pi pi-check" onClick={this.deletar} />
                <Button label="Não" icon="pi pi-times" onClick={this.cancelarDelecao} />
            </div>
        );

        return(
            <Card title="Consulta de Lançamentos">
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <FormGroup htmlFor="inputAno" label="Ano: *">
                                <input type="number"
                                        className="form-control"
                                        id="inputAno"
                                        value={this.state.ano}
                                        onChange={e => this.setState({ano: e.target.value})}
                                        placeholder="Digite o Ano" />
                            </FormGroup>
                            <FormGroup htmlFor="inputMes" label="Mês:">
                                <SelectMenu id="inputMes" 
                                            value={this.state.mes}
                                            onChange={e => this.setState({mes: e.target.value})}
                                            className="form-control" 
                                            lista={meses} />
                            </FormGroup>
                            <FormGroup htmlFor="inputDescricao" label="Descrição:">
                                <input type="text"
                                        className="form-control"
                                        id="inputDescricao"
                                        value={this.state.descricao}
                                        onChange={e => this.setState({descricao: e.target.value})}
                                        placeholder="Digite a Descriação" />
                            </FormGroup>                                                        
                            <FormGroup htmlFor="inputTipo" label="Tipo Lançamento:">
                                <SelectMenu id="inputTipo" 
                                            valud={this.state.tipo}
                                            onChange={e => this.setState({tipo: e.target.value})}
                                            className="form-control" 
                                            lista={tipos} />
                            </FormGroup>   
                            <button onClick={this.buscar} 
                                    type="button" 
                                    className="btn btn-primary">
                                    <i className="pi pi-search"> Buscar</i>
                            </button>
                            <button onClick={this.preparaFormularioCadastro} 
                                    type="button" 
                                    className="btn btn-success">
                                    <i className="pi pi-plus"> Cadastrar</i>
                            </button>
                        </div>
                    </div>
                </div>
                < br />
                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <TableLancamentos lancamentos={this.state.lancamentos} 
                                              deletar={this.confirmar}
                                              editar={this.editar} 
                                              alterarStatus={this.alterarStatus} />    
                        </div>
                    </div>
                </div>
                <div>
                <Dialog header="Confirmação de Exclusão" 
                        visible={this.state.showConfirmDialog} 
                        style={{ width: '50vw' }} 
                        modal={true}
                        footer={confirmDialogFooter} 
                        onHide={() => this.setState({showConfirmDialog: false})}>
                    <p>Confirma a exclusão do Lançamento?</p>
                </Dialog>
                </div>
            </Card>                               
        )
    }

}

export default withRouter(ConsultaLancamentos);