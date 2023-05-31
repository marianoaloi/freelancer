import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Project } from '../entity/Project';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  alterProject = this.socket.fromEvent<Project>('alterProject')

  constructor(private socket: Socket) { }
}
