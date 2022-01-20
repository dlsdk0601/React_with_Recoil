# Recoil 

전역 변수 관리 라이브러리로 사용이 간편하다. 다운로드수가 꾸준히 증가 하고있고
리덕스를 넘어갈 날이 언젠가 올 것 같다.

## npm 
> npm install recoil

<br />

## index.js

<br />

> RecoilRoot로 전체 컴포넌트를 감싸준다.
```
    import React from 'react';
    import ReactDOM from 'react-dom';
    import { RecoilRoot } from 'recoil';
    import App from './App';
    
    ReactDOM.render(
        <RecoilRoot>
            <App />
        </RecoilRoot>,
    document.getElementById('root')
    );

```

1. atoms.js | atoms.ts
전역 변수 처리할 변수를 파일하나 만들어서 전부 정의 해놓는다

<br />

ex
```
    import { atom } from "recoil";

    export interface IToDo {
        text: string;
        id: number;
        category: "DONE" | "DOING"
    }

    export const toDoState = atom<IToDo[]>({
        key: "user",    //유니크한 키값 설정
        default: []     //초기 값
    })

    //여기서는 toDo가 배열의 형태로 들어올거기에 빈 배열로 초기값 설정

    //* typescript로 작업할 경우 배열에 뭐가 들어올지 interface로 설정 해줘야한다.
```

<br />

2. 변수 불러오기
어느 컴포넌트라도 바로 전역 변수를 불러 올 수 있다.

<br />

ex
``` 
    import { toDoState } from "../atoms";
    import { useRecoilValue } from "recoil";

    const toDo = useRecoilValue(toDoState);
```
<br /><br />

3. 전역변수 상태 변화

<br />

ex 
```
    import { toDoState } from "../atoms";
    import { useSetRecoilState } from "recoil";


    const setToDos = useSetRecoilState(toDoState);
    setToDos( oldToDos => [{text: "aaa", id: Date.now(), category: "TO_DO"}, ... oldToDos])
```

<br />

4. 변수값과 변화를 한번에 불러오기 
recoil의 큰 장점중 하나는 useState처럼 사용 가능하다는 것

<br />

ex
```
    import { toDoState } from "../atoms";
    import { useRecoilState } from "recoil";

    const [ toDos, setToDos ] = useRecoilState(toDoState);
    //toDos와 setToDos의 사용법은 2, 3번과 같다.
```

<br />

5. Selector 
atom 파일에서 selector를 만들고 get을 통해 atom의 값을 불러 올 수 있다. 

<br />

ex
```
    export const toDoSelector = selector({
    key: "toDoSelector",
    get: ({ get }) => {
        const toDos = get(toDoState);
        const category = get(categoryState);
        //get은 함수인데 atom을 selector안으로 가져오는 함수임        
        return toDos.filter(item => item.category === category);
    }
})
```

<br />

컴포넌트에서 useRecoilValue로 selector를 불러와서 변수에 담으면 된다.

<br />

```
    const toDoArr = useRecoilValue(toDoSelector);
    //toDoSelector가 반환하는건 배열임
```

<br />

6. atom에서 selector의 다른 속성으로 set이 있는데, 이를 통해 atom의 초기값을 바꿀 수 있다. 

<br />

atom.js
```
    export const houtSelector = selector<number>({
        key: "hour",
        get: ({get}) => {
            const minutes = get(minuteState);
            return minutes / 60;
        },
        set: ({set}, newValue) => {
            const minutes = Number(newValue) * 60;
            set(minuteState, minutes); //어떤 해당 state에 있는 초기값을 두번째 argument의 값으로 바꾼다
        }
    })
```

<br />

app.js
```
     const [ hours, setHours] = useRecoilState(houtSelector);
```

<br />

> useRecoilState의 경우 반환 값의
<br />첫번째 값은 atom의 값이거나 selector의 get 함수의 값
<br />두번재 값은 atom을 수정하는 함수이거나, selector의 set property를 실행시키는 함수이다. 
<br />일반적으로 두개의 atom을 만들어서 만들겠지만, set을 이용하면 그럴 필요가 없음

<br />
> set과 get의 차이 
    <br />get 가져오고 싶은 atom의 값을 가져올수 있다. (가져만 온다. 가져와서 원하는 연산을 한 후 return)
    <br />set state의 초기값을 바꿀수 있다. (원하는 연산후 set을 통해 초기값 교체)

<br /><br />
--------------
<br /><br />

# react-beautiful-dnd

> react-beautiful-dnd를 이용해서 DragandDrop 기능 구현하기

1. setting

<br />

```
    npm install react-beautiful-dnd
```

<br />

> typeScript를 썼기 때문에, type을 알려주는 라이브러리도 다운 받아야한다

<br />

```
    npm i --save-dev @types/react-beautiful-dnd
```

<br />

2. App.js에서 드래그 영역과 드랍 영역을 지정해준다

<br />

```
    import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

    const App = () => {

        const onDragEnd = () => {}

        return (
            <DragDropContext onDragEnd={onDragEnd}>
            <Wrapper>
                <Boards>
                <Droppable droppableId='one'>  //드랍 영역
                    {
                    (magic) => <Board ref={magic.innerRef} {...magic.droppableProps}>
                        {
                            toDos.map( (toDO, index) => {
                            return (
                            <Draggable draggableId={toDO} index={index}> // 드래그 영역
                                {(magic) => (
                                <Card 
                                    ref={magic.innerRef} 
                                    {...magic.draggableProps}
                                    {...magic.dragHandleProps} 
                                    
                                > 드래그 해야할 컴포넌트의 셋팅
                                
                                {/* <span {...magic.dragHandleProps}>ddd</span> */}
                                {/* 같은 Draggable 영역에 있더라도 magic.dragHandleProps를 가지고 있는 태그를 정확하게 드래그해야 구현된다 */}
                                {/* span태그 주석을 풀 경우, span 태그를 선택해야 드래그된다. 대신에 Card 컴포넌트의 {...magic.dragHandleProps} 지워야한다.*/}
                                    {toDO}
                                </Card>
                                )}
                                </Draggable>
                            )
                            })
                        }
                        {magic.placeholder}
                        {/* 드래그 할 경우, board 태그가 작아지는 현상 방지. 그래서 boards안에서 젤 마지막에 적는다 */}
                    </Board>
                    }
                    {/* Droppable의 children은 함수여야한다 */}
                </Droppable>
                </Boards>
            </Wrapper>
            </DragDropContext>
        );
    }
```