import React, { useReducer } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Initial state for the task management system
const initialState = {
  lists: [
    {
      id: 'list-1',
      title: 'To Do',
      tasks: [{ id: 'task-1', content: 'Task 1' }],
    },
    {
      id: 'list-2',
      title: 'In Progress',
      tasks: [{ id: 'task-2', content: 'Task 2' }],
    },
  ],
};

// Reducer to manage task system state
const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_LIST':
      return {
        ...state,
        lists: [
          ...state.lists,
          { id: `list-${state.lists.length + 1}`, title: action.title, tasks: [] },
        ],
      };
    case 'ADD_TASK':
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === action.listId
            ? {
                ...list,
                tasks: [
                  ...list.tasks,
                  { id: `task-${Date.now()}`, content: action.taskContent },
                ],
              }
            : list
        ),
      };
    case 'MOVE_TASK':
      const { source, destination } = action.payload;

      if (!destination) return state;

      const sourceList = state.lists.find((list) => list.id === source.droppableId);
      const destinationList = state.lists.find(
        (list) => list.id === destination.droppableId
      );

      const [movedTask] = sourceList.tasks.splice(source.index, 1);
      destinationList.tasks.splice(destination.index, 0, movedTask);

      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === sourceList.id || list.id === destinationList.id
            ? list.id === sourceList.id
              ? { ...list, tasks: sourceList.tasks }
              : { ...list, tasks: destinationList.tasks }
            : list
        ),
      };
    default:
      return state;
  }
};

const TaskManagementSystem = () => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const [newListTitle, setNewListTitle] = React.useState('');
  const [newTaskContent, setNewTaskContent] = React.useState('');
  const [selectedListId, setSelectedListId] = React.useState('');

  // Handle adding a new list
  const handleAddList = () => {
    if (newListTitle) {
      dispatch({ type: 'ADD_LIST', title: newListTitle });
      setNewListTitle('');
    }
  };

  // Handle adding a new task to a selected list
  const handleAddTask = (listId) => {
    if (newTaskContent) {
      dispatch({ type: 'ADD_TASK', listId, taskContent: newTaskContent });
      setNewTaskContent('');
    }
  };

  // Handle drag-and-drop task movement
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    dispatch({
      type: 'MOVE_TASK',
      payload: {
        source,
        destination,
      },
    });
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Task Management System
      </Typography>

      {/* Add new list */}
      <Box display="flex" justifyContent="center" sx={{ mb: 4 }}>
        <TextField
          label="New List Title"
          variant="outlined"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleAddList}>
          Add List
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={3}>
          {state.lists.map((list, listIndex) => (
            <Grid item xs={12} sm={6} md={4} key={list.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {list.title}
                  </Typography>

                  {/* Add new task */}
                  <Box display="flex" mb={2}>
                    <TextField
                      label="New Task"
                      variant="outlined"
                      fullWidth
                      value={newTaskContent}
                      onChange={(e) => setNewTaskContent(e.target.value)}
                      sx={{ mr: 2 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddTask(list.id)}
                    >
                      Add Task
                    </Button>
                  </Box>

                  {/* Draggable tasks */}
                  <Droppable droppableId={list.id}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{ minHeight: '100px', background: '#f0f0f0', padding: 2 }}
                      >
                        {list.tasks.map((task, taskIndex) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={taskIndex}
                          >
                            {(provided) => (
                              <Box
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  padding: 2,
                                  backgroundColor: '#fff',
                                  marginBottom: 2,
                                  borderRadius: 1,
                                  boxShadow: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}
                              >
                                {task.content}
                              </Box>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>
    </Box>
  );
};

export default TaskManagementSystem;
