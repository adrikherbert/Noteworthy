
import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from 'react';

import {ReactComponent as Up} from "../images/ExpandLess.svg";
import {ReactComponent as Down} from "../images/ExpandMore.svg";
import {ReactComponent as AddColButton} from "../images/AddFolder.svg";

import './collections.css';
import CollectionService from '../services/collection.service';
import AddCollection from './AddCollection.js';

const Collection = ({curr_data, changeId}) => {
    const [sub_collections, setCollections] = useState([]);
    const [numCol, setNumCol] = useState(null);
    
    const [expanded, setExpanded] = useState(false);
    const [addCol, showAddCol] = useState(false);

    useEffect(() => {
        getCollections();
    }, [])

    async function getCollections() {
        // console.log(curr_data);
        const constraints = "" + curr_data.user_id + "," + curr_data.id;
        const info = {"resource": "user_id,parent_id", "constraint": constraints}
        try {
            const response = await CollectionService.getAll(info);

            let list = [];
            response.data.results.forEach(function(col) {
                const data = {
                    id: col.id,
                    parent_id: col.parent_id,
                    user_id: col.user_id,
                    title: col.title
                }
                list.push(data);
            });
            setNumCol(list.length);
            setCollections(list);

        } catch(error){
            if(error.response?.status){
                console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
            } else {
                console.log(error);
            }
        }  
    }

    async function addColTitle(event){
        event.preventDefault();
        showAddCol(true);
    }

    async function addCollection(title){
        const data = {"access_type": 0, "notes": [], "parent_id": curr_data.id, "title": title, "user_id": curr_data.user_id}
        try {
            const response = await CollectionService.create(data);
            // console.log(response);
            setNumCol(numCol+1);

        } catch(error){
            if(error.response?.status){
                console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
            } else {
                console.log(error);
            }
        }
    }

    async function handleCollectionClick(){
        // localStorage.setItem("curr_collection_id", curr_data.id)
        changeId(curr_data.id, curr_data.title);
        // alert(curr_data.id);
    }

    async function handleDropDownToggle(){
        setExpanded(!expanded);
    }

    return(
        <div className="collection_container">
            <div className="collection_title_bar">
                {expanded ? 
                    <Up className="collection_expand_button" onClick={handleDropDownToggle}/> :
                    <Down className="collection_expand_button" onClick={handleDropDownToggle}/>
                }
                <p onClick={handleCollectionClick} className="collection_title">{curr_data.title}</p>
                <AddColButton className="collection_add_button" onClick={addColTitle}/>
            </div>
            {expanded && <div className="collection_sub">
                <ul>
                    {sub_collections.map((data) => 
                        <Collection key={data.id} curr_data={data} changeId={changeId}/>
                    )}
                </ul>
            </div>}
            {addCol && <AddCollection closeModal={showAddCol} onConfirm={addCollection}/>}
        </div>
    );
}

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update state to force render
}

export default Collection