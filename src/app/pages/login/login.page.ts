import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { RespuestaPost } from '../../interfaces/RespuestaPost';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertController} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private _usuarioService:UsuarioService, 
    private _router:Router,
    private alertController: AlertController
    ) { }

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

    async login(){
      const datos = {
        nombre: this.usuario,
        pwd: this.pwd
      }
      
      const respuesta:RespuestaPost = await this._usuarioService.login(datos);
      if(respuesta.status=='ok'){
        this._usuarioService.usuarioActual = datos;
        this._router.navigate(['/perfil']);
      }
      else{
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          backdropDismiss: false,
          subHeader: 'No existe el usuario. Regístrate',
          buttons: ['OK']
        });
        await alert.present();
      }
        
      }

}
