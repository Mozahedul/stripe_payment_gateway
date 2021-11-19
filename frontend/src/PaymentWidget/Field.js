import React from 'react';
import { Form } from 'react-bootstrap';

const Field = (props) => {
  return (
    <div className="FormRow">
      <Form.Label htmlFor={props.id}>{props.label}</Form.Label>
      <Form.Control
        className="FormRowInput"
        id={props.id}
        type={props.type}
        min={props.min}
        placeholder={props.placeholder}
        required={props.required}
        autoComplete={props.autoComplete}
        value={props.value}
        onChange={props.onChange}
      ></Form.Control>
    </div>
  );
};

export default Field;
