import React, { useReducer, useState } from 'react';
import {
  Button,
  TextField,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  Select,
  InputLabel,
  FormControl,
  Box,
  Typography,
} from '@mui/material';
import { Grid } from '@mui/material';

// Define initial state for the form structure
const initialState = {
  fields: [],
};

// Reducer to manage form structure
const formReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_FIELD':
      return {
        ...state,
        fields: [...state.fields, action.payload],
      };
    case 'UPDATE_FIELD':
      return {
        ...state,
        fields: state.fields.map((field, index) =>
          index === action.index ? { ...field, value: action.value } : field
        ),
      };
    default:
      return state;
  }
};

// Available field types
const fieldTypes = ['Text', 'Dropdown', 'Radio'];

const FormBuilder = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [newFieldType, setNewFieldType] = useState('');

  // Add a new field to the form
  const addField = () => {
    if (newFieldType === 'Text') {
      dispatch({ type: 'ADD_FIELD', payload: { type: 'Text', label: 'Text Field', value: '' } });
    } else if (newFieldType === 'Dropdown') {
      dispatch({
        type: 'ADD_FIELD',
        payload: { type: 'Dropdown', label: 'Dropdown', options: ['Option 1', 'Option 2'], value: '' },
      });
    } else if (newFieldType === 'Radio') {
      dispatch({
        type: 'ADD_FIELD',
        payload: { type: 'Radio', label: 'Radio Button', options: ['Option 1', 'Option 2'], value: '' },
      });
    }
    setNewFieldType('');
  };

  // Handle field value changes
  const handleFieldChange = (index, value) => {
    dispatch({ type: 'UPDATE_FIELD', index, value });
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Dynamic Form Builder
      </Typography>
      
      <Grid container spacing={3} justifyContent="center">
        {state.fields.map((field, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            {field.type === 'Text' && (
              <TextField
                fullWidth
                label={field.label}
                variant="outlined"
                value={field.value}
                onChange={(e) => handleFieldChange(index, e.target.value)}
              />
            )}
            {field.type === 'Dropdown' && (
              <FormControl fullWidth>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  value={field.value}
                  onChange={(e) => handleFieldChange(index, e.target.value)}
                >
                  {field.options.map((option, i) => (
                    <MenuItem key={i} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {field.type === 'Radio' && (
              <FormControl component="fieldset">
                <RadioGroup
                  value={field.value}
                  onChange={(e) => handleFieldChange(index, e.target.value)}
                >
                  {field.options.map((option, i) => (
                    <FormControlLabel
                      key={i}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          </Grid>
        ))}
      </Grid>

      {/* Controls to add new fields */}
      <Box sx={{ marginTop: 4, textAlign: 'center' }}>
        <FormControl variant="outlined" sx={{ minWidth: 200, marginRight: 2 }}>
          <InputLabel>Add Field</InputLabel>
          <Select
            value={newFieldType}
            onChange={(e) => setNewFieldType(e.target.value)}
            label="Add Field"
          >
            {fieldTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={addField}
          disabled={!newFieldType}
        >
          Add Field
        </Button>
      </Box>
    </Box>
  );
};

export default FormBuilder;
