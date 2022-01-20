import React from "react";
import { ITodo, toDoState } from "../atoms";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import DraggableCard from "./DraggableCard";

interface BoardProps{
    boardId: string;
    toDos: ITodo[];
}

interface IForm{
    toDo: string;
}

const Board = ({boardId, toDos}: BoardProps) => {

    const { register, setValue, handleSubmit } = useForm<IForm>();

    const setToDos = useSetRecoilState(toDoState);

    const onValid = ({toDo}:IForm) => {
        const newToDo = {
            id: Date.now(),
            text: toDo
        }

        setToDos( prev => {
            return {
                ...prev,
                [boardId]: [
                    ...prev[boardId],
                    newToDo
                ]
            }
        });

        setValue("toDo", "");
    }

    return (
        <Wrapper>
            <Title>{boardId}</Title>
            <Form onSubmit={handleSubmit(onValid)} >
                <input {...register("toDo", { required: true } ) } type="text" placeholder={`Add task on ${boardId}`} />
            </Form>
            <Droppable droppableId={boardId}>
                {
                    (magic, snapshot) => 
                        <Area 
                            isDraggingOver={snapshot.isDraggingOver}
                            draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
                            ref={magic.innerRef}
                            {...magic.droppableProps}
                        >
                            {
                                toDos.map( (toDo, index) => {
                                    return <DraggableCard key={toDo.id} index={index} toDoId={toDo.id} toDoText={toDo.text} />
                                })
                            }
                            {magic.placeholder}
                        </Area>
                }
            </Droppable>
        </Wrapper>
    )
}

interface IAreaProps{
    isDraggingOver: boolean;
    draggingFromThisWith: boolean;
}

const Area = styled.div<IAreaProps>`
    background-color: ${props => props.isDraggingOver ? "#dfe6e9" : props.draggingFromThisWith ? "#b2bec3" : "transparent"};
    flex-grow:1;
    transition: background-color .3s ease-in-out;
    padding: 20px;
`

const Form = styled.form`
    width: 100%;
    input{
        width: 100%;
    }
`

const Wrapper = styled.div`
    background-color: ${(props) => props.theme.boardColor};
    padding: 10px 0px;
    padding-top: 30px;
    min-height: 200px;
    width: 220px;
    height: 500px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
`

const Title = styled.h1`
    text-align: center;
    padding-bottom: 20px;
`

export default Board;