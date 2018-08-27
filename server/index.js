const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });

const Todo = mongoose.model("Todo",{
    text: String,
    complete:Boolean
});

const typeDefs = `
  type Query {
    todos:[Todo]
  }
  type Todo {
    id: ID!
    text: String!
    complete: Boolean!
  }
  type Mutation {
      createTodo(text:String!):Todo
      updateTodo(id: ID!, complete:Boolean!): Boolean
      removeTodo(id:ID!):Boolean
  }
`;

const resolvers = {
  Query: {
    todos: ()=>Todo.find()
  },
  Mutation:{
      createTodo: async(_,{text})=>{
          const todo = new Todo({text,complete:false});
          await todo.save();
          return todo;
      },
      updateTodo:async(_,{id,complete})=>{
        await Todo.findByIdAndUpdate(id,{complete});
        return true;
      },
      removeTodo:async(_,{id})=>{
        await Todo.findByIdAndRemove(id);
        return true;
      }
  }
}
const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });
app.get('/', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    var apiURL =  'https://www.ygohub.com/api/card_info?name=Dark%20Magician';

    var request = require('request');
    request(apiURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
       res.send(body); // res is your original response 
    }
  })
});
mongoose.connection.once('open', function() {
  app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'))
});