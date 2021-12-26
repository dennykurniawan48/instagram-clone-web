import axios from "axios";
import faker from "faker"
import { useEffect } from "react";
import { useState } from "react";
import Story from "./Story";

function Stories() {

    const [suggest, setSuggest] = useState([])

    useEffect(async () => {
        try {
            const response = await axios.get('https://randomuser.me/api?results=20');
            setSuggest(response.data.results)
          } catch (error) {
            console.error(error);
          }
    }, [])

    return (
        <div className="flex space-x-2 p-6 bg-white mt-8 border-gray-200 border rounded-sm overflow-x-scroll scrollbar-thin scrollbar-thumb-slate-400">
       { suggest.map(profile => (
           <Story key={profile.cell} profile={profile.picture.large} username={profile.name.first}/>
       )) }
        </div>
    )
}

export default Stories
