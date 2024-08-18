import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://congenial-potato-x5rgx975jvgp296vp-3000.app.github.dev',
    credentials: true, 
  });
  
  await app.listen(process.env.PORT);
}
bootstrap();
