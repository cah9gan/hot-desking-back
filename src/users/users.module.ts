import { Module } from '@nestjs/common';
import { UsersControler } from './users.controller';
import { UsersService } from './users.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  controllers: [UsersControler, ProfileController],
  providers: [UsersService, ProfileService],
  exports: [ProfileService],
})
export class UsersModule {}
