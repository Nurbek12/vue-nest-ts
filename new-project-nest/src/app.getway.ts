import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit, OnGatewayConnection, 
    OnGatewayDisconnect, SubscribeMessage
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({ cors: true })
export class AppGetWay implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server

    afterInit(server: Server) { }

    handleConnection(client: Socket, ...args: any[]) { }

    handleDisconnect(client: any) { }

    @SubscribeMessage('send')
    handleChat(client: Socket, data: any) {
        this.server.emit('chat', data)
    }
}