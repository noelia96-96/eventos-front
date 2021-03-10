import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { ActivatedRoute} from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-registrar-evento',
  templateUrl: './registrar-evento.page.html',
  styleUrls: ['./registrar-evento.page.scss'],
})
export class RegistrarEventoPage implements OnInit {

  constructor(
    private _router: Router,
    private _eventoService:EventoService,
    private activatedRoute : ActivatedRoute, 
    private _usuarioService:UsuarioService,
    ) { }
  public usuario:String;
  //Datos registro evento
  public nombreEvento: string;
  public creador: string;
  public fecha: Date;
  public participantes: string[] = [];

  ngOnInit() {
    this.usuario = this._usuarioService.usuarioActual.nombre;
  }

  async guardar(){
    console.log('1');
    const data = {
      nombreEvento: this.nombreEvento,
      creador: this.usuario,
      fecha: this.fecha,
      participantes: this.participantes
    }
    console.log(data);
    const resultado = await this._eventoService.registrarEvento(data);
    console.log(resultado);
    this._router.navigate(['/perfil']);
  }

  cancelar(){
    //Poner 'refresh' para que al guardar, el nuevo evento aparezca en el perfil
    this._router.navigate(['/perfil']);//da error con el 'refresh'
  
  }


 



}
