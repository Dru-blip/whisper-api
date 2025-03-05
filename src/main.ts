import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JWTAuthGuard } from './common/guards/auth.guard';
import { TokenService } from './modules/utils/tokens.service';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const adapter = new ExpressAdapter();
  adapter.set('trust proxy', 1);
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  const tokensService = app.get(TokenService);
  app.useGlobalGuards(new JWTAuthGuard(reflector, tokensService));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  await app.listen(process.env.PORT ?? 5000);
}

bootstrap();
