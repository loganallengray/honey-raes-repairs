import { useEffect, useState } from "react"

export const TicketList = () => {
    const [tickets, setTickets] = useState([])

    useEffect(
        () => {
            fetch(`http://localhost:8088/serviceTickets`)
                .then(response => response.json())
                .then((ticketArray) => {
                    setTickets(ticketArray)
                })
        },
        [] // When this array is empty, you are observing initial component state
    )

    return <>
        <h2>List of Tickets</h2>

        <article className="tickets">
            {
                tickets.map(
                    (ticket) => {
                        return (
                            <section key={ticket.id} className="ticket">
                                <header>{ticket.description}</header>
                                <footer>Emergency: {ticket.emergency ? "Y" : "N"}</footer>
                            </section>
                        )
                    }
                )
            }
        </article>
    </>
}