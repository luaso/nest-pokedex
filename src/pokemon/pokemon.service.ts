import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon, PokemonDocument } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { paginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<PokemonDocument>,
  ) {}
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon: PokemonDocument =
        await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error: unknown) {
      this.handleExection(error);
    }
  }

  async findAll(paginationDto: paginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.pokemonModel
      .find({})
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');
  }

  async findOne(term: string) {
    let pokemon: PokemonDocument | null = null;
    //si es un num busca por no
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: +term });
    }
    //busca si es un id de mongo
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }
    //busca por name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase() });
    }

    if (!pokemon)
      throw new NotFoundException(
        `POkemon with id, name or no '${term}' not found`,
      );
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    updatePokemonDto.name = updatePokemonDto.name?.toLowerCase();
    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });
    } catch (error: unknown) {
      this.handleExection(error);
    }
    return { ...pokemon.toJSON(), ...updatePokemonDto };
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id ${id} not found`);
    }
    return true;
  }

  private handleExection(error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: number }).code === 11000 &&
      'keyValue' in error
    ) {
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Pokemon - Check Server logs`,
    );
  }
}
