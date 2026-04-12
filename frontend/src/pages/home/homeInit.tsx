import { useEffect, useState } from "react";
import { api } from "../../api/apiConnect";
import { PieChart } from "@mui/x-charts/PieChart";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MetricCard from "../../components/MetricCard";
import Button from '@mui/material/Button'
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { LineChart } from '@mui/x-charts/LineChart'
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
interface ByDayItem {
    day: string;
    balance: number;
}

interface ByDayExpenseIncomeItem {
    day: string;
    total: number;
}

interface ByDayData {
    balance_by_period: ByDayItem[];
    expenses_by_period: ByDayExpenseIncomeItem[];
    incomes_by_period: ByDayExpenseIncomeItem[];
}

interface ByDayResponse {
    success: boolean;
    message: string;
    data: ByDayData;
}

const HomeInit = () => {
    const [summary, setSummary] = useState<Summary | null>(null)
    const [period, setPeriod] = useState<string>('all')
    const [byDay, setByDay] = useState<ByDayResponse | null>(null)
    const periods = ['1w', '1m', '6m', '12m', 'all']
    useEffect (() => {
        const getData = async () => {
            const response = await api.get('/transactions/summary/');
            setSummary(response.data)
        }
        getData();
    }, [])
    useEffect(() => {
        const getData = async () => {
            const response = await api.post('/transactions/by-date/', {period: period})
            setByDay(response.data)
        }
        getData();
    },[period])

    if (!summary) return null

    return (
        <Box sx={{width: "100%", height: "100%", p: 10}}>
            <Stack direction="row" spacing={2} mb={10} justifyContent='center' display='flex'>
                <MetricCard label="Balance" value={summary.data.balance}/>
                <MetricCard label="Income" value={summary.data.income}/>
                <MetricCard label="Expenses" value={summary.data.expenses}/>
            </Stack>
            <Grid container spacing={10} sx={{justifyContent: 'center'}}>
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
            <Box mt={5}>
            <Stack direction='row' spacing={1} display='flex' justifyContent='flex-end'>
                {periods.map((p) => (
                    <Button 
                    key={p} 
                    onClick={() => setPeriod(p)} 
                    sx={{
                        py: '4px',
                        px: '12px',
                        borderRadius: 6,
                        border: 'none',
                        cursor: 'pointer',
                        background: period === p ? '#3b82f6' : '#1f2937',
                        fontWeight: period === p ? 600 : 400
                    }}>{p.toUpperCase()}</Button>
                ))}
            </Stack>
            {byDay && byDay.data.balance_by_period.length > 1 && (
            <LineChart
            sx={{mt: 5}}
            height={220}
            series={[
                {
                    label: 'Balance',
                    data: byDay?.data.balance_by_period.map((item) => item.balance) ?? [],
                    curve: 'monotoneX',
                    showMark: false,
                },
                {
                    label: 'Income',
                    data: byDay?.data.incomes_by_period.map((item) => item.total) ?? [],
                    curve: 'monotoneX',
                    color: '#22c55e',
                    showMark: false,
                },
                {
                    label: 'Expenses',
                    data: byDay?.data.expenses_by_period.map((item) => item.total) ?? [],
                    curve: 'monotoneX',
                    color: '#ef4444',
                    showMark: false,
                },
            ]}
            xAxis={[
                {
                    scaleType: 'point',
                    data: byDay?.data.balance_by_period.map((item) =>
                    new Date(item.day + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    })
                ) ?? [],
                },
            ]}/>)}
            {byDay && byDay.data.balance_by_period.length <= 1 && (
                <Typography variant="h4"textAlign= 'center' mt={5}>Not enough data to display chart</Typography>
            )}
            </Box>
        </Box>
    )
}

export default HomeInit