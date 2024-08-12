import { Module } from '@nestjs/common';
import { ProtectedController } from './protected/protected.controller';

@Module({
  controllers: [ProtectedController],
})
export class ProtectedModule {}
