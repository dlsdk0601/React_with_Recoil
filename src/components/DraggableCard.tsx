import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

interface IDragabbbleCardProps {
    toDoId: number;
    toDoText: string;
    index: number;
}

const DraggableCard = ({ toDoId, toDoText, index }: IDragabbbleCardProps) => {


    const delete_item = () => {
        console.log(toDoId, toDoText, index)
    }

    return (
        <Draggable draggableId={toDoId + ""} index={index}>
            {
                (magic, Snapshot) => { 
                    return (
                        <Card isDragging={Snapshot.isDragging} ref={magic.innerRef} {...magic.dragHandleProps} {...magic.draggableProps}>{toDoText}</Card>
                    )
                }
            }
        </Draggable>
    );
}

const Card = styled.div<{isDragging: boolean}>`
    border-radius: 5px;
    margin-bottom: 5px;
    padding: 10px 10px;
    background-color: ${(props) => props.isDragging ? "#74b9ff" : props.theme.cardColor};
    box-shadow: ${ props => props.isDragging ? "0px 2px 25px rgba(0, 0, 0, 0.5)" : "none"};
`;

export default React.memo(DraggableCard);