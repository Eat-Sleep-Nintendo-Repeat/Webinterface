import "../files/css/Footer.scss"
import {Link} from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faDiscord, faTwitch, faTwitter } from '@fortawesome/free-brands-svg-icons'

const FooterCategorie = ({Title, Links}) => {
    return ( <div className="footer_categorie">
        <h3>{Title}</h3>
        <ul>
            {Links.map((x, index) => (
                <li key={index} >{x}</li>
            ))}
        </ul>
    </div> );
}

const Social = ({uri, icon}) => {
    return ( <div className="social">
        <div href={uri} className="circle">
            <a href={uri}>{icon}</a>
        </div>
    </div> );
}

const Footer = () => {
    return ( <div className="footer">
        <FooterCategorie Title="Rechtliches" Links={[<Link to="/imprint">Impressum</Link> ,<Link to="/privacy_policy">Datenschutz</Link>]}/>

        <FooterCategorie Title="Über uns" Links={[<a href="https://discord.gg/qssu8xMqdh">Discord Server</a>, <a href="http://status.eat-sleep-nintendo-repeat.eu/">Status Page</a>, <a href="https://github.com/Eat-Sleep-Nintendo-Repeat">Programm Code</a>, <a href="https://github.com/Eat-Sleep-Nintendo-Repeat/API/blob/main/API%20Documentation.md">API Dokumentation</a>]}/>

        <div className="Socials">
            <div className="s">
                <Social uri="https://discord.gg/qssu8xMqdh" icon={<FontAwesomeIcon icon={faDiscord} size="2x"/>}/>
                <Social uri="https://twitter.com/EatNintendo" icon={<FontAwesomeIcon icon={faTwitter} size="2x"/>}/>
                <Social uri="https://www.twitch.tv/EatSleepNintendoRepeat" icon={<FontAwesomeIcon icon={faTwitch} size="2x"/>}/>
            </div>

            <p>Dustin Meyer © 2022</p>        
        </div>
    </div> );
}
 
export default Footer;