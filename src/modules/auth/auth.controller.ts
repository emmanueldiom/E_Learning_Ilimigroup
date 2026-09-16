import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../../dto/auth/register.dto';
import { LoginDto } from '../../dto/auth/login.dto';
import { ForgotPasswordDto } from '../../dto/auth/forgot-password.dto';
import { ResetPasswordDto } from '../../dto/auth/reset-password.dto';
import { RefreshTokenDto } from '../../dto/auth/refresh-token.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	
	@Post('register')
	@Public()
	register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	
	@Get('verify-email')
	@Public()
	verifyEmail(@Query('token') token: string) {
		return this.authService.verifyEmail(token);
	}

	
	@HttpCode(HttpStatus.OK)
	@Post('login')
	@Public()
	login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	
	@HttpCode(HttpStatus.OK)
	@Post('forgot-password')
	@Public()
	forgotPassword(@Body() dto: ForgotPasswordDto) {
		return this.authService.forgotPassword(dto.email);
	}

	
	@HttpCode(HttpStatus.OK)
	@Post('reset-password')
	@Public()
	resetPassword(@Body() dto: ResetPasswordDto) {
		return this.authService.resetPassword(dto);
	}

	
	@HttpCode(HttpStatus.OK)
	@Post('refresh')
	@Public()
	refresh(@Body() dto: RefreshTokenDto) {
		return this.authService.refreshTokens(dto.refreshToken);
	}

	@Roles(...Object.values(Role))
	@HttpCode(HttpStatus.OK)
	@Post('logout')
	logout(@CurrentUser('sub') userId: string) {
		return this.authService.logout(userId);
	}
}