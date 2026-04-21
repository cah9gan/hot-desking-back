import { Module } from '@nestjs/common';
import { UsersControler } from './users.controller';
import { UsersService } from './users.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PasswordResetService } from './password-reset.service';
import { EmailModule } from '../email';

@Module({
  controllers: [UsersControler, ProfileController],
  providers: [PasswordResetService, UsersService, ProfileService],
  exports: [ProfileService],
  imports: [EmailModule],
})
export class UsersModule {}
