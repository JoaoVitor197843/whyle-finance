import { useEffect, useState } from "react"
import { api } from "../../api/apiConnect"
import { PieChart } from "@mui/x-charts/PieChart"
import { Box } from "@mui/material"

interface Category {
  total_spent: number
  category__name: string
}

interface Summary {
  data: {
    by_category: Category[]
  }
}

const HomeInit = () => {
    const [summary, setSummary] = useState<Summary | null>(null)
    useEffect (() => {
        const getData = async () => {
            const response = await api.get('/transactions/summary/');
            setSummary(response.data)
        }
        getData();
    }, [])
    return (
        <Box sx={{width: "100%", height: "100%", p: 10}}>
        {summary &&
            <PieChart series={[
                {
                    data: summary.data.by_category.map((category, index) => ({
                        id: index,
                        value: category.total_spent,
                        label: category.category__name
                    }))
                }
            ]}
            sx={{
                width: {sm: 400, xs: 300},
                height: {sm: 300, xs: 200}
            }}></PieChart>}
        </Box>
    )
}

export default HomeInit