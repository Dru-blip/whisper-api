import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JWTAuthGuard } from './common/guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JWTAuthGuard(reflector));
  await app.listen(process.env.PORT ?? 5000);
}

bootstrap();
