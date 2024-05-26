import { Module } from '@nestjs/common';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [PokemonModule],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule {}
