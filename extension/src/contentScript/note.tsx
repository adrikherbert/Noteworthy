import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from 'uuid';
import SmallNoteIcon from '../static/SmallNoteIcon.svg';
import { ShadowRoot } from "./ShadowRoot";

const Container = styled.div`
  z-index: 2;
  border: 1px solid grey;
  position: absolute;
  background: white;
  top: ${(props) => props.y + "px"};
  left: ${(props) => props.x + "px"};
`;

const Header = styled.div`
  height: 20px;
  background-color: #F3E779;
`;

const StyledButton = styled.button`
  height: 20px;
  border: none;
  opacity: 0.5;
  float: right;
`;

const StyledTextArea = styled.textarea`
  color: black;
  height: 200px;
  width: 200px;
  border: none;
  background-color: #F3E779;
`;

const Note = () => {
  const [x, setX] = useState<Number>();
  const [y, setY] = useState<Number>();
  const [notes, setNotes] = useState([]);
  const url = window.location.href;

  const getCoords = (event) => {
    if (event.button == 2) {
      chrome.runtime.onMessage.removeListener(newNote);
      setX(event.clientX);
      setY(event.clientY + window.pageYOffset);
    }
  };

  function newNote(message, sender, sendResponse) {
    if (message.txt = "Note") {
      setNotes((prevNotes) =>
      [...prevNotes, 
        { x: x, 
          y: y, 
          id: uuidv4(),
          url: url
        }
      ]);
    }
    chrome.runtime.onMessage.removeListener(newNote);
    sendResponse();
  }

  useEffect(() => {
    document.addEventListener('mousedown', getCoords);
    chrome.runtime.onMessage.addListener(newNote);
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(newNote);
  }, [x, y]);

  return (
    <div>
      {notes.map((note) => {
        const handleChange = (e) => {
          const editedText = e.target.value;
          setNotes((prevNotes) =>
            prevNotes.reduce(
              (acc, cv) =>
                cv.x === note.x && cv.y === note.y && cv.id === note.id
                  ? acc.push({ ...cv, note: editedText }) && acc
                  : acc.push(cv) && acc,
              []
            )
          );
        };

        const handleDelete = () => {
          var result = confirm("Are you sure you want to delete this note?");
          if (result) {
            setNotes((prevNotes) =>
              prevNotes.reduce(
                (acc, cv) =>
                  cv.x === note.x && cv.y === note.y ? acc : acc.push(cv) && acc,
                []
              )
            );
          }
        };

        return (
          <div className="note" key={note.id}>
            <ShadowRoot>
              <Container x={note.x} y={note.y} className="react-sticky-note">
                <Header>
                  <StyledButton onClick={handleDelete}>X</StyledButton>
                </Header>
                <StyledTextArea
                  onChange={handleChange}
                  value={note.note ? note.note : ""}
                  key={note.id}
                />
              </Container>
            </ShadowRoot>
          </div>
        );
      })}
    </div>
  );
};

export default Note;