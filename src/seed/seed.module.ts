import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { Pokemon, PokemonSchema } from 'src/pokemon/entities/pokemon.entity';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonSchema,
      },
    ]),
  ],
})
export class SeedModule {}
