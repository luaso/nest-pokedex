import { Injectable } from '@nestjs/common';

import { PokeResponse } from './interfaces/poke-respond.interface';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon, PokemonDocument } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SeedService {
  constructor(
    private readonly http: HttpService,
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<PokemonDocument>,
  ) {}

  async executeSEED() {
    await this.pokemonModel.deleteMany({});

    const { data } = await firstValueFrom(
      this.http.get<PokeResponse>(
        'https://pokeapi.co/api/v2/pokemon?limit=650',
      ),
    );

    const pokemons: CreatePokemonDto[] = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      return {
        name,
        no,
      };
    });

    await this.pokemonModel.insertMany(pokemons);
    return 'seed execute';
  }
  //  await Promise.all(promises);
}
