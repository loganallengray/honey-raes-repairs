import { useEffect, useState } from "react"
import { Customer } from "./Customer"
import "./customers.css"

export const CustomerList = () => {
    const [customers, setCustomer] = useState([])

    useEffect(
        () => {
            fetch("http://localhost:8088/customers?_expand=user")
                .then(response => response.json())
                .then((customerArray) => {
                    setCustomer(customerArray)
                })
        }, []
    )

    return (
        <article className="customers">
            {
                customers.map(customer => 
                    <Customer 
                        key={customer.id}
                        id={customer.id} 
                        fullName={customer?.user?.fullName} 
                        address={customer.address}
                        phoneNumber={customer.phoneNumber}
                    />)}
        </article>
    )
}