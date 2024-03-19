import { ChatGateway } from './chat/chat.gateway';
import { AlertGateway } from './alert/alert.gateway';
import { AlertController } from './alert/alert.controller';
import { Module } from '@nestjs/common/decorators/modules';

@Module({
  imports: [],
  controllers: [AlertController],
  providers: [ChatGateway, AlertGateway],
})
export class AppModule {}
