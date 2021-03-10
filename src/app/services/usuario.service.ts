import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { RespuestaPost } from '../interfaces/RespuestaPost';
import {Plugins} from '@capacitor/core';
const {Storage} = Plugins;
@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
public usuarioActual:any;

  guardar: any;
  constructor(private _http:HttpClient) { }

  //Metodo para llamar al servidor

  probandoGet(dato:any){
    return new Promise<any>(resolve =>{
      this._http.get(`${environment.urlUsuario}postDePrueba`,dato).subscribe(resp=>{
          resolve(resp);
      });
    });
  }

/*probandoPost(dato:any){
    return new Promise<any>((resolve, reject)=>{
      this._http.post(`${environment.urlUsuario}postDePrueba`,dato).subscribe((resp:RespuestaPost)=>{
          resolve(resp);
      });
    });
  }*/

  registro(dato:any){
    return new Promise<any>((resolve, reject)=>{
      console.log(`${environment.urlUsuario}registro`);
      this._http.post(`${environment.urlUsuario}registro`,dato).subscribe((resp:RespuestaPost)=>{
          resolve(resp);
      });
    });
  }
  login(dato:any){
    return new Promise<any>(resolve=>{
      this._http.post(`${environment.urlUsuario}login`,dato).subscribe((resp:RespuestaPost)=>{
        if(resp.status=='ok' && resp.token){
          Storage.set({
            key:'token',
            value:resp.token
          });
        }
          resolve(resp);
      });
    });
  }
  getToken(){
    return new Promise(resolve=>{
      Storage.get({key:'token'}).then(data=>{
     resolve(data);
    });
    
    });
  }
  async compruebaSiLogado(){
    return new Promise(async resolve=>{
    
      const token:any = await this.getToken();
      console.log('token',token);
    if(token.value){
      let cabecera = new HttpHeaders({
        'Authorization': 'Bearer2 ' + token.value
      }); 
      // cabecera.set('Authorization', 'Bearer ' + token.value);
      console.log('hay token', cabecera); 
      //llamada de metodo que hay en el servidor
      
      // AQUI QUITAR TOKEN Y CABECERA
      
      this._http.get(`${environment.urlUsuario}getUsuario`,{
      headers:cabecera
      }).subscribe((resp:RespuestaPost) =>{
        console.log('Log');
        console.log(resp);
        if(resp.status=='ok'){
          Storage.set({
            key:'token',
            value:resp.token
          });
          this.usuarioActual = resp.usuario;
          resolve(true);
        }
        else{
          console.log(resp.mensaje)
          resolve(false);
        }
        
      });
    }
    else{
      console.log('token invalido')
      resolve(false);
    }
    })
    
  }
  cerrarSesion() {
    Storage.clear();
  }
}



