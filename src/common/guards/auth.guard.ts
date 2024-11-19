import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [type, token] = request.headers.authorization.split(' ');

    if (type !== 'Bearer') {
      throw new UnauthorizedException('Invalid token type');
    }

    try {
      const user = this.jwtService.verify(token);
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token or expired token');
    }
  }
}
