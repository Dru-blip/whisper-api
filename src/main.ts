import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JWTAuthGuard } from './common/guards/auth.guard';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import * as cookieParser from 'cookie-parser';
import { SessionService } from './modules/utils/session.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const adapter = new ExpressAdapter();
  adapter.set('trust proxy', 1);

  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  const sessionService = app.get(SessionService);

  app.enableCors({ origin: process.env.CLIENT_URL });

  app.useGlobalGuards(new JWTAuthGuard(reflector, sessionService));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.use(cookieParser(process.env.COOKIE_SECRET));

  // API Documentation using swagger and scalar
  const config = new DocumentBuilder()
    .addSecurity('session', { type: 'apiKey', in: 'cookie', name: 'session' })
    .setTitle('Whisper API')
    .setDescription('API for Whisper')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/reference',
    apiReference({
      theme: 'default',
      spec: {
        content: document,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 5000);
}

bootstrap();
