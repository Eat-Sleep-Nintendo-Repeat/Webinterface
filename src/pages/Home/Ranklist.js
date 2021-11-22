import {axios, baseUrl} from "../../api"
import { useEffect, useState } from "react";
import { store } from 'react-notifications-component';
import "../../files/css/Ranklist.css"
import { Link } from "react-router-dom";

import DefaultUserIcon from "../../files/images/default-pb.jpg"
import Boostericon from "../../files/images/nitro.png"


const Ranklist = () => {
    var [PendingRanklistData, SetPendigRanklistData] = useState(true)
    var [RanklistData, SetRanklistData] = useState(null)

    useEffect(() => {
        axios.get(baseUrl + "/users/toplist?max=999").then(res => {
            SetPendigRanklistData(false)
            SetRanklistData(res.data)
            console.log(res.data)
        }).catch(e => {
            SetPendigRanklistData(false)
            var content = e.message
            if (e.response && e.response.data.error) {
                content = e.response.data.error
            }
            store.addNotification({
                title: "API Error",
                message: content,
                type: "danger",
                container: "top-right",
                dismiss: {
                    duration: 5000,
                    onScreen: true
                  }
            })
        })
    }, [])


    return (
    <div className="Ranklist box">
        {RanklistData && PendingRanklistData == false &&
        <div className="top3">
            {RanklistData.slice(0, 3).map((userdata, index) => (
                    <div className={"topbox place" + (index + 1)}>
                        <Link to={`/user/${userdata.id}`}>
                            <div className="rankimg">
                                <h1>#{index + 1}</h1>
                                <img onError={(img) => {img.target.src = DefaultUserIcon}} loading="lazy" src={`https://cdn.discordapp.com/avatars/${userdata.id}/${userdata.avatar}.png`} alt={`Avatar of ${userdata.username}`} />
                            </div>
                            <div className="nametag">
                                <h3>{`${userdata.username}#${userdata.discriminator}`}</h3>
                                <p>{userdata.typeword}</p>
                                {userdata.serverbooster && <img src={Boostericon}/>}
                            </div>
                            <h2>Rank: {userdata.rank}</h2>
                        </Link>
                    </div>
            ))}
        </div>}

        {RanklistData && PendingRanklistData == false &&
        <ul>
            {RanklistData.slice(3, RanklistData.length).map((userdata, index) => (
                <div className="rankcard">
                    <h1>#{(index + 4)}</h1>
                    <div className="userdata">
                        <img onError={(img) => {img.target.src = DefaultUserIcon}} loading="lazy" src={`https://cdn.discordapp.com/avatars/${userdata.id}/${userdata.avatar}.png`} alt={`Avatar of ${userdata.username}`} />
                        <div className="nametag">
                            <h3>{`${userdata.username}#${userdata.discriminator}`}</h3>
                            <p>{userdata.typeword}</p>
                            {userdata.serverbooster && <img src={Boostericon}/>}
                        </div>
                    </div>
                    <h2>Rank: {userdata.rank}</h2>
                </div>
            ))}
        </ul>}
    </div>)
}

export default Ranklist;