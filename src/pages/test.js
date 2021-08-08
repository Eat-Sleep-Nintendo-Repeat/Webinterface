import { useEffect, useState } from "react";
import axios from "../api"

const Test = () => {
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        //fetch data from api
        axios.get("http://localhost:5670/api/v1/users/@me").then(res => {
            setData(res.data)
            setIsLoading(false)
            setIsError(false)
        }).catch(e => {
            console.log(e)
            setIsLoading(false)
            setIsError(true)
        })
    }, [])

    return ( 
        <div className="div">
        {isLoading && <h1>Fetch API</h1>}
        {isError && <h1>An Error Accoured</h1>}
        {data && <div>
            <h1>name: {data.username}#{data.discriminator}</h1>
            <img src={`https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`} alt="" />
            </div>}
        </div>
     );
}
 
export default Test;