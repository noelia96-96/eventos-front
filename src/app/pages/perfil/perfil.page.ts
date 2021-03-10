import { Component, OnInit, ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { Evento } from 'src/app/interfaces/evento';
import { UsuarioService } from '../../services/usuario.service';
import { EventoService } from '../../services/evento.service';
import { RootEvento } from '../../interfaces/evento';
import { ActivatedRoute} from '@angular/router';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { AlertController} from '@ionic/angular';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public usuario:String;
  public _id:string;
  public participantes: String[];

  //la respuesta es de tipo rootEvento
  rootEvento : RootEvento;
  
  //todos los eventos
  eventosT : Evento[] = [];

  //eventos propios
  eventosP : Evento[] = [];

  //lista temporal de eventos propios
  eventosPtemp : Evento[] = []; 

  //eventos ajenos
  eventosA : Evento[] = [];

  //lista temporal de eventos ajenos
  eventosAtemp : Evento[] = []; 

  //Para saber en que eventos estamos
  booleanEventos : boolean = true;

  constructor(
    private router: Router,
    private _usuarioService:UsuarioService,
    private _eventoService:EventoService,
    private activatedRoute : ActivatedRoute, 
    private alertController: AlertController
    ) { }


  async ngOnInit() {
    //Recibir el usuario al perfil 
    this.usuario = this._usuarioService.usuarioActual.nombre;
   
    //llamar al servicio
    await this._eventoService.getEventos();

    //Recupero el array 0 que es el que tiene los eventos
    this.eventosT = this._eventoService.eventosT;
    this.eventosPtemp = this._eventoService.eventosPtemp;
    //Recorrer todos los eventos y
    //Si el evento que estoy recorriendo tiene mi nombre de usuario se añade a la lista de eventos propios
    //y si no lo deja en lista de eventos ajenos
    console.log(this.usuario);
   
    for(let data of this.eventosT){
     if(data.creador == this.usuario){
       if(this.eventosPtemp.length <= 3){
        this.eventosPtemp.push(data);
      }
      else{
        this.eventosP.push(data);
      }
     }
   }
  }

  loadData(event){
    setTimeout(()=> {
      //Tenemos una lista de todos los eventos cargados
      //Tenemos una lista que va a ir cargando los eventos poco a poco - esta es la que se usa
      if(this.booleanEventos){
        this.cargarEventoPropio();
        this.cargarEventoPropio();
        this.cargarEventoPropio();
        this.cargarEventoPropio();

        //Si ya no quedan eventos que cargar desabilitamos el infinite scroll
        if(this.eventosP.length==0){
          this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
        }
      }else{
        this.cargarEventoAjeno();
        this.cargarEventoAjeno();
        this.cargarEventoAjeno();
        this.cargarEventoAjeno();

        //Si ya no quedan eventos que cargar desabilitamos el infinite scroll
        if(this.eventosA.length==0){
          this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
        }
      }
      console.log(this.eventosA);

      //completar la accion de cargar los eventos
      event.target.complete(); 

    }, 1000);
  }

  loadEventosPropios(){
    this.booleanEventos = true;
    this.infiniteScroll.disabled = false;
    //Quitar de la lista contraria los eventos 
    this.eventosAtemp = []; 
    //Cargar en la lista propia mis eventos
    for(let data of this.eventosT){
      if(data.creador == this.usuario){
        if(this.eventosPtemp.length <= 3){
         this.eventosPtemp.push(data);
       }else{
        this.eventosP.push(data);
       }
      }
    }
  }

  loadEventosAjenos(){
    this.booleanEventos = false;
    this.infiniteScroll.disabled = false;
    //Quitar de la lista contraria los eventos 
    this.eventosPtemp = []; 
    //Cargar en la lista propia mis eventos
    for(let data of this.eventosT){
      if(data.creador != this.usuario){
        if(this.eventosAtemp.length <= 3){
         this.eventosAtemp.push(data);
       }else{
        this.eventosA.push(data);
       }
      }
    }
  }
  
  private cargarEventoAjeno() {
    if (this.eventosA.length >= 1) {
      //Se añade a la lista de eventos temporales los cuatro primeros eventos
      this.eventosAtemp.push(this.eventosA[0]);

      //Quitar de la lista de los eventosA los tres primeros eventos
      //Cada vez que se cargan se quitan eventos de su lista principal (eventosA) y se cargan en eventosAtemp
      this.eventosA.splice(0, 1);
    }
  }

  private cargarEventoPropio() {
    if (this.eventosP.length >= 1) {
      //Se añade a la lista de eventos temporales los cuatro primeros eventos
      this.eventosPtemp.push(this.eventosP[0]);

      //Quitar de la lista de los eventosA los tres primeros eventos
      //Cada vez que se cargan se quitan eventos de su lista principal (eventosA) y se cargan en eventosAtemp
      this.eventosP.splice(0, 1);
    }
  }

  cerrarSesion(){
    this._usuarioService.cerrarSesion();
    this.router.navigateByUrl('/inicio');
    console.log('Sesion cerrada');
  }
  crearEvento(){
    console.log(['/registrar-evento',this.usuario]);
    this.router.navigate(['/registrar-evento']);
    
  }
  editarEvento(_id:String){
    this._eventoService.idEventoModificar = _id;
    this.router.navigate(['/modal-demo']);
  }
  //borrar evento
  async borrar(evento : any){
    this._eventoService.eventoIdBorrar = evento;
    await this. _eventoService.borrar();
    let eventoTBorrar: Evento;
    for(let data of this.eventosT){
      if(data._id == evento){
        eventoTBorrar = data;
      }
    }
    let indexT = this.eventosT.indexOf(eventoTBorrar);
    this.eventosT.splice(indexT,1);

    let eventoPBorrar: Evento;
    for(let data of this.eventosPtemp){
      if(data._id == evento){
        eventoPBorrar = data;
      }
    }
    let indexP = this.eventosPtemp.indexOf(eventoPBorrar);
    this.eventosPtemp.splice(indexP,1);
    console.log(evento);
  }

  async apuntarse(evento:Evento){
    console.log(evento);
    
   //Contemplar mensaje de apuntarse o mensaje de evento completo
    const index = evento.participantes.findIndex(usuario => usuario === this.usuario);

    if(index > -1){
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        backdropDismiss: false,
        subHeader: 'Ya estás apuntado en este evento',
        buttons: ['OK']
      });
      await alert.present();
    }else{
      if(evento.participantes.length === 4){
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          backdropDismiss: false,
          subHeader: 'Evento completado',
          buttons: ['OK']
        });
        await alert.present();
      }else{
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          subHeader: '¡Te has apuntado al evento!',
          buttons: ['OK']
        });
        await alert.present();

        evento.participantes.push(this.usuario);
    
        const datos = {
          _id: evento._id,
          participantes: evento.participantes
        }
         this._eventoService.apuntarse(datos); 
       }
     }
    
  }

  //Desapuntarse de un evento
  async desapuntarse(evento:Evento){
    console.log(evento);
    var indice = evento.participantes.indexOf(this.usuario); // obtenemos el indice
    evento.participantes.splice(indice,1); // 1 es la cantidad de elemento a eliminar
    
    const datos = {
      _id: evento._id,
      participantes: evento.participantes
    }
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      backdropDismiss: false,
      subHeader: 'Te has borrado del evento',
      buttons: ['OK']
    });
    await alert.present();
    this._eventoService.desapuntarse(datos);
  }

}
