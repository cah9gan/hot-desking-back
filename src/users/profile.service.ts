import { ForbiddenException, Injectable } from '@nestjs/common';
import { SetPasswordDTO, UserRole, ViewProfileDTO } from './dto';
import { PasswordResetService } from './password-reset.service';
import { PrismaService } from '../prisma';
import { UserStatus } from '../../generated/prisma/enums';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  public getSelf(id: string): ViewProfileDTO {
    return {
      id,
      role: UserRole.User,
      firstName: 'One',
      lastName: 'Two',
      email: 'one@example.com',
    };
  }

  public async resetPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    if (!user) return;
    if (user.status !== UserStatus.active) {
      throw new ForbiddenException('Acconut is baned');
    }

    await this.passwordResetService.createOrReplace(user.id, email);
  }

  public async setPassword({
    email,
    code,
    password,
  }: SetPasswordDTO): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });
    if (!user) return;
    if (user.status !== UserStatus.active) {
      throw new ForbiddenException('Acconut is baned');
    }

    await this.passwordResetService.setPassword(user.id, code, password);
  }
}
