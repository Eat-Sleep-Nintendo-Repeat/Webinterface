import "../../files/css/Usemyvoice.css"
import { useState, useEffect } from "react";
import {axios, baseUrl} from "../../api"
import { store } from 'react-notifications-component';

const Usemyvoice = () => {
    var [userData, setUserData] = useState(null)
    var [UsemyvoiceData, SetUsemyvoiceData] = useState(null)
    var [PendingUsemyvoiceData, SetPendingUsemyvoiceData] = useState(true)

    //fetch Usemyvoice data after id is fetched
    useEffect(() => {
        if (userData == null) return;
        axios.get(baseUrl + `/usemyvoice/${userData.id}`).then(res => {
            SetPendingUsemyvoiceData(false)
            SetUsemyvoiceData(res.data)
        }).catch(e => {
            SetPendingUsemyvoiceData(false)
            var content = e.message
            if (e.response && e.response.data.message) {
                content = e.response.data.message
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
    }, [userData])

    //fetch userdata
    useEffect(() => {
        axios.get(baseUrl + "/users/@me").then(res => {
            setUserData(res.data)
        }).catch(e => {
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

    var [showForm, setShowForm] = useState(false)
    var [signature, setsignature] = useState("")
    var [accepted, setaccepted] = useState(false)
    var [wantemail, setwantemail] = useState(false)
    var [IspostACPending, SetIspostACPending] = useState(false)

    //handle toform click
    function handleLoadForm() {
        setShowForm(!showForm)
    }

    //handle button click to remove the acceptence
    function handleremoveclick() {
        axios.delete(baseUrl + "/usemyvoice").then(res => {
            setUserData(userData)

            // refetch state
            axios.get(baseUrl + "/users/@me").then(res => {
                setUserData(res.data)
            }).catch(e => {
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
        }).catch(e => {
            SetIspostACPending(false)
            var content = e.message
            if (e.response && e.response.data.message) {
                content = e.response.data.message
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

    //handle post AC click
    function handlepostac() {
        SetIspostACPending(true)

        axios.post(baseUrl + "/usemyvoice", {signature: signature, accept: accepted, email: wantemail}).then(res => {
            SetIspostACPending(false)
            setShowForm(false)
            SetUsemyvoiceData(res.data)
        }).catch(e => {
            SetIspostACPending(false)
            var content = e.message
            if (e.response && e.response.data.message) {
                content = e.response.data.message
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

    return ( 
        <div className="usemyvoice">
            <div className="header">
                <h1>Einverständniserklärung</h1>
                <p>zur Nutzung von Stimmenaufnahmen auf Eat, Sleep, Nintendo, Repeat</p>
            </div>

            {/* Status Pannel */}
            {UsemyvoiceData && showForm == false && <div className={`box status ${UsemyvoiceData.accepted ? "accepted": "denied"}`}>
                <div className="statushead">
                    <div className="circle" />
                    {UsemyvoiceData.state === null && <h1>noch nicht akzeptiert</h1>}
                    {UsemyvoiceData.state === "removed_by_user" && <h1>von dir zurückgezogen</h1>}
                    {UsemyvoiceData.state === "removed_by_admin" && <h1>von uns zurückgezogen</h1>}
                    {UsemyvoiceData.accepted && new window.Date(UsemyvoiceData.date).getFullYear() != new window.Date().getFullYear() && <h1>abgelaufen</h1>}
                    {UsemyvoiceData.state === "accepted" && new window.Date(UsemyvoiceData.date).getFullYear() == new window.Date().getFullYear() && <h1>akzeptiert</h1>}

                </div>

                {/* Explanation Text */}
                {UsemyvoiceData.state === null && <p>Du hast die Einverständniserklärung zur Nutzung von Stimmenaufnahmen noch nicht akzeptiert. Daher kannst du nicht in Sprachkanäle joinen, in denen eine Aufnahme oder ein Stream stattfindet.</p>}
                {UsemyvoiceData.state === "removed_by_user" && <p>Du hast die Einverständniserklärung zur Nutzung von Stimmenaufnahmen zurück gezogen. Daher kannst du nicht mehr in Sprachkanäle joinen, in denen eine Aufnahme oder ein Stream stattfindet.</p>}
                {UsemyvoiceData.state === "removed_by_admin" && <p>Wir haben deine Einverständniserklärung zur Nutzung von Stimmenaufnahmen als ungültig eingestuft. Dies kann daran liegen, das du ungültig unterschirben hast, oder wir aufgrund deines Verhalten, keine Formate mit dir drehen möchten. Daher kannst du nicht in Sprachkanäle joinen, in denen eine Aufnahme oder ein Stream stattfindet. Falls du an dieser Entscheidung etwas auszusetzten hast, dann melde dich bitte bei einem Mitglied des Server Teams</p>}
                {UsemyvoiceData.accepted && new window.Date(UsemyvoiceData.date).getFullYear() != new window.Date().getFullYear() && <p>Deine Einverständniserklärung zur Nutzung von Stimmenaufnahmen ist leider schon abgelaufen. Daher kannst du nicht in Sprachkanäle joinen, in denen eine Aufnahme oder ein Stream stattfindet. Dir steht es jedoch frei sie jederzeit zu erneuern.</p>}
                {UsemyvoiceData.state === "accepted" && new window.Date(UsemyvoiceData.date).getFullYear() == new window.Date().getFullYear() && <p>Du hast die Einverständniserklärung zur Nutzung von Stimmenaufnahmen und Nutzerinformationen am {new window.Date(UsemyvoiceData.date).toLocaleDateString("DE-de")} akzeptiert. Du bist nun fähig in Sprachkanäle zu joinen, in denen ein Stream oder eine Aufnahme stattfindet.</p>}

                {/* buttonto new accaptence form */}
                <div className="toformbutton">
                    {UsemyvoiceData.state === null && <button onClick={handleLoadForm}>jetzt akzeptieren!</button>}
                    {UsemyvoiceData.state === "removed_by_user" && <button onClick={handleLoadForm}>erneut akzeptieren!</button>}
                    {UsemyvoiceData.state === "removed_by_admin" && <button disabled >Melde dich beim Server Team</button>}
                    {UsemyvoiceData.accepted && new window.Date(UsemyvoiceData.date).getFullYear() != new window.Date().getFullYear() && <button onClick={handleLoadForm}>jetzt verlängern!</button>}
                </div>

                <div className="toremovebutton">
                    {UsemyvoiceData.accepted && <button onClick={handleremoveclick}>Erklärung zurückziehen</button>}
                </div>

            </div>}

            {UsemyvoiceData && showForm && <div className="box form">
                    <h3 style={{fontWeight: "bold", textDecoration: "underline", textAlign: "center"}}>Einverständniserklärung zur Nutzung von Stimmenaufnahmen und Nutzerinformationen</h3>
                    <p>zwischen Eat, Sleep, Nintendo, Repeat vertreten durch Dustin David Meyer (im folgenden als Vertreter genannt), und dem Nutzer und/oder Verwalter des Discord Accounts mit der ID "{userData.id}" (im folgenden {userData.username} genannt)</p>

                    <br />
                    <h4>Gegenstand:</h4>
                    <p>Stimmenaufnahmen und Nutzerinformationen wie Name, Diskriminator und Profilbild des Discord Accounts im Jahre 2021</p>

                    <br />
                    <h4>Verwendungszweck:</h4>
                    <p>Veröffentlichung für diverse Mediengattungen. Diese wären Plattformen wie YouTube oder Twitch.</p>

                    <br />
                    <h4>Widerruf:</h4>
                    <p>Ein Widerruf kann jederzeit und mit sofortiger Wirkung für die Zukunft erfolgen. Dieser ist auf folgenden Wegen einzureichen:</p>
                    <ul>
                        <li><p>Email: public@dustin-dm.de</p></li>
                        <li><p>Über das Webinterface über das die Einverständniserklärung akzeptiert wurde</p></li>
                    </ul>

                    <br />
                    <h4>Erklärung:</h4>
                    <p>{userData.username} erklärt sein/ihr Einverständnis mit der Verwendung der Aufnahmen seiner/ihrer Person in Form von Audio für die oben beschriebenen Zwecke. Eine Verwendung der Audio Aufnahmen fuer andere, als die beschriebenen Zwecke oder ein Inverkehrbringen durch Ueberlassung der Aufnahmen an Dritte, ist unzulaessig. Diese Einwilligung ist freiwillig. Diese Einwilligung kann jederzeit mit Wirkung für die Zukunft über die oben beschriebenen Wege widerrufen werden.</p>
                    <br />

                    {/* the real form */}
                    <label disabled={IspostACPending} htmlFor="signature">*Digitale Signatur in Form von Name oder Kennung:</label>
                    <input id="signature" type="text" maxLength="70" onChange={(e) => setsignature(e.target.value)} required/>

                    <div className="flex">
                    <input disabled={IspostACPending} id="accepted" type="checkbox" onChange={(e) => setaccepted(e.target.checked)} required />
                    <label htmlFor="accepted">*Ich habe die Einverständniserklärung gelesen und bin mit den oben genannten Punkten einverstanden. Mir ist bewusst, dass meine Stimme aufgezeichnet werden könnte, sobald der Voice Channel einen roten Punkt im Namen beinhaltet.</label>
                    </div>
                    <br />

                    <div className="flex">
                    <input disabled={IspostACPending} id="mail" type="checkbox" onChange={(e) => setwantemail(e.target.checked)} required />
                    <label htmlFor="mail">Ich möchte eine einmalige Email bekommen, die eine Kopie dieser Einverständniserklärung beinhaltet.</label>
                    </div>

                    <button disabled={IspostACPending} onClick={handlepostac}>Einwilligen</button>
                    <br />
                    <p>* Pflichtfeld</p>




                </div>}


            {/* FAQ */}
        </div>
     );
}
 
export default Usemyvoice;