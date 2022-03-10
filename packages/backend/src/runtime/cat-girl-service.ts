import { randomUUID } from 'crypto';
import { CatGirlPersistence } from './cat-girl-persistence';

export interface CatGirl {
  readonly catGirlId: string;
  readonly hotCount: number;
  readonly notHotCount: number;
  readonly hornyJailCount: number;
  readonly version: string;
}

export interface CatGirlVote {
  readonly catGirlId: string;
  readonly dedupId: string;
  readonly vote: CatGirlVoteValue;
}

export enum CatGirlVoteValue {
  HOT = 'HOT',
  NOT_HOT = 'NOT_HOT',
  HORNY_JAIL = 'HORNY_JAIL',
}

export interface CatGirlServiceOptions {
  readonly catGirlPersistence: CatGirlPersistence;
}

export class CatGirlService {
  private readonly catGirlPersistence: CatGirlPersistence;

  constructor(options: CatGirlServiceOptions) {
    this.catGirlPersistence = options.catGirlPersistence;
  }

  async createCatGirl(): Promise<CatGirl> {
    // TODO: Make this repeatable in case of uuid conflict.
    const nakedCatGirl = {
      catGirlId: randomUUID(),
      hornyJailCount: 0,
      hotCount: 0,
      notHotCount: 0,
      version: 'new',
    };

    return this.catGirlPersistence.createCatGirl(nakedCatGirl);
  }

  async getCatGirl(catGirlId: string): Promise<CatGirl | undefined> {
    return this.catGirlPersistence.getCatGirl(catGirlId);
  }

  async vote(voteRequest: CatGirlVote): Promise<CatGirl | undefined> {
    return this.catGirlPersistence.vote(voteRequest);
  }
}

export function getNowTimestamp() {
  return Math.round(Date.now() / 1000);
}
