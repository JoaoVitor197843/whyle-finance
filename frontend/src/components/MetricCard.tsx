import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

interface MetricCardProps {
    label: string;
    value: number;
}

const MetricCard = ({ label, value }: MetricCardProps) => {
    return (
        <Paper elevation={0} sx={{flex: 1, p: 2, borderRadius: 5}}>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="h6" fontWeight={500}>
                {new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(value)}
            </Typography>
        </Paper>
    )
}

export default MetricCard