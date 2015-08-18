/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
} from 'graphql-relay';

import {
  User,
  Post,
  getPost,
  getPosts,
  getPostsByUser,
  getUser
} from './database';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'Post') {
      return getPost(id);
    } else if (type === 'User') {
      return getUser(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof Post) {
      return postType;
    } else if (obj instanceof User) {
      return userType;
    } else {
      return null;
    }
  }
);

/**
 * Define your own types here
 */
const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A blog user',
  fields: () => ({
    id: globalIdField('User'),
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    posts: {
      type: postConnection,
      description: 'The users posts',
      args: connectionArgs,
      resolve: ({id}, args) => connectionFromArray(
        getPostsByUser(id),
        args
      )
    }
  }),
  interfaces: [nodeInterface]
});


const postType = new GraphQLObjectType({
  name: 'Post',
  description: 'A shiny post',
  fields: () => ({
    id: globalIdField('Post'),
    title: { type: new GraphQLNonNull(GraphQLString) },
    body: { type: new GraphQLNonNull(GraphQLString) },
    tags: { type: new GraphQLList(GraphQLString) },
    author: {
      type: userType,
      resolve: ({authorId}) => getUser(authorId)
    },
    publishedAt: { type: GraphQLString }
  }),
  interfaces: [nodeInterface]
});

const testType = new GraphQLObjectType({
  name: 'Test',
  description: 'Temporary intermediate object while issue https://github.com/facebook/relay/issues/108 is fixed/figured out',
  fields: () => ({
    posts: {
      type: postConnection,
      description: 'Our collection of posts',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getPosts(), args)
    }
  })
});




/**
 * Define your own connection types here
 */
var {connectionType: postConnection} =
  connectionDefinitions({name: 'Post', nodeType: postType});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    test: {
      type: testType,
      resolve: () => { return {temp: 'hack'}; }
    },
  }),
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType
});
