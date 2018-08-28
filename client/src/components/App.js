import React, { Component } from 'react';
import gql from 'graphql-tag';
import {graphql,compose} from 'react-apollo';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';

const TodosQuery = gql`
  {
    todos{
      id
      text
      complete
    }
  }
`;

const UpdateMutation = gql`
  mutation($id: ID!,$complete: Boolean!) {
    updateTodo(id:$id,complete:$complete) 
  }
`;



class App extends Component {

  updateTodo = async todo => {
    await this.props.updateTodo({
      variables:{
        id:todo.id,
        complete:!todo.complete   
      },
      update:store => { 
        const data = store.readQuery({ query: TodosQuery });
        data.todos =data.todos.map(
          x=> 
            x.id===todo.id
              ? {
                ...todo,
                complete:!todo.complete,
                }
              : x
          );
        store.writeQuery({query: TodosQuery, data})
      }
    });
    axios.get('http://localhost:4000/dark%20magician%20girl')
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });

  };

  deleteTodo = todo => () => {
    alert(todo);
  };

  render() {
    const {
      data:{loading,todos}
    }=this.props;
    if(loading){
      return null;
    }else{
      return (
        <div style={{display:'flex'}}>
          <div style={{margin:'auto',width:400}}>
            <Paper elevation={1}>
              <List>
                {todos.map(todo => (
                  <ListItem
                    key={todo.id}
                    role={undefined}
                    dense
                    button
                    onClick={()=>this.updateTodo(todo)}
                  >
                    <Checkbox
                      checked={todo.complete}
                      tabIndex={-1}
                      disableRipple
                    />
                    <ListItemText primary={todo.text} />
                    <ListItemSecondaryAction>
                      <IconButton onClick={this.deleteTodo(todo.id)}>
                        <CloseIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </div>
        </div>
      );
    }    
  }
}

export default compose(graphql(UpdateMutation,{name:"updateTodo"}),graphql(TodosQuery))(App);
