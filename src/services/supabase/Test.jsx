import { useEffect } from "react"
import { supabaseService } from "./servides/supabaseService"

export default function Test() {

    useEffect(() => {

        async function fetchData() {

            try {
                const data = await supabaseService.db.getAll("test")

                console.log("Data:", data)

            } catch (error) {

                console.log("Error:", error)

            }

        }

        fetchData()

    }, [])

    return <div>Testing Supabase</div>
}