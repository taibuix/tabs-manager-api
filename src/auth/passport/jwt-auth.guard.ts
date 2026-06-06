import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../decorators/custom';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(private reflector: Reflector) {
		super();
	}
	canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride<boolean>(
			IS_PUBLIC_KEY,
			[context.getHandler(), context.getClass()],
		);
		if (isPublic) {
			return true;
		}
		return super.canActivate(context);
	}

	override handleRequest<TUser = any>(err: Error, user: TUser) {
		// You can throw an exception based on either "info" or "err" arguments
		if (err || !user) {
			throw (
				err ||
				new UnauthorizedException('Access token is not valid or empty')
			);
		}
		return user;
	}
}
