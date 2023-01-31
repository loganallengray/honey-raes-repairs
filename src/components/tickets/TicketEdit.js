import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import "./ticketEdit.css"

export const TicketEdit = () => {
    const ticket = useParams()
    const navigate = useNavigate()

    const localHoneyUser = localStorage.getItem("honey_user")
    const honeyUserObject = JSON.parse(localHoneyUser)

    const [newTicket, setNewTicket] = useState({
        description: "",
        emergency: false,
        userId: 0,
        dateCompleted: ""
    }) 

    useEffect(() => {
        fetch(`http://localhost:8088/serviceTickets?id=${ticket.ticketId}`)
            .then(response => response.json())
            .then((data) => {
                const singleTicket = data[0]
                setNewTicket(singleTicket)
            })
    }, [])

    const handleSaveButtonClick = (event) => {
        event.preventDefault()

        const ticketToSendToAPI = {
            userId: honeyUserObject.id,
            description: newTicket.description,
            emergency: newTicket.emergency,
            dateCompleted: newTicket.dateCompleted
        }

        return fetch(`http://localhost:8088/serviceTickets/${newTicket.id}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(ticketToSendToAPI)
        })
            .then(response => response.json())
            .then(() => {
                navigate("/tickets")
            })
    }

    return (
        <form className="ticketForm">
            <h2 className="ticketForm__title">Edit Service Ticket</h2>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        required autoFocus
                        className="form-description"
                        value={newTicket.description}
                        onChange={
                            (event) => {
                                const copy = {...newTicket}
                                copy.description = event.target.value
                                setNewTicket(copy)
                            }
                        } />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="name">Emergency:</label>
                    <input type="checkbox"
                        value={newTicket.emergency}
                        onChange={
                            (event) => {
                                const copy = {...newTicket}
                                copy.emergency = event.target.checked
                                setNewTicket(copy)
                            }
                        } />
                </div>
            </fieldset>
            <button 
                onClick={(clickEvent) => handleSaveButtonClick(clickEvent)}
                className="btn btn-primary">
                Save Edits
            </button>
        </form>
    )
}