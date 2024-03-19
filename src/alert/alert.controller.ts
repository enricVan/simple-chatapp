import { Controller } from '@nestjs/common/decorators/core';
import { AlertGateway } from './alert.gateway';
import { Body, HttpCode, Post } from '@nestjs/common/decorators/http';

@Controller('alert')
export class AlertController {
  constructor(private alertGateway: AlertGateway) {}

  @Post()
  @HttpCode(200)
  sendAlertToAll(@Body() dto: { message: string }) {
    this.alertGateway.sendToAll(dto.message);
    return dto;
  }
}
