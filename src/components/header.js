import {Link} from "react-router-dom"
import logo from "../files/images/logo.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { useEffect, useState } from "react";
import axios from "../api"
import Boostericon from "../files/images/nitro.png"

const HeaderUserButton = ({handeMenuClick, User}) => {


    return (
        
        <Link onClick={handeMenuClick} to={`/user/${User.id}`}>
        <div className="headerUserButton">
        <img className="pb" src={`https://cdn.discordapp.com/avatars/${User.id}/${User.avatar}.png`} alt={`Account Icon from ${User.username}`} />
        <p>{`${User.username}#${User.discriminator}`}</p>
        {User.serverbooster && <img className="boosticon" src={Boostericon} alt="Server Booster Icon" />}
        </div>
        </Link>
        
        
    );
}

const Header = () => {
    const [menuExpandet, setMenuExpandet] = useState(false)

    function handeMenuClick() {
        setMenuExpandet(!menuExpandet)
    }

    const [User, SetUser] = useState(null)

    useEffect(() => {
        //fetch Userdata
        axios.get("http://localhost:5670/api/v1/users/@me").then(res => {
            SetUser(res.data)
        })
        .catch(e => console.error(e))
    }, [])


    return ( 
        <div className="header">
            <header>
            <div className="logo">
                <img src={logo} alt="Logo" />
                <h4>Eat, Sleep, Nintendo, Repeat</h4>
            </div>
            
            
            <ul className={`nav-links${menuExpandet ? " nav-active" : ""}`}>
                <li><Link onClick={handeMenuClick} to="/">Home</Link></li>
                <li><Link onClick={handeMenuClick} to="/shop">Shop</Link></li>
                <li><Link onClick={handeMenuClick} to="/turnements">Turniere</Link></li>
                {User && <li><HeaderUserButton handeMenuClick={handeMenuClick} User={User}/></li>}
            </ul>
                <GiHamburgerMenu onClick={handeMenuClick} size="30px" className="burger"/>

            </header>
        </div>
     );
}
 
export default Header;
