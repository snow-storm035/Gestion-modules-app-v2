import { useContext, useEffect } from "react"
import { AlertContext } from "../context/AlertContext"

const Notification = () => {



    

    return (
        <>
            {
                notification2?.notifications?.length > 0 ?
                    <div className="alert-bubble">
                        {heddin ?
                            <div className="alert-message-bubble">
                                <button className="close_btn" onClick={handelHeddin}>
                                    <FontAwesomeIcon className="fa-regular fa-circle-xmark" icon={faCircleXmark} />
                                </button>
                                <p className="alert-text">le group <b>{notification2.notifications[0].data.code_groupe}</b> est <b>{notification2.notifications[0].data.etat}</b> dans le module <b>{notification2.notifications[0].data.code_module}</b>.
                                    <span>
                                        <a
                                            className="btn-alert-details"
                                            href={`/app/avancementDetail/${notification2.notifications[0].data.code_groupe}/${notification2.notifications[0].data.code_module}`}
                                            onClick={handleheddinalert}
                                        >
                                            Voir détails
                                        </a>
                                    </span>
                                </p>

                            </div >
                            :
                            ""
                        }
                        <button className="btn-bubble" onClick={handleClick} >
                            <div className="alert-icon">
                                <div>
                                    <span className="alert-number"> {notification2.unread_count} </span>
                                    <FontAwesomeIcon className="faBell" icon={faBell} />
                                </div>

                            </div>

                        </button>
                    </div>
                    :
                    ""
            }
        </>
    )
}