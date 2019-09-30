import React, { Component } from 'react';

import UpdateForm from './UpdateForm.jsx';

const axios = require('axios');
const APIHOST = process.env.NODE_ENV == "production" ? process.env.APIHOST : "184.172.214.210"
const APIPORT = process.env.NODE_ENV == "production" ? process.env.APIPORT : "32637"

// Profile class renders the Profile card.
// Receives information from the API through props.
// Information is in json format.
class Profile extends React.Component {
    constructor(props){
        super(props)
        try{
            this.state = {
                firstname: props.firstname,
                lastname: props.lastname,
                matricula: props.matricula,
                photourl: props.photourl,
                handle_cf: props.handles.codeforces,
                handle_uri: props.handles.uri,
                email: props.email,
            }
        } catch(error){
            console.log("Error parsing Student information:", error);
            this.state = {
                parseerror: true
            }
        }
    }
    
    dismissModal(modal) {
        modal.classList.remove('show');
        modal.classList.remove('in');
        modal.classList.add('fade');
    }

    updateEmail(email_id, pwd_id, root) {
        this.dismissModal(document.getElementById(root));

        let new_email = document.getElementById(email_id).value;
        let pwd = document.getElementById(pwd_id).value;
        var profile = this;
        const url = 'http://' + APIHOST + ':' + APIPORT + '/students';
        axios.put( url, {
            'id': this.props.ID,
            'email': new_email,
            'password': pwd
        }).then( function (response) {
            profile.setState({email: response.data.email});
            // TODO: Transformar isso em React.
            // Não descobri como faz para adicionar o elemento no body sem remover todo o resto
            let info_box = document.createElement('div');
            info_box.innerText = "Email atualizado com sucesso!";
            info_box.classList.add("info-box-success","info-box");
            info_box.id = 'email-update-success';
            document.getElementsByTagName('body')[0].appendChild(info_box);
            setTimeout( () => { 
                let box = document.getElementById('email-update-success');
                box.parentNode.removeChild(box);
            }, 2000);
        }).catch ( function (error) {
            console.log(error);
            // TODO: Transformar isso em React.
            // Não descobri como faz para adicionar o elemento no body sem remover todo o resto
            let info_box = document.createElement('div');
            info_box.innerText = "Ocorreu um erro. Tente novamente.";
            info_box.classList.add("info-box-fail","info-box");
            info_box.id = 'email-update-fail';
            document.getElementsByTagName('body')[0].appendChild(info_box);
            setTimeout( () => { 
                let box = document.getElementById('email-update-fail');
                box.parentNode.removeChild(box);
            }, 2000);
        });

    }

    updatePassword(newpwd_id, pwd_id, root) {
        this.dismissModal(document.getElementById(root));
        
        let new_pwd = document.getElementById(newpwd_id).value;
        let pwd = document.getElementById(pwd_id).value;
        const url = 'http://' + APIHOST + ':' + APIPORT + '/students';
        axios.put(url, {
            'id': this.props.ID,
            'newpassword': new_pwd,
            'password': pwd
        }).then( function (response) {
            // TODO: Transformar isso em React.
            // Não descobri como faz para adicionar o elemento no body sem remover todo o resto
            let info_box = document.createElement('div');
            info_box.innerText = "Senha atualizada com sucesso!";
            info_box.classList.add("info-box-success","info-box");
            info_box.id = 'email-update-success';
            document.getElementsByTagName('body')[0].appendChild(info_box);
            setTimeout( () => { 
                let box = document.getElementById('email-update-success');
                box.parentNode.removeChild(box);
            }, 2000);
        }).catch ( function (error) {
            console.log(error);
            // TODO: Transformar isso em React.
            // Não descobri como faz para adicionar o elemento no body sem remover todo o resto
            let info_box = document.createElement('div');
            info_box.innerText = "Ocorreu um erro. Tente novamente.";
            info_box.classList.add("info-box-fail","info-box");
            info_box.id = 'email-update-fail';
            document.getElementsByTagName('body')[0].appendChild(info_box);
            setTimeout( () => { 
                let box = document.getElementById('email-update-fail');
                box.parentNode.removeChild(box);
            }, 2000);
        });

    }

    updateHandle(handle_el) {
        let handle = document.getElementById(handle_el).value;
        var profile = this;
        let data;
        if(handle_el == "handle-cf"){
            data = {
                "id": this.props.ID,
                "password": this.props._pwd,
                "handles" : {
                    "codeforces": handle
                }
            }           
            this.setState({handle_cf : handle}); 
        } else {
            data = {
                "id": this.props.ID,
                "password": this.props._pwd,
                "handles" : {
                    "uri": handle
                }
            }     
            this.setState({handle_uri: handle});
        }
        const url = 'http://' + APIHOST + ':' + APIPORT + '/students';
        axios.put(url, data ).then( (response) => {
                console.log("Request ok");
            }).catch( (error) => {
                console.log("Erro:", error);
                if(handle_el == "handle-cf"){
                    profile.setState({handle_cf : ''});
                } else {
                    profile.setState({handle_uri: ''});
                }
            });
    }

