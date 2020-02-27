//exactly what data looks like
const graphql = require('graphql');
const _ = require('lodash') //walk through collection of data
const {
    GraphQLObjectType,
    GraphQLString, 
    GraphQLInt,
    GraphQLSchema
} = graphql; 

const users =[
   {id: '23', firstName: "john", age: 30},
   {id: '47', firstName: "shakil", age: 44}

];
//this tells application has a concept of user, and related tables  
const UserType = new GraphQLObjectType({
   name: 'User',
   fields: {
       id: {type: GraphQLString },
       firstName: {type: GraphQLString },
       age:{type: GraphQLInt } 
   }
});

//enter into application data graph 

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
      user: {
          type: UserType, //return 
          args: {id: {type: GraphQLString }} ,//input parameters
          resolve(parentValue, args){  //grab real data 
             return _.find (users, {id: args.id}); //send data. 
          }
      }
 
  }
});

module.exports = new GraphQLSchema({
   query: RootQuery
});