import axios from "axios";
import faker from "faker"
import {useState, useEffect } from "react"

function Suggestion() {
    const [suggest, setSuggest] = useState([])
    useEffect(async () => {
        try {
            const response = await axios.get('https://randomuser.me/api?results=5');
            setSuggest(response.data.results)
          } catch (error) {
            console.error(error);
          }
    }, [])

    return (
        <div className="ml-7 mt-7">
            <div className="flex justify-between pb-4">
                <p>People you might know</p>
                <button>Show All</button>
            </div>
            {
                suggest.map(profile => (
                    <div key={profile.cell} className="pt-2 flex justify-between items-center">
                        <img src={profile.picture.large} className="h-12 w-12 rounded-full"/>
                        <div className="flex-1 pl-3">
                            <p className="text-sm font-semibold">{profile.name.first}</p>
                            <p className="text-xs text-gray-400 truncate">{"Welcome to instagram"}</p>
                        </div>
                        <button className="text-blue-400 text-semibold text-md">Follow</button>
                    </div>
                ))
            }
        </div>
    )
}

export default Suggestion
