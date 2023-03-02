
import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from 'react';

import './collections.css';
import CollectionService from '../services/collection.service';

const Collection = ({user_id}, {parent_id}, {curr_data}) => {
    const [sub_collections, setCollections] = useState([]);
    
    const [expanded, setExpanded] = useState(false)

    useEffect(() => {
        getCollections(curr_data.id);
    }, [])

    async function getCollections(id) {
        const info = {};
        try {
            const response = await CollectionService.getAll(info);

        } catch(error){
            if(error.response?.status){
                console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
            } else {
                console.log(error);
            }
        }
        
    }

    async function handleCollectionClick(){
        localStorage.setItem("curr_collection_id", curr_data.id)
    }

    return(
        <div className="collection_container">
            <div onClick={handleCollectionClick} className="collection_title">

            </div>
            {expanded && <div className="collection_sub">
                <ul>
                    {sub_collections.map((data) => 
                        <Collection user_id={user_id} parent_id={curr_data.id} curr_data={data}/>
                    )}
                </ul>
            </div>}
        </div>
    );
}

export default Collection