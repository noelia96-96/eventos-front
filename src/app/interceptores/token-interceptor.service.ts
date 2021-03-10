import { UsuarioService} from './../services/usuario.service';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private _usuarioService:UsuarioService) { }
  
  intercept(req:HttpRequest<any>, next:HttpHandler): Observable<HttpEvent<any>>{
    //Si modifico la req, debe clonarla, no se puede append nada a esa req
    //cuando llega peticion http muestra el login.
    //mete la cabecera si hay token
    
    //this._mensajeService.muestraLoading();
    if(this._usuarioService.getToken()){
      const tokenizeRequest = req.clone({
        setHeaders:{
          Authorization:'Bearer '+ this._usuarioService.getToken(),
        }
      });
      //concatena una nueva funcion 
      return next.handle(tokenizeRequest);
    }
    return next.handle(req);
      
      
      //FORMA MÁS LARGA
      
      /*return next.handle(tokenizeRequest).pipe(
        //cuando termina la peticion se oculta el login
        finalize(() => {
          //this._mensajeService.ocultaLoading();

        })
      );
    }
    //si no hay loading devuelve la peticion pasando el pipe de que cuando finalice se oculte el login
    return next.handle(req).pipe(
      finalize(() => {
          //this._mensajeService.ocultaLoading();
      })
    );*/
  }
}
