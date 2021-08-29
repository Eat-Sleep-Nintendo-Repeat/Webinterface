import "../files/css/Usersettings.css"
import {axios, baseUrl} from "../api"
import { useEffect } from "react";
import { useState } from "react";
import { AiFillWarning } from "react-icons/ai";

const Usersettings = () => {
    return ( 
        <div className = "Usersettings">
            <h1 className="headtitle">User Settings</h1>
            <APITokensPanel />
        </div>
     );
}

const APITokensPanel = () => {

    //fetch tokens after render
    const [apiKeys, setApiKeys] = useState(null)
    const [isPending, SetisPending] = useState(true)
    const [isError, SetIsError] = useState(false)

    useEffect(() => {
        //fetch tokens
        axios.get(baseUrl + "/auth/keys").then(res => {
            SetisPending(false)
            setApiKeys(res.data)
        }).catch(e => {
            SetIsError(e.message)
            SetisPending(false)
        })
    }, [])

    //handle button click to remove token
    const [isClickPending, SetisClickPending] = useState(false)
    function HandleRemoveClick(keyid) {
        SetisClickPending(true)
        axios.delete(baseUrl + `/auth/keys/${keyid}`).then(res => {

            axios.get(baseUrl + "/auth/keys").then(res => {
            setApiKeys(res.data)
            SetisClickPending(false)
            })
            


        }).catch(e => {
            SetisClickPending(false)
        })
    }

    //fetch creation of new token
    const [Name, SetName] = useState(null)
    const [newKey, SetNewKey] = useState(null)
    const [isNewKeyPendig, SetIsNewKeyPendig] = useState(null)
    const [isNewKeyError, SetIsNewKeyError] = useState(null)
    function HandleCreateClick(e) {
        e.preventDefault(); //prevents button to reload page

        SetIsNewKeyPendig(true)
        axios.post(baseUrl + "/auth/keys", {name: Name}).then(res => {
            SetIsNewKeyError(false)
            SetIsNewKeyPendig(false)
            SetNewKey(res.data)
        }).catch(e => {
            if (e.response && e.response.data.message) {SetIsNewKeyError(e.response.data.message)}
            else {SetIsNewKeyError(e.message)}
            SetIsNewKeyPendig(false)
        })
    }

    function HandleCloseKeyClick(e) {
        e.preventDefault(); //prevents button to reload page

        SetNewKey(null)
        axios.get(baseUrl + "/auth/keys").then(res => {
            setApiKeys(res.data)
        }).catch(e => {
            SetIsError(e.message)
        })
    }

    return (
        <div className="ApiTokensPanel box">
            <h1>API Tokens</h1>
            <p><a href="#">Hier</a> findest du die Dokumentation der Eat, Sleep, Nintendo, Repeat API.</p>

            {isPending && <p>Lade deine API Tokens...</p>}
            {isError && <p>Error {isError}</p>}
            {apiKeys && apiKeys.length === 0 ? <p>Du hast keine API Keys erstellt</p> : <h3>Deine API Keys</h3>}
            {apiKeys && <ul>
                {apiKeys.map(x => (
                    <li key={x.id}>
                        <details>
                            <summary>{x.name}</summary>
                            <p>Erstellt am {new window.Date(x.creation_date).toLocaleDateString("de-DE")}</p>
                            <p>Key ID: {x.id}</p>

                            <button className="keyremovebutton" disabled={isClickPending} onClick={() => {HandleRemoveClick(x.id)}}>Key löschen</button>
                        </details>
                    </li>
                ))}
                </ul>}
        
            {apiKeys && apiKeys.length < 3 && newKey === null && <div className="newkeyform">
                    <form>
                        <hr />
                        <h3>Einen neuen Key generieren</h3>
                        <label>Key Name:</label>
                        <input type="text" maxLength="20" onChange={(e) => SetName(e.target.value)} required disabled={isNewKeyPendig} />
                        <button disabled={isNewKeyPendig} onClick={(e) => HandleCreateClick(e)}>API Key erstellen</button>
                        {isNewKeyError && <p style={{color: "var(--error)"}}>{isNewKeyError}</p>}
                    </form>
                </div>}
            
            {newKey && <div className="newkey">
                <hr />
                <div className="warnbox box">
                    <h3>Warnung <AiFillWarning /></h3>
                    <p>Dieser API Key wird nur ein einziges mal angezeigt. Nachdem du diese Seite verlässt kannst du ihn nicht erneut anschauen. Außerdem wichtig: Zeige deinen API Key niemals jemand anderen. Er ist geheim und mit ihm kann man viel Schaden auf deine Kosten ausrichten.</p>
                </div>

                <h4>Token:</h4>
                <div className="token"><samp>{newKey.api_key}</samp></div>

                <button className="closenewkey" onClick={(e) => {HandleCloseKeyClick(e)}}>Schließen</button>

                
            </div>}
        </div>
    )

}
 
export default Usersettings;