import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: true }))
  await app.listen(3000)
  // await app.listen(3000, '0.0.0.0'); // PROD: it only accepts localhost if we don't set '0.0.0.0'
}
bootstrap()
