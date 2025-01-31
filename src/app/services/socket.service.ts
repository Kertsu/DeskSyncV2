import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Injectable({
  providedIn: 'root'
})
export class SocketService {

  reservationEnded = this.socket.fromEvent<{reservationId:string, message: string}>('reservation-expired');

  constructor(private socket: Socket) { }

  emit(event: string, data: any){
    this.socket.emit(event, data)
  }

  listen(event: string){
    return this.socket.fromEvent(event)
  }

  connect(){
    this.socket.connect()
  }

  disconnect(){
    this.socket.disconnect()
  }

}