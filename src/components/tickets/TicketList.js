import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { Ticket } from "./Ticket";
import "./Tickets.css"

export const TicketList = ({ searchTermState }) => {
    const [tickets, setTickets] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [filteredTickets, setFiltered] = useState([]);
    const [openOnly, updateOpenOnly] = useState(false);
    const [emergency, setEmergency] = useState(false);
    const navigate = useNavigate();

    const localHoneyUser = localStorage.getItem("honey_user");
    const honeyUserObject = JSON.parse(localHoneyUser);

    useEffect(
        () => {
            const searchedTickets = tickets.filter(ticket => ticket.description.startsWith(searchTermState))
            setFiltered(searchedTickets)
        }, [searchTermState]
    )

    useEffect(
        () => {
            if (emergency) {
                const emergencies = tickets.filter(ticket => ticket.emergency === true);
                setFiltered(emergencies);
            } else {
                setFiltered(tickets);
            }
        }, [emergency]
    )

    const getAllTickets = () => {
        fetch(`http://localhost:8088/serviceTickets?_embed=employeeTickets`)
            .then(response => response.json())
            .then((ticketArray) => {
                setTickets(ticketArray)
                setFiltered(ticketArray)
            })
    }

    useEffect(
        () => {
            getAllTickets()

            fetch(`http://localhost:8088/employees?_expand=user`)
                .then(response => response.json())
                .then((employeeArray) => {
                    setEmployees(employeeArray)
                })
        },
        [] // When this array is empty, you are observing initial component state
    )

    useEffect(
        () => {
            if (honeyUserObject.staff) {
                setFiltered(tickets);
            } else {
                const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id);
                setFiltered(myTickets);
            }
        },
        [tickets]
    )

    useEffect(
        () => {
            if (openOnly) {
                const openTicketArray = tickets.filter(ticket => {
                    return ticket.userId === honeyUserObject.id && ticket.dateCompleted === ""
                })
                setFiltered(openTicketArray)
            } else {
                const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id);
                setFiltered(myTickets);
            }
        },
        [openOnly]
    )

    return <>
        {
            honeyUserObject.staff ? <>
                <button onClick={ () => { setEmergency(true); } }>Emergency Only</button>
                <button onClick={ () => { setEmergency(false); } }>Show All</button>
            </>
            : <>
                <button onClick={() => navigate("/ticket/create") }>Create Ticket</button>
                <button onClick={() => updateOpenOnly(true) }>Open Ticket</button>
                <button onClick={() => updateOpenOnly(false) }>All My Tickets</button>
            </>
        }
        <h2>List of Tickets</h2>

        <article className="tickets">
            {
                filteredTickets.map(
                    (ticket) => {
                        return (
                            <Ticket 
                                key={ticket.id}
                                currentUser={honeyUserObject} 
                                ticketObject={ticket} 
                                employees={employees}
                                getAllTickets={getAllTickets} />
                        )
                    }
                )
            }
        </article>
    </>
}