import React, { useEffect } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from 'recoil';
import { IToDoState, toDoState } from './atoms';
import Board from './components/Board';
import { stringify } from 'querystring';

interface ITrashProps{
  isDraggingOver: boolean;
  draggingFromThisWith: boolean;
}

function App() {

  const [ toDos, setToDos ] = useRecoilState(toDoState);

  const onDragEnd = (info:DropResult) => {

    //드래그가 끝났을때 실행되는 함수
    // 어떤 일이 일어났는지에 대한 정보 argument를 준다
    // source 옮겨지는 대상에 관한 정보
    // destination 대상이 가려는 장소에 관한 정보
    // source.indx => 드래그 하는 인덱스
    // destination.index => 드롭하는 곳의 index    

    const { destination, source} = info;

    if(!destination) return;

    if(destination?.droppableId === "trash"){
      setToDos(prev => {
        const boardCopy = [...prev[source.droppableId]];
        boardCopy.splice(source.index, 1);

        const resObj = {
          ...prev,
          [source.droppableId]: boardCopy
        }

        localStorage.setItem("toDos", JSON.stringify(resObj))
        return resObj;
      })
    }

    if(destination?.droppableId === source.droppableId){ //같은 board안에서의 dnd

      // source.droppableId 옮겨지는 대상의 아이디
      // destination?.droppableId 드롭하는 곳의 아이디
      setToDos(prev => {
        const boardCopy = [...prev[source.droppableId]]; //옮겨지는 애가 속하는 배열
        const taskObj = boardCopy[source.index]; // 옮기려는 객체
        boardCopy.splice(source.index, 1); //옮기려는 객체 뽑아내기
        boardCopy.splice(destination?.index, 0, taskObj); // 옮기려는 객체 중간에 넣기

        const resObj = {
          ...prev,
          [source.droppableId]: boardCopy
        }

        localStorage.setItem("toDos", JSON.stringify(resObj))

        return resObj;
      })
    }

    if(destination?.droppableId !== source.droppableId){ // 다른 board안에서의 dnd
      
      setToDos(prev => {
        const sourceBoard = [...prev[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const targetBoard = [...prev[destination?.droppableId]];

        sourceBoard.splice(source.index, 1);
        targetBoard.splice(destination?.index, 0, taskObj);

        const resObj = {
          ...prev,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: targetBoard 
        }

        localStorage.setItem("toDos", JSON.stringify(resObj))

        return resObj;

      })
    }

  };

  useEffect( () => {

    const def = {
      "To Do": [],
      Doing: [],
      Done: []
    }

    const data: string = localStorage.getItem("toDos") || JSON.stringify(def);
    const toDoObj: IToDoState = JSON.parse(data);

    setToDos(prev => {
      return {
        ...toDoObj
      }
    })
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {
            Object.keys(toDos).map(boardId => <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />)
          }
        </Boards>
        <Droppable droppableId='trash'>
          {
            (magic, snapshot) => <Trash 
              isDraggingOver={snapshot.isDraggingOver}
              draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
              ref={magic.innerRef}
              {...magic.droppableProps}>
                <p>Trash</p>
              </Trash>
          }
        </Droppable>
      </Wrapper>
    </DragDropContext>
  );
}

const Trash = styled.div<ITrashProps>`
  width: 80%;
  height: 150px;
  background-color: ${props => props.isDraggingOver ? "gray" : "black"};
  opacity: 0.5;
  margin-top: 20px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  p{
    color: #a51818;
    font-size: 40px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
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
