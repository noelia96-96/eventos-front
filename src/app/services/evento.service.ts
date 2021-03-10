import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { RespuestaPost } from '../interfaces/RespuestaPost';
import {Plugins} from '@capacitor/core';
import { RootEvento } from '../interfaces/evento';
import { Evento } from 'src/app/interfaces/evento';

const {Storage} = Plugins;
@Injectable({
  providedIn: 'root'
})

export class EventoService {
      constructor(private _http:HttpClient) { }
      //todos los eventos
      public eventosT : Evento[] = [];
      public eventosPtemp : Evento[] = [];
      public eventosP : Evento[] = [];
      public idEventoModificar : String;
      public eventoModificar : Evento;
      public eventoBorrar : Evento;
      public eventoIdBorrar : String;

      registrarEvento(dato:any){
      return new Promise<any>((resolve, reject)=>{
        console.log(`${environment.urlEvento}registrar`);
        this._http.post(`${environment.urlEvento}registrar`,dato).subscribe((resp:any)=>{
          if(resp.status=='ok'){
            console.log(resp);
            this.eventosT.unshift(resp.evento);
            this.eventosPtemp.unshift(resp.evento);
          }
            resolve(resp);
        });
      });
    }

    //Traer los eventos de la bbdd
    async getEventos(){
      this.eventosT = [];
      this.eventosPtemp = [];
      const token:any = await this.getToken();
      console.log('token',token);
      
    if(token.value){
      let cabecera = new HttpHeaders({
        'Authorization': 'Bearer ' + token.value
      }); 
   
      return new Promise<RootEvento>(resolve=>{
        this._http.get<RootEvento>(`${environment.urlEvento}mostrarEvento`,{
          headers:cabecera
          }).subscribe(resp=>{
          this.eventosT=resp.evento[0];
      resolve(resp);
      console.log(resp);
     });
   });
  }
 }

 borrar(){
  for(let data of this.eventosT){
    if(data._id == this.eventoIdBorrar){
      this.eventoBorrar = data;
    }
  }
  console.log(this.eventoBorrar._id);
  return new Promise<any>(resolve=>{
    const datos = {
      _id: this.eventoBorrar._id,
    }
    this._http.post(`${environment.urlEvento}borrarEvento`,datos).subscribe((resp:RespuestaPost)=>{
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

 apuntarse(datos:any){
   console.log('Datos:');
   console.log(datos);
  return new Promise<any>(resolve=>{
    this._http.post(`${environment.urlEvento}apuntarse`,datos).subscribe((resp:any)=>{
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

 desapuntarse(datos:any){
  console.log('Datos:');
  console.log(datos);
 return new Promise<any>(resolve=>{
   this._http.post(`${environment.urlEvento}desapuntarse`,datos).subscribe((resp:any)=>{
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
buscarEvento(){

  for(let data of this.eventosT){
    if(data._id == this.idEventoModificar){
      this.eventoModificar = data;
    }
  }
 return this.eventoModificar;

}

guardarDatosEditados(){
  return new Promise<any>(resolve=>{
    this._http.post(`${environment.urlEvento}guardar`,this.eventoModificar).subscribe((resp:any)=>{
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

}


  