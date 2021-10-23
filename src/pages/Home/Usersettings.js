import "../../files/css/Usersettings.css"
import {axios, baseUrl} from "../../api"
import { useEffect } from "react";
import { useState } from "react";
import { AiFillWarning } from "react-icons/ai";
import { store } from 'react-notifications-component';

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
        axios.get(baseUrl + "/tokens").then(res => {
            SetisPending(false)
            setApiKeys(res.data)
        }).catch(e => {
            SetIsError(true)
            SetisPending(false)
            var content = e.message
            if (e.response && e.response.data.message) {
                content = <p>{e.response.data.message}</p>
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

    //handle button click to edit token
    const [isEditing, SetisEditing] = useState(false)
    const [EditingName, SetEditingName] = useState("")
    const [EditingCORS, SetEditingCORS] = useState(null)
    const [isEditingPending, SetIsEditingPending] = useState(null)
    function HandleEditClick(keyid) {
        SetisEditing(keyid)
        SetEditingName(apiKeys.find(x => x.id === keyid).name)
        SetEditingCORS(apiKeys.find(x => x.id === keyid).cors)
    }

    function HandleEditCloseClick(keyid) {
        SetisEditing(false)
        SetEditingName(null)
        SetEditingCORS(null)
    }

    function HandleEditSubmit(e) {
        e.preventDefault(); //prevents button to reload page

        var put_body = {name: EditingName}
        if (apiKeys.find(x => x.id === isEditing).cors_allowed) {
            if (EditingCORS === "") put_body.cors = null;
            else put_body.cors = EditingCORS
        }

        SetIsNewKeyPendig(true)
        SetIsNewKeyPendig(false)
        axios.put(baseUrl + `/tokens/${isEditing}`, put_body).then(res => {
            SetIsEditingPending(false)
            SetisEditing(false)
            SetEditingCORS(false)
            SetEditingName("")

            axios.get(baseUrl + "/tokens").then(res => {
                setApiKeys(res.data)
                SetisClickPending(false)
                })

        }).catch(e => {
            SetIsEditingPending(false)
            var content = e.message
            if (e.response && e.response.data.message) {
                content = <p>{e.response.data.message}</p>
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
    }

    //handle button click to remove token
    const [isClickPending, SetisClickPending] = useState(false)
    function HandleRemoveClick(keyid) {
        SetisClickPending(true)
        axios.delete(baseUrl + `/tokens/${keyid}`).then(res => {

            axios.get(baseUrl + "/tokens").then(res => {
            setApiKeys(res.data)
            SetisClickPending(false)
            })
            


        }).catch(e => {
            SetisClickPending(false)
            var content = e.message
            if (e.response && e.response.data.message) {
                content = <p>{e.response.data.message}</p>
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
    }

    //fetch creation of new token
    const [Name, SetName] = useState(null)
    const [newKey, SetNewKey] = useState(null)
    const [isNewKeyPendig, SetIsNewKeyPendig] = useState(null)
    const [isNewKeyError, SetIsNewKeyError] = useState(null)
    function HandleCreateClick(e) {
        e.preventDefault(); //prevents button to reload page

        SetIsNewKeyPendig(true)
        axios.post(baseUrl + "/tokens", {name: Name}).then(res => {
            SetIsNewKeyError(false)
            SetIsNewKeyPendig(false)
            SetNewKey(res.data)
            SetName(null)
        }).catch(e => {
            SetIsNewKeyError(false)
            var content = e.message
            if (e.response && e.response.data.message) {
                content = <p>{e.response.data.message}</p>
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
            SetIsNewKeyPendig(false)
        })
    }

    function HandleCloseKeyClick(e) {
        e.preventDefault(); //prevents button to reload page

        SetNewKey(null)
        axios.get(baseUrl + "/tokens").then(res => {
            setApiKeys(res.data)
        }).catch(e => {
            SetIsError(e.message)
        })
    }
    
    return (
        <div className="ApiTokensPanel box">
            <h1>API Tokens</h1>
            <p><a href="https://github.com/Eat-Sleep-Nintendo-Repeat/API/wiki/API-Documentation">Hier</a> findest du die Dokumentation der Eat, Sleep, Nintendo, Repeat API.</p>

            {isPending && <p>Lade deine API Tokens...</p>}
            {isError && <p>Error {isError}</p>}
            {apiKeys && isEditing === false && apiKeys.length === 0 ? <p>Du hast keine API Keys erstellt</p> : <h3>Deine API Keys:</h3>}
            {apiKeys && isEditing === false && <ul>
                {apiKeys.map(x => (
                    <li key={x.id}>
                        <details>
                            <summary>{x.name}</summary>
                            <p>Erstellt am {new window.Date(x.creation_date).toLocaleDateString("de-DE")}</p>
                            <p>Key ID: {x.id}</p>
                            <p>CORS Berechtigung: {x.cors_allowed ? "✅" : "❌"}</p>
                            {x.cors_allowed && <p>CORS Header: {x.cors === null ? "kein CORS Header gesetzt" : x.cors}</p>}

                            <button className="keyremovebutton" disabled={isClickPending} onClick={() => {HandleRemoveClick(x.id)}}>Key löschen</button>
                            <button className="keyeditbutton" disabled={isClickPending} onClick={() => {HandleEditClick(x.id)}}>Key bearbeiten</button>
                        </details>
                    </li>
                ))}
                </ul>}
        
            {/* Edit Key */}
            {isEditing && <div className="editkeyform">
                    <form>
                        <hr />
                        <h3>Key {isEditing} bearbeiten</h3>
                        <label>neuer Key Name:</label>
                        <input type="text" maxLength="20" value={EditingName} onChange={(e) => SetEditingName(e.target.value)} required disabled={isEditingPending} />
                        {apiKeys.find(x => x.id === isEditing).cors_allowed && <label>neuer CORS Header:</label>}
                        {apiKeys.find(x => x.id === isEditing).cors_allowed && <input type="text" value={EditingCORS} onChange={(e) => SetEditingCORS(e.target.value)} required disabled={isEditingPending} />}
                        <button disabled={isEditingPending} onClick={(e) => HandleEditSubmit(e)}>API Key bearbeiten</button>
                        <button className="abortedit" disabled={isEditingPending} onClick={(e) => HandleEditCloseClick(e)}>bearbeiten abbrechen</button>
                    </form>
                </div>}

            {/* new key form */}
            {apiKeys && apiKeys.length < 3 && newKey === null && <div className="newkeyform">
                    <form>
                        <hr />
                        <h3>Einen neuen Key generieren</h3>
                        <label>Key Name:</label>
                        <input type="text" maxLength="20" onChange={(e) => SetName(e.target.value)} required disabled={isNewKeyPendig} />
                        <button disabled={isNewKeyPendig} onClick={(e) => HandleCreateClick(e)}>API Key erstellen</button>
                    </form>
                </div>}
            
            {/* new key form response */}
            {newKey && <div className="newkey">
                <hr />
                <div className="warnbox box">
                    <h3>Warnung <AiFillWarning /></h3>
                    <p>Dieser API Key wird nur ein einziges mal angezeigt. Nachdem du diese Seite verlässt kannst du ihn nicht erneut anschauen. Außerdem wichtig: Zeige deinen API Key niemals jemand anderen. Er ist geheim und mit ihm kann man viel Schaden auf deine Kosten ausrichten.</p>
                </div>

                <h4>Key:</h4>
                <div className="token"><samp>{newKey.api_key}</samp></div>

                <button className="closenewkey" onClick={(e) => {HandleCloseKeyClick(e)}}>Schließen</button>

                
            </div>}
        </div>
    )

}
 
export default Usersettings;