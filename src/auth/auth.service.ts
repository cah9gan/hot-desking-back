import { randomUUID } from 'crypto';
import { ProfileService } from '../users';
import { AccessDTO, loginDTO } from './dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly profileService: ProfileService) {}

  login(data: loginDTO): AccessDTO {
    const id = randomUUID();
    const profile = this.profileService.getSelf(id);
    return { ...profile, token: 'heloo' };
  }
}
