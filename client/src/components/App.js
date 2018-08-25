import React, { Component } from 'react';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const TodosQuery = gql`
{
  todos{
    id
    text
    complete
  }
}
`;



class App extends Component {

  updateTodo = todo => () => {
    alert(todo);
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
                    onClick={this.updateTodo(todo.id)}
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

export default graphql(TodosQuery)(App);
