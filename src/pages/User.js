import { useEffect, useState } from "react";
import {axios, baseUrl} from "../api"
import { useParams, Link } from "react-router-dom";
import "../files/css/User.css"

import Boostericon from "../files/images/nitro.png"
import GemIcon from "../files/images/Eat, Sleep, Gem.svg"
import DefaultUserIcon from "../files/images/default-pb.jpg"

const User = () => {

    const {id} = useParams();
    const [UserData, SetUserData] = useState(null)
    const [isPending, SetisPending] = useState(true)
    const [isError, SetIsError] = useState(false)


    useEffect(() => {
        //fetch Userdata
        axios.get(`${baseUrl}/users/${id}`).then(res => {
            if (res.status > 399) throw Error("bad response code")
            SetisPending(false)
            return SetUserData(res.data)
        })
        .catch(e => {
            SetisPending(false)
            if (e.response.status === 404) return SetIsError("Der User konnte nicht gefunden werden")
            SetIsError(e.message)
        })
    }, [id])

    return ( 
        <div>
            {isPending && <div className="UserPageLoading"><div className="load-wraper"><div className="activity"></div></div></div>}

            {UserData && isPending == false &&
            <div className="UserPage">
            <Removalnotice data={UserData}/>
            <UserMainCard data={UserData}/>
            <UserRankCard data={UserData}/>
            <UserGemCard data={UserData}/>
            <UserWarnsCard data={UserData}/>
            </div>
            }
        </div>
     );
}

const UserMainCard = ({data}) => {

    function UserImageDidtLoad(img) {
        img.target.src = DefaultUserIcon
    }

    return ( 
        <div className="UserMainCard box">
            <div className="pb">
                <img onError={UserImageDidtLoad} src={`https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=2048`} alt={`profile by ${data.username}#${data.discriminator}`} />
            </div>
            <div className="name">
                <h1>{data.username}#{data.discriminator}</h1>
                <p>{data.typeword}</p>
                {data.serverbooster && <img src={Boostericon} alt="boostericon" />}
            </div>
            </div>
     );
}

const UserRankCard = ({data}) => {

    return ( 
        <div className="UserRankCard box">
            
            {data.private_page == false && <div className="rank">
                <h1>Rank: </h1>
                <h1>{data.currencys.ranks.rank}</h1>
            </div>}

            {data.private_page == false && <div className="xp">
                <h1>XP</h1>
                <div className="xpprogress">
                <div className="bar" style={{width: (data.currencys.ranks.xp / (data.currencys.ranks.rank * 5) * 100) + "%"}}></div>
            </div>
                <h2>{data.currencys.ranks.xp} / {data.currencys.ranks.rank * 5}</h2>
            </div>}

            {data.private_page && <div className="privatepage">
                <h1>Rank: </h1>
                <h3>{data.username} hat das Level verborgen</h3>
            </div>}
                

        </div>
     );
}

const UserGemCard = ({data}) => {

    return ( 
        <div className="UserGemCard box">
                <h1>Gems:</h1>
                {data.private_page == false && <div className="flex">
                    <h2>{data.currencys.gems.amount}</h2>
                    <img src={GemIcon} alt="gems" />
                </div> }

                {data.private_page == false && data.currencys.gems.log.length > 0 && <hr />}

                {data.private_page == false && data.currencys.gems.log.length > 0 && <h3>Buchungen:</h3>}
                <ul className="purchases">
                    {data.private_page == false && data.currencys.gems.log.map((x, index) => (
                        <li className="purchase" key={index}>
                            <div className="value">
                                <h4 className={x.value < 0 ? "negative" : undefined}>{x.value}</h4>
                                <img src={GemIcon} alt="gems" />
                            </div>
                            <h4>{x.description}</h4>
                            <h4>{new window.Date(x.date).toLocaleDateString("de-DE")}</h4>

                        </li>
                    ))}
                </ul>

                {data.private_page && <div className="privatepage">
                <h3>{data.username} hat die Gems und Ausgaben verborgen</h3>
            </div>}
        </div>
     );

}

const UserWarnsCard = ({data}) => {

    const [WarnsData, SetWarnsData] = useState(null)
    const [isWarnsPending, SetisWarnsPending] = useState(true)
    const [isWarnsError, SetIsWarnsError] = useState(false)


    useEffect(() => {
        //fetch Warnsdata
        axios.get(`${baseUrl}/warns?id=${data.id}`).then(res => {
            if (res.status > 399) throw Error("bad response code")
            SetisWarnsPending(false)
            return SetWarnsData(res.data)
        })
        .catch(e => {
            SetisWarnsPending(false)
            SetIsWarnsError(e.message)
        })
    }, [data])


    return (
        <div className="UserWarnsCard box">
            <h1>Verwarnungen ({WarnsData && WarnsData.length})</h1>
            {isWarnsPending && <h3>Suche Verwarnungen...</h3>}
            {isWarnsError && <div><h1>Ein Fehler ist aufgetreten</h1> <p>{isWarnsError}</p></div>}
            {WarnsData && WarnsData.length > 0 && WarnsData.map((x, index) => (
                <ul className="warns">
                    <WarnListItem  warndata={x} index={index}/>
                </ul>
            ))}

            {WarnsData && WarnsData.length === 0 && <div className="nowarns">
            <p>{data.username} hat eine weiße Weste</p>
            <img src="https://cdn.discordapp.com/emojis/798189004984942642.png?v=1" alt="Ring Fit Emoji" />    
            </div>}
        </div>
    )
}

const WarnListItem = ({warndata, index}) => {

    const [ExecuterData, SetExecuterData] = useState(null)
    const [ExecuterError, SetExecuterError] = useState(false)
    const [ExecuterPending, SetExecuterPending] = useState(true)

    useEffect(() => {
        axios.get(`${baseUrl}/users/${warndata.executor}`).then(res => {
            SetExecuterData(res.data)
            SetExecuterPending(false)
            }).catch((e => {
                SetExecuterPending(false)
                SetExecuterError(true)
            }))
    }, [])


    return (
        <li className="warn" key={index}>
            <div className="head">
                <div className="executor">
                    <h3>#{warndata["_id"]}</h3>
                    
                </div>

                <p>Erhalten am: {new window.Date(warndata.date).toLocaleDateString("de-DE")}</p>
            </div>

            <div className="executor">
                <p className="thicc">Erhalten von:</p>
                {ExecuterPending && <p> loading...</p>}
                    {ExecuterError && <p>???</p>}
                    {ExecuterData && <Link to={`/user/${ExecuterData.id}`}>{ExecuterData.username}#{ExecuterData.discriminator}</Link>}
                </div>

            <div className="executor notaccturallyexecutorlol">
            <p className="thicc">Begründung:</p>
                <p>{warndata.reason}</p>
            </div>

        </li>
    );
}

const Removalnotice = ({data}) => {
    return (
        <div className="Removalnotice">
            {data.delete_in && <p>Dieser Nutzer wird am {new window.Date(data.delete_in).toLocaleDateString("de-DE")} aus der Datenbank gelöscht!</p> }
            </div>
    )
}
export default User;