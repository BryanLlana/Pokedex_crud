import { Module } from '@nestjs/common';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/pokedex'),
    PokemonModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule {}
