import {axios, baseUrl} from "../../api"
import { useEffect, useState } from "react";
import { Redirect } from "react-router"
import { store } from 'react-notifications-component';
import "../../files/css/Membersearch.css"
import { Link } from "react-router-dom";

import DefaultUserIcon from "../../files/images/default-pb.jpg"
import Boostericon from "../../files/images/nitro.png"


const Members = () => {
    var [searchQueryName, SetSearchQueryName] = useState("")
    var [searchQueryDiscriminator, SetSearchQueryDiscriminator] = useState("")
    var [searchQueryID, SetSearchQueryID] = useState("")
    var [PendingSearchData, SetPendigSearchData] = useState(true)
    var [SearchData, SetSearchData] = useState(null)

    //query new input autoComplete="off" to database
    useEffect(() => {
        //Define Search Query
        var args = [];
        if (searchQueryID != "") args.push({name: "id", value: searchQueryID})
        if (searchQueryName != "") args.push({name: "username", value: searchQueryName})
        if (searchQueryDiscriminator != "") args.push({name: "discriminator", value: searchQueryDiscriminator.replace("#", "")})
        
        SetPendigSearchData(true)

        let cancel = false
        setTimeout(() => {
            if (cancel) return;
            axios.get(baseUrl + `/users${args.map((x, index) => `${index == 0 ? "?" : "&"}${x.name}=${x.value}`).join("")}`).then(res => {
                if (cancel) return;
                SetPendigSearchData(false)
                SetSearchData(res.data)
            }).catch(e => {
                SetPendigSearchData(false)
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
        }, 500)

        return () => cancel = true;
    }, [searchQueryName, searchQueryDiscriminator, searchQueryID])



    //first database fetch
    useEffect(() => {
        axios.get(baseUrl + "/users").then(res => {
            SetPendigSearchData(false)
            SetSearchData(res.data)
        }).catch(e => {
            SetPendigSearchData(false)
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



    return ( <div className="Members">
                <h1 className="Pagetitle">Member Search</h1>
                <div className="searchForm">
                    <form>
                        {searchQueryID === "" && <input autoComplete="off" type="text" id="username" value={searchQueryName} placeholder="Username" onChange={(e) => {SetSearchQueryName(e.target.value)}}/>}
                        {searchQueryID === "" && <input autoComplete="off" type="text" id="discriminator" value={searchQueryDiscriminator} placeholder="Discriminator" onChange={(e) => {SetSearchQueryDiscriminator(e.target.value)}}/>}
                        <input autoComplete="off" type="text" id="id" value={searchQueryID} placeholder="ID" onChange={(e) => {SetSearchQueryID(e.target.value); SetSearchQueryDiscriminator(""); SetSearchQueryName("")}}/>
                    </form>
                <div>

                </div>
            </div>

                    {/* Display results */}
                    {SearchData && SearchData.length > 0 && PendingSearchData == false && <div className="Memberlist">

                    <ul>
                        {SearchData.map(x => (
                        <li key={x.id}> 
                            <Membercard userdata={x} />
                        </li>))}
                    </ul>

                    </div>}
                    {/* no results */}
                    {SearchData && SearchData.length == 0 && PendingSearchData == false && <div className="MemberlistNoMatch">
                    <img src="https://cdn.discordapp.com/emojis/807751379258048553.png" alt="Schtopp Emoji" />
                    <h1>Nichts gefunden</h1>
                    </div>}
                    {/* result pending */}
                    {PendingSearchData && <div className="MemberlistPlaceholder">
                        <ul>
                            <li><MemberPlaceholder /></li>
                            {searchQueryID == "" && <li><MemberPlaceholder /></li>}
                            {searchQueryID == "" && <li><MemberPlaceholder /></li>}
                            {searchQueryID == "" && <li><MemberPlaceholder /></li>}
                            {searchQueryID == "" && <li><MemberPlaceholder /></li>}
                            {searchQueryID == "" && <li><MemberPlaceholder /></li>}
                        </ul> 
                    </div>}
                
            

    </div> )
}

const Membercard = ({userdata}) => {
    return (
        <Link to={`/user/${userdata.id}`} >
        <div className="Membercard box">
            <img className="pb" onError={(img) => {img.target.src = DefaultUserIcon}} loading="lazy" src={`https://cdn.discordapp.com/avatars/${userdata.id}/${userdata.avatar}.png`} alt={`Avatar of ${userdata.username}`} />
            <div className="nametag">
                <h3>{`${userdata.username}#${userdata.discriminator}`}</h3>
                <p>{userdata.typeword}</p>
                {userdata.serverbooster && <img src={Boostericon}/>}
            </div>
        </div>
        </Link>
    )
}

const MemberPlaceholder = () => {
    return (
        <div className="MembercardPlaceholder box">
            <div className="pb load-wraper">
                <div className="activity"></div>
            </div>
            <div className="nametag load-wraper"><div className="activity"/></div>
        </div>
    )
}

export default Members;