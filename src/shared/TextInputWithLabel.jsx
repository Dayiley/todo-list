import React from 'react';
import styled from 'styled-components';

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
`;

const StyledInput = styled.input`
  padding: 0.25rem;
`;

function TextInputWithLabel({ elementId, label, onChange, ref, value }) {
  return (
    <>
      <StyledLabel htmlFor={elementId}>
        {label}
        <StyledInput
          type="text"
          id={elementId}
          ref={ref}
          value={value}
          onChange={onChange}
        />
      </StyledLabel>
    </>
  );
}

export default TextInputWithLabel;
