import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from 'react';

import Collection from './Collection'
import CollectionService from '../services/collection.service';

import './collections.css';

const Collections = ({user_id, root_id, updateId}) => {
    const [collections, setCollections] = useState([]);
    const [collection_id, setColID] = useState(null);

    useEffect(() => {
        getCollections();
    }, [])

    async function getCollections() {
        const constraints = "" + user_id + "," + root_id;
        const info = {"resource": "user_id,id", "constraint": constraints}
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
            setCollections(list);

        } catch(error){
            if(error.response?.status){
                console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
            } else {
                console.log(error);
            }
        }
    }

    return(
        <div className="collection_list_container">
            <h1 className="collection_list_title">My Collections</h1>
            <div className="collection_list">
                <ul>
                    {collections.map((data) => 
                        <Collection key={data.id} curr_data={data} changeId={updateId}/>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default Collections