import { neogma } from '../app';

import { ModelFactory, NeogmaInstance } from 'neogma';

export type MoviesPropertiesI = {
  name: string;
  year: number;
};
export interface MoviesRelatedNodesI {}

export type MoviesInstance = NeogmaInstance<
  MoviesPropertiesI,
  MoviesRelatedNodesI
>;

export const Movies = ModelFactory<MoviesPropertiesI, MoviesRelatedNodesI>(
  {
    label: 'Movie',
    primaryKeyField: 'name',
    schema: {
      name: {
        type: 'string',
        required: true,
        minLength: 1,
      },
      year: {
        type: 'number',
        required: true,
        minimum: 1900,
      },
    },
  },
  neogma,
);
