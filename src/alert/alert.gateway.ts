import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/alert' })
export class AlertGateway {
  @WebSocketServer() wss: Server;

  @SubscribeMessage('alertToServer')
  sendToAll(client: Socket, msg: string) {
    this.wss.emit('alertToClient', { type: 'Alert', message: msg });
  }
}
