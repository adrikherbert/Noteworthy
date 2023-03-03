import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from 'uuid';
import { Delete } from '@styled-icons/material/Delete';
import { Folder } from '@styled-icons/boxicons-solid/Folder';
import { Save } from '@styled-icons/fluentui-system-filled/Save';
import { Alert, Snackbar } from '@mui/material';
import { ShadowRoot } from "./ShadowRoot";
import NoteService from '../services/note.service.js';
import './note.css';
import { getChromeItem } from "./contentScript";

const Container = styled.div`
  z-index: 2;
  position: absolute;
  background: #F3E779;
  display: grid;
  transition: all 0.3s ease-in-out;
  grid-template-areas:
    "title"
    "text"
    "footer";
  scale: ${(props) => props.visible ? 1 : 0};
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

const HtmlNote = () => {
  const [x, setX] = useState<Number>();
  const [y, setY] = useState<Number>();
  const [openSave, setOpenSave] = useState(false);
  const [notes, setNotes] = useState([]);
  const url = window.location.href;

  const getCoords = (event) => {
    if (event.button == 2) {
      chrome.runtime.onMessage.removeListener(newHtmlNote);
      setX(event.clientX);
      setY(event.clientY + window.pageYOffset);
    }
  };
  
  function attachShadow (range, noteId) {
    var boundRect = range.getClientRects();
    for (let i = 0; i < boundRect.length; i++) {
        var outsideSpan = document.createElement("span");
        outsideSpan.setAttribute("class", "outsideSpan");
        outsideSpan.setAttribute("id", `outerSpan ${noteId}`);
        var shadowSpan = document.createElement("span");
        shadowSpan.style.position = "absolute";
        shadowSpan.style.display = "block";
        shadowSpan.style.cursor = "text";
        shadowSpan.style.width = `${boundRect[i].width}px`;
        shadowSpan.style.height = `${boundRect[i].height}px`;
        shadowSpan.style.opacity = "0.4";
        shadowSpan.style.backgroundColor = "#F3E779";
        outsideSpan.attachShadow({mode: "open"});
        outsideSpan.shadowRoot.appendChild(shadowSpan);
        range.insertNode(outsideSpan);
    }
    var svgTag = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgTag.setAttribute("class", "noteworthySvg");
    svgTag.setAttribute("viewBox", "0 0 184.83 214.83"); 
    svgTag.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    function handleClick () {
        setNotes((prevNotes) =>
              prevNotes.reduce(
                (acc, cv) =>
                  cv.id === noteId
                    ? acc.push({ ...cv, is_visible: true }) && acc
                    : acc.push(cv) && acc,
                []
              )
        );
    };
    svgTag.style.marginTop = `${boundRect[0].height}px`;
    svgTag.style.width = "20px";
    svgTag.style.height = "20px";
    svgTag.style.transition = "all 0.2s ease-in-out";
    var svgSpan = document.createElement('span');
    svgSpan.setAttribute("id", noteId);
    svgSpan.addEventListener("mousedown", handleClick);
    var defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
    var svgStyle = document.createElement('style');
    svgStyle.textContent = `
    .cls-1{fill:#F3E779;}
    .noteworthySvg{opacity:0.4;scale:1;cursor:default;}
    .noteworthySvg:hover{opacity:1;scale:1.5;cursor:pointer;}
    .cls-2{fill:none;stroke:#231f20;stroke-miterlimit:10;stroke-width:16px;}
    `
    defs.appendChild(svgStyle);
    var layer2 = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    layer2.setAttribute("id", "Layer_2");
    layer2.setAttribute("data-name", "Layer 2");
    var l2Rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    l2Rect.setAttribute("class", "cls-1");
    l2Rect.setAttribute("y", "30");
    l2Rect.setAttribute("width", "184.83");
    l2Rect.setAttribute("height", "184.83");
    var l2Polygon = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
    l2Polygon.setAttribute("class", "cls-1");
    l2Polygon.setAttribute("points", "92.42 0 49.12 45.67 135.72 45.67 92.42 0");
    var layer1 = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    layer1.setAttribute("id", "Layer_1");
    layer1.setAttribute("data-name", "Layer 1");
    var pathOne = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    pathOne.setAttribute("class", "cls-2");
    pathOne.setAttribute("d", "M120.08,135.33h51.2a11.14,11.14,0,0,1,11.1,11.1v51.2a11.14,11.14,0,0,1-11.1,11.1h-51.2a11.14,11.14,0,0,1-11.1-11.1v-51.2A11.14,11.14,0,0,1,120.08,135.33Z");
    pathOne.setAttribute("transform", "translate(-35 -31.33)");
    var pathTwo = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    pathTwo.setAttribute("class", "cls-2");
    pathTwo.setAttribute("d", "M82.78,98.33H134a11.14,11.14,0,0,1,11.1,11.1v51.2a11.14,11.14,0,0,1-11.1,11.1H82.78a11.23,11.23,0,0,1-11.1-11.2v-51.1A11.14,11.14,0,0,1,82.78,98.33Z");
    pathTwo.setAttribute("transform", "translate(-35 -31.33)");
    layer1.appendChild(pathOne);
    layer1.appendChild(pathTwo);
    layer2.appendChild(l2Rect);
    layer2.appendChild(l2Polygon);
    svgTag.appendChild(defs);
    svgTag.appendChild(layer2);
    svgTag.appendChild(layer1);
    svgSpan.appendChild(svgTag);
    outsideSpan.shadowRoot.appendChild(svgSpan);
  }

  function rebuildRange(startOffset, endOffset, nodeData, nodeHTML, nodeTagName){
    let cDoc = document.getElementById('content-frame')?.ownerDocument;
    console.log(cDoc);
    var tagList : any = cDoc?.getElementsByTagName(nodeTagName);
    
    const foundEle = tagList?.find(x => x.innerHTML === nodeHTML);
    var nodeList = foundEle?.childNodes;
    const foundNode = nodeList?.find(x => x.data === nodeData);
    console.log(foundNode);

    // create the range
    var range = cDoc?.createRange();

    range?.setStart(foundNode, startOffset);
    range?.setEnd(foundNode, endOffset);
    console.log(range);
    return range;
  }

  async function newHtmlNote(message, sender, sendResponse) {
    if (message.info.selectionText != null || message.info.srcUrl != null) {
      var selectionRange = document.getSelection().getRangeAt(0);
      var startNode = selectionRange.startContainer;
      
      var startOffset = selectionRange.startOffset;  // where the range starts
      var endOffset = selectionRange.endOffset;      // where the range ends

      var nodeData = document.getSelection().toString();                       // the actual selected text
      var nodeHTML = startNode.parentElement.innerHTML;    // parent element innerHTML
      var nodeTagName = startNode.parentElement.tagName;   // parent element tag name
      var useRange = rebuildRange(startOffset, endOffset, nodeData, nodeHTML, nodeTagName);
      try {
        var userId = await getChromeItem("user_id");
        console.log(userId);
        const data = {
          access_type: 0,
          collection_id: 47,
          content: "",
          is_visible: true,
          location_type: 1,
          title: "",
          url: url,
          user_id: userId,
          x: x,
          y: y,
          start_offset: startOffset,
          end_offset: endOffset,
          node_data: nodeData,
          node_html: nodeHTML,
          node_tag_name: nodeTagName
        };
        const response = await NoteService.create(data);
        attachShadow(document.getSelection().getRangeAt(0), response.data.id);
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
    chrome.runtime.onMessage.removeListener(newHtmlNote);
    sendResponse();
  }

  async function getNotes() {
    var userId = await getChromeItem("user_id");
    const constraints = "" + userId + "," + url + "," + 1;
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
                start_offset: note.start_offset,
                end_offset: note.end_offset,
                node_data: note.node_data,
                node_html: note.node_html,
                node_tag_name: note.node_tag_name
            }
            list.push(data);
            attachShadow(rebuildRange(note.start_offset, note.end_offset, note.node_data, note.node_html, note.node_tag_name), note.id);
        });
        setNotes(list);
    } catch(error){
        if(error.response?.status){
            console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
        } else {
            console.log(error);
        }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', getCoords);
    getNotes();
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(newHtmlNote);
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
              document.getElementById(`outerSpan ${note.id}`).remove();
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
              location_type: 1,
              title: note.title,
              url: note.url,
              user_id: userId,
              x: note.x,
              y: note.y,
              start_offset: note.start_offset,
              end_offset: note.end_offset,
              node_data: note.node_data,
              node_html: note.node_html,
              node_tag_name: note.node_tag_name
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
        
        return (
          <div className="note" key={note.id}>
            <ShadowRoot>
              <Container x={note.x} y={note.y} visible={note.is_visible} className="react-sticky-note" >
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

export default HtmlNote;