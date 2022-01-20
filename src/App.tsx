import React from 'react';
import styled from 'styled-components';
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from 'recoil';
import { toDoState } from './atoms';
import Board from './components/Board';


function App() {

  const [ toDos, setToDos ] = useRecoilState(toDoState);

  const onDragEnd = (info:DropResult) => {
    const { destination, draggableId, source} = info;

    if(!destination) return;

    if(destination?.droppableId === source.droppableId){

      setToDos(prev => {
        const boardCopy = [...prev[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);

        return {
          ...prev,
          [source.droppableId]: boardCopy
        }
      })
    }

    if(destination?.droppableId !== source.droppableId){
      
      setToDos(prev => {
        const sourceBoard = [...prev[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const targetBoard = [...prev[destination?.droppableId]];

        sourceBoard.splice(source.index, 1);
        targetBoard.splice(destination?.index, 0, taskObj);

        return {
          ...prev,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: targetBoard 
        }

      })
    }

  };


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {
            Object.keys(toDos).map(boardId => <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />)
          }
        </Boards>
      </Wrapper>
    </DragDropContext>
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