    render() {
        if(this.state.parseerror !== true){
            // Cria o card de perfil corretamente
            const emailForm = {
                element_id: "email-form-update",
                student_id: this.props.ID,
                title: "Atualize seu E-mail",
                fields: [
                    {
                        "id": "email-field",
                        "label": "Email",
                        "title": "Email usado para notícias e avisos",
                        "type": "email",
                        "placeholder": "aluno@email.com"
                    },
                    {
                        "id": "password-field",
                        "label": "Password",
                        "title": "Sua senha",
                        "type": "password",
                        "placeholder": "senha"
                    }
                ]
            }
            const pwdForm = {
                element_id: "password-form-update",
                student_id: this.props.ID,
                title: "Altere sua Senha",
                fields: [
                    {
                        "id": "pass-field",
                        "label": "Senha Atual",
                        "title": "Sua senha",
                        "type": "password",
                        "placeholder": "senha atual"
                    },
                    {
                        "id": "new-password-field",
                        "label": "Nova Senha",
                        "title": "Nova senha",
                        "type": "password",
                        "placeholder": "nova senha"
                    },
                ]
            }
            return (
                <div>
                <UpdateForm {...emailForm}
                 onClick={() => this.updateEmail(emailForm.fields[0].id, emailForm.fields[1].id, emailForm.element_id)}
                />
                <UpdateForm {...pwdForm}
                onClick={() => this.updatePassword(pwdForm.fields[1].id, pwdForm.fields[0].id, pwdForm.element_id)}
                />
                <div className="panel panel-default panel-blue">
                    <h4 className="panel-header">Perfil</h4>
                <div className="container">
                    <div className="media-left">
                        {   this.state.photourl != '' ?
                            <img src={this.state.photourl} alt="Avatar" className="media-object"/> :
                            <span className="glyphicon glyphicon-user media-object"></span>

                        } 
                    </div>
                    <div className="media-body">
                        <p className="media-heading name-text">
                        {this.state.firstname} {this.state.lastname}
                        </p>
                        
                        { this.state.handle_cf !== '' ?
                            <p className="handle-text">
                                <img className="tiny-icon" src="../assets/images/codeforces_icon.png" alt="@"></img>
                                {this.state.handle_cf}
                            </p> :
                            <div className="input-group col-sm-3">
                                <span className="input-group-addon">
                                    <img className="tiny-icon" src="../assets/images/codeforces_icon.png" alt="@"></img>
                                </span>
                                <input id="handle-cf" type="text" className="form-control" name="password" placeholder="Handle"/>
                                <span className="input-group-addon btn-edit" onClick={() => this.updateHandle('handle-cf')}>
                                    <i className="glyphicon glyphicon-send"></i>
                                </span>
                            </div>
                        }
                        
                        {
                            this.state.handle_uri !== '' ?
                            <p className="handle-text">
                                <img className="tiny-icon" src="../assets/images/uri_icon.png" alt="@"></img>
                                {this.state.handle_uri}
                            </p> :
                            <div className="input-group col-sm-3">
                            <span className="input-group-addon">
                                <img className="tiny-icon" src="../assets/images/uri_icon.png" alt="@"></img>
                            </span>
                            <input id="handle-uri" type="text" className="form-control" name="password" placeholder="Handle"/>
                            <span className="input-group-addon btn-edit" onClick={() => this.updateHandle('handle-uri')}>
                                <i className="glyphicon glyphicon-send"></i>
                            </span>
                        </div>
                        }
                    </div>
                    <div>
                        <p>
                        <button type="button" className="btn-edit btn" data-toggle="modal" data-target={'#' + emailForm.element_id}>
                            <span className="glyphicon glyphicon-edit"></span>
                        </button>&nbsp;Email: <span className="handle-text">{this.state.email}</span>
                        </p>
                        <p>
                        <button type="button" className="btn btn-info" data-toggle="modal" data-target={'#' + pwdForm.element_id}>
                            <span className="glyphicon glyphicon-edit"></span>
                            &nbsp;Alterar Senha
                        </button>
                        </p>
                    </div>
                </div>
                </div>
                </div>);
        } else {
            // Cria um card que indica que algo de errado aconteceu
            <div className="panel panel-default panel-blue">
                    <h4 className="panel-header">Perfil</h4>
                <div className="container">
                    <div className="alert alert-danger">
                        <p>Ooops! Algo deu errado.</p>
                    </div>
                </div>
            </div>
        }
    }
}

export default Profile;