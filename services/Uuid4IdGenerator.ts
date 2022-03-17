import { IUniqueStringGenerator } from './interfaces';

type GeneratorFunction = () => string;

export interface Uuid4IdGeneratorParams {
  generator: GeneratorFunction;
}

export class Uuid4IdGenerator implements IUniqueStringGenerator {
  private readonly generator: GeneratorFunction;

  constructor(params: Uuid4IdGeneratorParams) {
    this.generator = params.generator;
  }

  public generate(): string {
    return this.generator();
  }
}
