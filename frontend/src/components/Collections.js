import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from 'react';

import Collection from './Collection'

import './collections.css';

const Collections = ({user_id}, {root_id}) => {
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        getCollections();
    }, [])

    async function getCollections() {
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

    return(
        <div className="collection_list_container">
            <h1 className="collection_list_title">My Collections</h1>
            <div className="collection_list">
                <ul>
                    {collections.map((data) => 
                        <Collection data={data}/>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default Collections