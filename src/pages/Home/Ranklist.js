import {axios, baseUrl} from "../../api"
import { useEffect, useState } from "react";
import { store } from 'react-notifications-component';
import "../../files/css/Ranklist.scss"
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
        {RanklistData && PendingRanklistData === false && 
        <div className="top3">
            {RanklistData.slice(0, 3).map((x, index) => (
                <div className={"topbox place" + (index + 1)}>
                    <h1 className="place">{"#" + (index + 1)}</h1>
                    <div className="userdata">
                        <Link to={`/user/${x.id}`}>
                            <img className="pb" onError={(img) => {img.target.src = DefaultUserIcon}} loading="lazy" src={x.avatar} alt={`Avatar of ${x.username}`} />
                            <div className="nametag">
                                <h3>{`${x.username}#${x.discriminator}`}</h3>
                                <p>{x.typeword}</p>
                                {x.serverbooster && <img src={Boostericon} alt="Serverbooster" />}
                            </div>
                        </Link>
                    </div>
                    <h2 className="ranktitle">Rank: {x.rank}</h2>
                    <h2 className="rank">{x.rank}</h2>
                </div>
            ))}
        </div>}

        {RanklistData && PendingRanklistData === false && 
        <div className="top">
            {RanklistData.slice(3, RanklistData.length).map((x, index) => (
                <div className={"notsotopbox place" + (index + 4)}>
                    <h1 className="place">{"#" + (index + 4)}</h1>
                    <RankUserCard x={x} />
                    <h2 className="ranktitle">Rank: {x.rank}</h2>
                    <h2 className="rank">{x.rank}</h2>
                </div>
            ))}
        </div>}
    </div>)
}

const RankUserCard = ({x}) => {

    //if avatar is null change to Deafult User Icon
    x.avatar = x.avatar ? x.avatar : DefaultUserIcon

    return ( <>
        <div className="userdata">
            <Link to={`/user/${x.id}`}>
                <img className="pb" onError={(img) => {img.target.src = DefaultUserIcon}} loading="lazy" src={x.avatar} alt={`Avatar of ${x.username}`} />
                <div className="nametag">
                    <h3>{`${x.username}#${x.discriminator}`}</h3>
                    <p>{x.typeword}</p>
                    {x.serverbooster && <img src={Boostericon} alt="Serverbooster" />}
                </div>
            </Link>
        </div>
    </> );
}

export default Ranklist;