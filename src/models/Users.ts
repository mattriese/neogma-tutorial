import { neogma } from '../app';
import { ModelFactory, NeogmaInstance, ModelRelatedNodesI } from 'neogma';

import { Movies, MoviesInstance } from './Movies';

export type UsersPropertiesI = {
  name: string;
  age: number;
};

export interface UsersRelatedNodesI {
  LikesMovie: ModelRelatedNodesI<typeof Movies, MoviesInstance>;
}

export type UsersInstance = NeogmaInstance<
  UsersPropertiesI,
  UsersRelatedNodesI
>;

export const Users = ModelFactory<UsersPropertiesI, UsersRelatedNodesI>(
  {
    label: 'User',
    primaryKeyField: 'name',
    schema: {
      name: {
        type: 'string',
        required: true,
        minLength: 1,
      },
      age: {
        type: 'number',
        required: true,
        minimum: 1,
      },
    },
    relationships: {
      LikesMovie: {
        model: Movies,
        direction: 'out',
        name: 'LIKES',
      },
    },
  },
  neogma,
);
