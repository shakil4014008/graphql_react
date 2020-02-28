//exactly what data looks like
const graphql = require('graphql');
//const _ = require('lodash') //walk through collection of data
const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLString, 
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
} = graphql; 

// const users =[
//    {id: '23', firstName: "john", age: 30},
//    {id: '47', firstName: "shakil", age: 44}

// ];
//this tells application has a concept of user, and related tables  
const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      description: { type: GraphQLString },
      users: {
        type: new GraphQLList(UserType),
        resolve(parentValue, args) {
          return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
            .then(res => res.data)
        }
      }
    })
  });
  


  const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: { type: GraphQLString },
      firstName: { type: GraphQLString },
      age: { type: GraphQLInt },
      company: {
        type: CompanyType,
        resolve(parentValue, args) {
          return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
            .then(res => res.data);
        }
      }
    })
  });

//enter into application data graph 
//
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
      user: {
          type: UserType, //return 
          args: {id: {type: GraphQLString }} ,//input parameters
          resolve(parentValue, args){  //grab real data 
             //return _.find (users, {id: args.id}); //send data. 
             return axios.get(`http://localhost:3000/users/${args.id}`)
                   .then(resp => resp.data);
          }
      },
      company: {
          type: CompanyType,
          args: {id: {type: GraphQLString}},
          resolve(parentValue, args){
              return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then(res => res.data);
          }
      }
 
  }
});

module.exports = new GraphQLSchema({
   query: RootQuery
});