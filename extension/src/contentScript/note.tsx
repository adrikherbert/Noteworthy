import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from 'uuid';
import { Delete } from '@styled-icons/material/Delete';
import { Folder } from '@styled-icons/boxicons-solid/Folder';
import { Save } from '@styled-icons/fluentui-system-filled/Save';
import { Alert, getCardContentUtilityClass, Snackbar, useRadioGroup } from '@mui/material';
import { ShadowRoot } from "./ShadowRoot";
import './note.css';
import NoteService from '../services/note.service.js';
import { getChromeItem, getCollectionId, setChromeItem } from "./contentScript";

const Container = styled.div`
  z-index: 100;
  position: absolute;
  background: #F3E779;
  display: grid;
  transition: all 0.3s ease-in-out;
  grid-template-areas:
    "title"
    "text"
    "footer";
  top: ${(props) => props.y + "px"};
  left: ${(props) => props.x + "px"};
  scale: ${(props) => props.visible ? 1 : 0};
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
  margin-left: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
  cursor:pointer;
`;

const SaveIcon = styled(Save)`
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
  const [openSave, setOpenSave] = useState(false);
  const url = window.location.href;
  setChromeItem("url", url);
  const [userId, setUserId] = useState<Number>();
  localStorage.setItem("url", url);

  const getCoords = (event) => {
    if (event.button == 2) {
      chrome.runtime.onMessage.removeListener(newNote);
      setX(event.clientX);
      setY(event.clientY + window.pageYOffset);
    }
  };

  async function newNote(message, sender, sendResponse) {
    if (message.info.selectionText == null && message.info.srcUrl == null) {
      try {
        var userId = await getChromeItem("user_id");
        var collectionId = await getCollectionId("collection_id");
        const data = {
          access_type: 0,
          collection_id: collectionId,
          content: "",
          is_visible: true,
          location_type: 0,
          title: "",
          url: url,
          user_id: userId,
          x: x,
          y: y
        };
        const response = await NoteService.create(data);
        setNotes((prevNotes) =>
        [...prevNotes, 
          response.data.note
        ]);
      } catch (error) {
          if(error.response?.status){
              console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
          } else {
              console.log(error);
              alert("Unable to create a note at this time.");
          }
      }
    }
    chrome.runtime.onMessage.removeListener(newNote);
    sendResponse();
  }

  async function getNotes() {
    var userId = await getChromeItem("user_id");
    console.log(userId);
    if (!userId) {
      setNotes([]);
    } else {
      const constraints = "" + userId + "," + url + "," + 0;
      const info = {"resource": "user_id,url,location_type", "constraint": constraints}
      try {
          const response = await NoteService.getAll(info);
          let list = [];
          console.log(response);
          response.data.results.forEach(function(note) {
              const data = {
                  id: note.id,
                  title: note.title,
                  content: note.content,
                  x: note.x,
                  y: note.y,
                  url: note.url,
                  is_visible: note.is_visible,
              }
              list.push(data);
          });
          setNotes(list);
      } catch(error){
          if(error.response?.status){
              console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
          } else {
              console.log(error);
          }
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', getCoords);
    getNotes();
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(newNote);
    chrome.storage.onChanged.addListener(async function(changes, namespace) {
      console.log("CHANGE DETECTED");
      var userId = await getChromeItem("user_id");
      if (userId == null) {
        setNotes([]);
      }
    });
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
                  ? acc.push({ ...cv, content: editedText }) && acc
                  : acc.push(cv) && acc,
              []
            )
          );
        };

        async function handleDelete () {
          var result = confirm("Are you sure you want to delete this note?");
          if (result) {
            try {
              const response = await NoteService.delete(note.id);
              setNotes((prevNotes) =>
              prevNotes.reduce(
                (acc, cv) =>
                  cv.x === note.x && cv.y === note.y ? acc : acc.push(cv) && acc,
                []
              )
            );
            } catch (error) {
                if(error.response?.status){
                    console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
                } else {
                    console.log(error);
                    alert("Unable to delete this note at this time.");
                }
            }
          }
        };

        async function handleSave () {
          try {
            var userId = await getChromeItem("user_id");
            const data = {
              access_type: 0,
              collection_id: note.collection_id,
              content: note.content,
              is_visible: false,
              location_type: 0,
              title: note.title,
              url: note.url,
              user_id: userId,
              x: note.x,
              y: note.y
            };
            const response = await NoteService.update(note.id, data);
            setNotes((prevNotes) =>
              prevNotes.reduce(
                (acc, cv) =>
                  cv.x === note.x && cv.y === note.y && cv.id === note.id
                    ? acc.push({ ...cv, is_visible: false }) && acc
                    : acc.push(cv) && acc,
                []
              )
            );
            setOpenSave(true);
          } catch (error) {
              if(error.response?.status){
                  console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
              } else {
                  console.log(error);
                  alert("Unable to save this note at this time.");
              }
          }
        };

        function handleClick () {
          setNotes((prevNotes) =>
                prevNotes.reduce(
                  (acc, cv) =>
                    cv.id === note.id
                      ? acc.push({ ...cv, is_visible: true }) && acc
                      : acc.push(cv) && acc,
                  []
                )
          );
      };

        return (
          <div className="note" key={note.id}>
            <ShadowRoot>
              <Container x={note.x} y={note.y} visible={note.is_visible} className="react-sticky-note">
                <TitleArea
                  onChange={handleTitleChange}
                  value={note.title ? note.title : ""}
                  placeholder="Note Title Goes Here"
                />
                <StyledTextArea
                  onChange={handleTextChange}
                  value={note.content ? note.content : ""}
                  key={note.id}
                  placeholder="Note Text Goes Here"
                />
                <Footer>
                  <DeleteIcon onClick={handleDelete}/> <SaveIcon onClick={handleSave}/> <FolderIcon />
                </Footer>
              </Container>
            </ShadowRoot>
            <ShadowRoot>
              <div style={{ left: `${note.x}px`, top: `${note.y}px`, position: "absolute", zIndex: "99" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 184.83 214.83" className="noteworthySvg" x={note.x} y={note.y} style={{ width: "20px", height: "20px", transition: "all 0.2s ease-in-out", zIndex: "100", left: `${note.x}px`, top: `${note.y}px` }} onClick={handleClick}>
                  <defs>
                    <style>
                      {`
                        .cls-1{fill:#F3E779;}
                        .noteworthySvg{opacity:0.4;scale:1;cursor:default;}
                        .noteworthySvg:hover{opacity:1;scale:1.5;cursor:pointer;}
                        .cls-2{fill:none;stroke:#231f20;stroke-miterlimit:10;stroke-width:16px;}
                      `}
                    </style>
                  </defs>
                  <g id="Layer_2" data-name="Layer 2">
                    <rect className="cls-1" y="30" width="184.83" height="184.83">
                    </rect>
                    <polygon className="cls-1" points="92.42 0 49.12 45.67 135.72 45.67 92.42 0">
                    </polygon>
                  </g>
                  <g id="Layer_1" data-name="Layer 1">
                    <path className="cls-2" d="M120.08,135.33h51.2a11.14,11.14,0,0,1,11.1,11.1v51.2a11.14,11.14,0,0,1-11.1,11.1h-51.2a11.14,11.14,0,0,1-11.1-11.1v-51.2A11.14,11.14,0,0,1,120.08,135.33Z" transform="translate(-35 -31.33)">
                    </path>
                    <path className="cls-2" d="M82.78,98.33H134a11.14,11.14,0,0,1,11.1,11.1v51.2a11.14,11.14,0,0,1-11.1,11.1H82.78a11.23,11.23,0,0,1-11.1-11.2v-51.1A11.14,11.14,0,0,1,82.78,98.33Z" transform="translate(-35 -31.33)">
                    </path>
                  </g>
                </svg>
              </div>
            </ShadowRoot>
            <Snackbar open={openSave} autoHideDuration={6000} onClose={() => setOpenSave(false)}>
                <Alert severity="success" sx={{ width: '100%' }}>
                    Note Saved
                </Alert>
            </Snackbar>
          </div>
        );
      })}
    </div>
  );
};

export default Note;