import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()
    const pokemonExists = await this.pokemonModel.findOne({
      $or: [
        { no: createPokemonDto.no },
        { name: createPokemonDto.name }
      ]
    })

    if (pokemonExists) throw new BadRequestException('Pokemon with no or name already exists')

    const pokemon = await this.pokemonModel.create(createPokemonDto)
    return pokemon;
  }

  async findAll() {
    const pokemons = await this.pokemonModel.find()
    return pokemons
  }

  async findOne(term: string) {
    let pokemon: Pokemon

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term })
    } else if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term)
    } else {
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() })
    }

    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or no ${term} not found`)
    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term)
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase()
    }

    await pokemon.updateOne(updatePokemonDto, { new: true })
    return {
      message: 'Pokemon updated successfully'
    }
  }

  async remove(id: string) {
    await this.pokemonModel.findByIdAndDelete(id)
    return {
      message: 'Pokemon deleted successfully'
    }
  }
}
