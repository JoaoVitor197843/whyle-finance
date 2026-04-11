import { useEffect, useState } from "react";
import { api } from "../../api/apiConnect";
import { PieChart } from "@mui/x-charts/PieChart";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MetricCard from "../../components/MetricCard";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
interface Category {
  total_spent: number
  category__name: string
  transaction_type: string
}

interface Summary {
  data: {
    balance: number
    expenses: number
    income: number
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
    if (!summary) return null
    return (
        <Box sx={{width: "100%", height: "100%", p: 10}}>
            <Stack direction="row" spacing={2} mb={10}>
                <MetricCard label="Balance" value={summary.data.balance}/>
                <MetricCard label="Income" value={summary.data.income}/>
                <MetricCard label="Expenses" value={summary.data.expenses}/>
            </Stack>
            <Grid container spacing={20} sx={{justifyContent: 'center'}}>
                <Grid alignItems='center' justifyContent='center' direction='column'>
                <Typography variant="h5" sx={{textAlign: 'center', mb: 5}}>Categories by expenses</Typography>
                <PieChart series={[
                    {
                        data: summary.data.by_category.filter((category) => category.transaction_type === 'expense').map((category, index) => ({
                            id: index,
                            value: category.total_spent,
                            label: category.category__name
                        }))
                    }
                ]}
                sx={{
                    width: {sm: 300, xs: 200},
                    height: {sm: 200, xs: 100}
                }}></PieChart>
                </Grid>
                <Grid alignItems='center' justifyContent='center' direction='column'>
                <Typography variant="h5" sx={{textAlign: 'center', mb: 5}}>Category by incomes</Typography>
                <PieChart series={[
                    {
                        data: summary.data.by_category.filter((category) => category.transaction_type === 'income').map((category, index) => ({
                            id: index,
                            value: category.total_spent,
                            label: category.category__name ?? 'Uncategorized'
                        }))
                    }
                ]}
                sx={{
                    width: {sm: 300, xs: 200},
                    height: {sm: 200, xs: 100}
                }}></PieChart>
                </Grid>
            </Grid>
        </Box>
    )
}

export default HomeInit