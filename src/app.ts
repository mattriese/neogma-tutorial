/**
 * The following lines intialize dotenv,
 * so that env vars from the .env file are present in process.env
 */
import * as dotenv from 'dotenv';
import { Neogma } from 'neogma';
import { Movies, MoviesPropertiesI } from './models/Movies';
import { Users, UsersPropertiesI } from './models/Users';
dotenv.config();
export const neogma = new Neogma(
  {
    url: 'bolt://3.89.19.152:7687',
    username: 'neo4j',
    password: process.env.neo4jpassword || 'password',
  },
  {
    logger: console.log,
    encrypted: false,
  },
);
console.log('hello neogma!');
const populateData = async () => {
  await neogma.queryRunner.run('MATCH (n) DETACH DELETE n');

  // create a single node
  await Users.createOne({
    name: 'Barry',
    age: 36,
  });

  // create nodes in bulk
  await Movies.createMany([
    {
      name: 'The Dark Knight',
      year: 2008,
    },
    {
      name: 'Inception',
      year: 2010,
    },
  ]);

  // build an instance
  const cynthia = Users.build({
    name: 'Cynthia',
    age: 21,
  });

  // save it to the database
  await cynthia.save();
  // relate this instance to a movie
  await cynthia.relateTo({
    // the alias to use for the relationships information
    alias: 'LikesMovie',
    where: {
      // the name of the movie
      name: 'The Inception',
    },
  });

  // create a user, relate it to existing movie, and also relate it to a new movie created here.
  /**
   * this call performs the following:
   * 1) Create a User node
   * 2) Relates that node to an existing movie (The Dark Knight), via a where parameter
   * 3) Creates a new movie (Interstellar) with the given properties, and relates the User with it
   * All these happen in a single operation
   */
  await Users.createOne({
    name: 'Jason',
    age: 26,
    LikesMovie: {
      // where parameters for relating it with an existing mode
      where: {
        params: {
          name: 'The Dark Knight',
        },
      },
      // properties for creating the new node
      properties: [
        {
          name: 'Interstellar',
          year: 2014,
        },
      ],
    },
  });

  // find a user. This is also an instance like the ones above
  const barry = await Users.findOne({
    where: {
      name: 'Barry',
    },
  });
  // findOne can return null if the node is not found. This is also required in TypeScript strict mode
  if (barry) {
    console.log(`Barry's age is ${barry.age}`);
    barry.age = 37;
    // save the change to the database. Since the node already exists, it will just be updated
    await barry.save();
    // let's have Barry like every movie!
    await barry.relateTo({
      alias: 'LikesMovie',
      where: {},
    });
  }

  // finally, let's make Cynthia like Interstellar
  await cynthia.relateTo({
    alias: 'LikesMovie',
    where: {
      name: 'Interstellar',
    },
  });
};

const main = async () => {
  // populate the data
  await populateData();
};

main();
