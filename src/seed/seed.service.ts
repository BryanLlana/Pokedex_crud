import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokemonResponse } from './interfaces/response-pokemon.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {}
  
  async executeSeed() {
    await this.pokemonModel.deleteMany({})
    const data = await this.http.get<PokemonResponse>('https://pokeapi.co/api/v2/pokemon?limit=600')
    const insertPokemonArray: { name: string, no: number }[] = []
    data.results.forEach(async ({name, url}) => {
      const array = url.split('/')
      const no = +array[array.length - 2]
      insertPokemonArray.push({ name, no})
    })

    await this.pokemonModel.insertMany(insertPokemonArray)

    return {
      message: 'Seed executed'
    }
  }
}
