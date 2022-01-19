import React from 'react';
import styled from 'styled-components';

function App() {
  return (
    <div>
    </div>
  );
}

const Wrapper = styled.div`
  display: flex;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const Boards = styled.div`
  display: flex;
  width: 100%;
  /* gird-template-columns: repeat(3, 1fr); */
  justify-content: space-around;
  align-items: center;
`

export default App;
