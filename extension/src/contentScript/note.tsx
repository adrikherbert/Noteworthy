import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from 'uuid';
import { Delete } from '@styled-icons/material/Delete';
import { Folder } from '@styled-icons/boxicons-solid/Folder';
import { UserGroup } from '@styled-icons/fa-solid/UserGroup';
import { Box, TextField } from '@mui/material';
import SmallNoteIcon from '../static/SmallNoteIcon.svg';
import { ShadowRoot } from "./ShadowRoot";
import './note.css';

const Container = styled.div`
  z-index: 2;
  border: 1px solid grey;
  position: absolute;
  background: #F3E779;
  display: grid;
  grid-template-areas:
    "title"
    "text"
    "footer";
  top: ${(props) => props.y + "px"};
  left: ${(props) => props.x + "px"};
`;

const Footer = styled.div`
  height: 20px;
  background-color: #F3E779;
  grid-area: footer;
  margin: 8px;
  margin-bottom: 16px;
`;

const TitleArea = styled.textarea`
  color: black;
  height: 50px;
  width: 240px;
  border: none;
  background-color: #F3E779;
  resize: none;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 500;
  grid-area: title;
  margin-left: 8px;
  margin-right: 8px;
  margin-top: 16px;
  outline: none;
  box-shadow: none;
  &::placeholder {
    color: #303030;
  }
`;

const StyledTextArea = styled.textarea`
  color: black;
  height: 150px;
  width: 240px;
  border: none;
  background-color: #F3E779;
  resize: none;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 300;
  grid-area: text;
  outline: none;
  box-shadow: none;
  margin-left: 8px;
  margin-right: 8px;
  &::placeholder {
    color: #303030;
  }
`;

const DeleteIcon = styled(Delete)`
  color: #303030;
  height: 25px;
  width: 25px;
  float: right;
  margin: 8px;
  cursor:pointer;
`;

const GroupIcon = styled(UserGroup)`
  color: #303030;
  height: 25px;
  width: 25px;
  float: right;
  margin: 8px;
  cursor:pointer;
`;

const FolderIcon = styled(Folder)`
  color: #303030;
  height: 25px;
  width: 25px;
  float: right;
  margin: 8px;
  cursor:pointer;
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
        const handleTitleChange = (e) => {
          const editedText = e.target.value;
          setNotes((prevNotes) =>
            prevNotes.reduce(
              (acc, cv) =>
                cv.x === note.x && cv.y === note.y && cv.id === note.id
                  ? acc.push({ ...cv, title: editedText }) && acc
                  : acc.push(cv) && acc,
              []
            )
          );
        };

        const handleTextChange = (e) => {
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
                <TitleArea
                  onChange={handleTitleChange}
                  value={note.title ? note.title : ""}
                  placeholder="Note Title Goes Here"
                />
                <StyledTextArea
                  onChange={handleTextChange}
                  value={note.note ? note.note : ""}
                  key={note.id}
                  placeholder="Note Text Goes Here"
                />
                <Footer>
                  <DeleteIcon onClick={handleDelete}/> <GroupIcon /> <FolderIcon />
                </Footer>
              </Container>
            </ShadowRoot>
          </div>
        );
      })}
    </div>
  );
};

export default Note;