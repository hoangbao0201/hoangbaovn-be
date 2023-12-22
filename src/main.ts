import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { RedisIoAdapter } from './RedisIoAdapter';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    // app.setGlobalPrefix('api');
    // app.enableCors({
    //   origin: 'http://localhost:3000',
    // });

    app.useGlobalPipes(new ValidationPipe());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));

    const configService = app.get(ConfigService);
    const redisIoAdapter = new RedisIoAdapter(configService);
    await redisIoAdapter.connectToRedis();

    app.useWebSocketAdapter(redisIoAdapter);


    await app.listen(process.env.PORT || 4000);
}
bootstrap();
