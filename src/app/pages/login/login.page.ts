import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { RespuestaPost } from '../../interfaces/RespuestaPost';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private _usuarioService:UsuarioService, private _router:Router) { }

  public usuario:string;
  public pwd:string;

  async ngOnInit() {
    const logado = await this._usuarioService.compruebaSiLogado();
    if(logado){
      this._router.navigate(['/perfil']);

    }
    else{
      console.log('No estamos logados');
    }
  }

 /* async probarGet(){
    const respuesta = await this._usuarioService.probandoGet('pepe');
    console.log(respuesta);
  }

  async probarPost(){
    const datos = {
      usuario: 'noelia',
      pwd: 'gal'
    }
    const respuesta:RespuestaPost = await this._usuarioService.probandoPost(datos);
    if(respuesta.status=='ok'){
      console.log('todo ha ido bien');
      console.log(respuesta);
    }
    else{
      console.log(respuesta.mensaje);
    }
      
    }
*/
    async login(){
      const datos = {
        nombre: this.usuario,
        pwd: this.pwd
      }
      
      const respuesta:RespuestaPost = await this._usuarioService.login(datos);
      if(respuesta.status=='ok'){
        this._usuarioService.usuarioActual = datos;
        console.log('todo ha ido bien');
        console.log(respuesta);
        this._router.navigate(['/perfil']);
      }
      else{
        console.log(respuesta.mensaje);
      }
        
      }

}
