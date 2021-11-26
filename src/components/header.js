import {Link} from "react-router-dom"
import smalllogo from "../files/images/smalllogo.svg";
import fulllogo from "../files/images/fulllogo.svg";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaDiscord } from "react-icons/fa";
import { useEffect, useState } from "react";
import {axios, baseUrl} from "../api"
import '../files/css/Header.scss';

const HeaderUserButton = ({handeMenuClick, User}) => {
    return (
        
        <Link onClick={handeMenuClick} to={`/user/${User.id}`}>
        <div className="headerUserButton">
        <img className="pb" src={`https://cdn.discordapp.com/avatars/${User.id}/${User.avatar}.png`} alt={`Account Icon from ${User.username}`} />
        <p>{`${User.username}#${User.discriminator}`}</p>
        </div>
        </Link>
        
        
    );
}

const HeaderLoginButton = () => {
    return ( <div className="headerLoginButton">
        <a href={`${baseUrl}/auth/discord`}><FaDiscord size="15px" className="discordicon"/> Login</a>
    </div> );
}

const Uptimechecker = () => {
    const [UptimeData, SetUptimeData] = useState(null);

    //fetch uptime data
    useEffect(() => {
        axios.get(baseUrl + "/uptime").then(res => {
            SetUptimeData(res.data)
        }).catch(e => {})
    }, [])

    return ( <div className="UptimeBanner">
        {UptimeData && UptimeData.offline.length > 0 && 
            <p>Einige unsere Systeme sind aktuell nicht erreichbar! Betroffen sind: {UptimeData.offline.map(x => x.name).join(", ")}. <a href="https://stats.uptimerobot.com/NE4p1U0Bxw">Hier clicken für mehr infos</a></p>
        }
    </div>)
}

const Header = () => {
    const [menuExpandet, setMenuExpandet] = useState(false)

    function handeMenuClick() {
        setMenuExpandet(!menuExpandet)
    }

    const [User, SetUser] = useState(null)

    useEffect(() => {
        //fetch Userdata
        axios.get(`${baseUrl}/users/@me`).then(res => {
            SetUser(res.data)
        })
        .catch(e => console.error(e))
    }, [])


    return ( 
        <div className="header">
            <Uptimechecker />
            <header>
            <div className="logo">
                <img src={smalllogo} alt="Logo" className="small" />
                <img src={fulllogo} alt="Logo" className="full" />
            </div>
            
            
            <ul className={`nav-links${menuExpandet ? " nav-active" : ""}`}>
                <li><Link onClick={handeMenuClick} to="/home/members">Home</Link></li>
                <li><Link onClick={handeMenuClick} to="/shop">Shop</Link></li>
                <li><Link onClick={handeMenuClick} to="/turnements">Turniere</Link></li>
                {User && <li><HeaderUserButton handeMenuClick={handeMenuClick} User={User}/></li>}
                {!User && <li><HeaderLoginButton /></li>}
            </ul>
                <GiHamburgerMenu onClick={handeMenuClick} size="30px" className="burger"/>

            </header>
        </div>
     );
}
 
export default Header;
