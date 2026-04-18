import { DataGrid, GridPagination } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import type { GridColDef } from '@mui/x-data-grid';
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogAction from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { NumericFormat } from 'react-number-format'
import { useEffect, useState } from 'react';
import { api } from '../../api/apiConnect';
import { useForm, Controller } from 'react-hook-form';
import { handleApiFormErrors } from '../../api/handleApiErrors';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

interface Transactions {
    id: number;
    description: string;
    category_name: string;
    value: string;
    transaction_type: 'income' | 'expense';
    created_at: string
}

interface TransactionResponse {
    success: boolean;
    message: string;
    data: Transactions[];
}

interface Category {
    id: number;
    name: string;
    transaction_type: 'income' | 'expense';
    created_at: string;
}

interface CategoryResponse {
    success: boolean;
    message: string;
    data: Category[]
}

interface TransactionForm {
    description: string;
    value: number;
    transaction_type: 'income' | 'expense';
    category: number | null // id
}

const HomeTransactions = () => {
    const [transactions, setTransactions] = useState<TransactionResponse | null>(null);
    const { control, handleSubmit, setError, setValue, reset } = useForm<TransactionForm>({shouldUnregister: true, defaultValues: { description: undefined, value: undefined, transaction_type: undefined, category: undefined}});
    const [apiError, setApiError] = useState<string>('');
    const [openModal, setOpenModal] = useState({opened: false, formType: ''});
    const [categories, setCategories] = useState<CategoryResponse>();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const columns: GridColDef[] = [
        { field: 'description', headerName: 'Description', flex: 1},
        { field: 'category_name', headerName: 'Category', width: 150},
        { field: 'value', headerName: 'Value', width: 120, valueFormatter: (value) => {return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(value)}},
        { field: 'transaction_type', headerName: 'Type', width: 120},
        { field: 'created_at', headerName: 'Date', width: 150},
    ];

    const getTransactions = async () => {
                const response = await api.get('/transactions/');
                setTransactions(response.data)
            };
    const deleteTransaction = async (id: number) => {
        await api.delete(`/transactions/${id}/`)
        getTransactions();
    };
    useEffect(() => {
        getTransactions();
    }, [])

    const onUpdate = (id: number) => {
        const transaction = transactions?.data.find((trans) => trans.id === id);
                        if (transaction) {
                            setSelectedId(id)
                            const category = categories?.data.find((cat) => cat.name === transaction.category_name)
                            const category_id = category ? category.id : undefined
                            setValue('description', transaction.description)
                            setValue('value', Number(transaction.value))
                            setValue('transaction_type', transaction.transaction_type)
                            setValue('category', category_id ? category_id : null)
                            setOpenModal({opened: true, formType: 'Update'});
                        }
    }

    const updateTransaction = async (id: number, data: Record<string, any>) => {
        await api.patch(`/transactions/${id}/`, data)
        getTransactions()    }
    useEffect(() => {
        const getCategories = async () => {
            const response = await api.get('/category/');
            setCategories(response.data)
        }
        getCategories();
    }, [])
    const handleClose = () => {
        setOpenModal({opened: false, formType: ''})
        reset();
    }
    const onSubmit = async (data: TransactionForm) => {
        try {
            if (openModal.formType === 'Create') {
            await api.post('/transactions/', data);
            getTransactions();

            } else if (openModal.formType === 'Update') {
                await updateTransaction(selectedId!, data)   
            };
            handleClose();
        } catch (err: any) {
            handleApiFormErrors(err.response.data, setError, setApiError)
        }
    }

    return (
        <Box display='flex' flexDirection='column' height='90%' width='60%'>
            <Button sx={{alignSelf: 'flex-end', mb: 2}} variant='contained' onClick={() => {setOpenModal({opened: true, formType: 'Create'});}}>Create</Button>
            <DataGrid
            rows={transactions?.data ?? []}
            columns={columns}
            initialState={{
                pagination: {paginationModel: { pageSize: 10}}
            }}
            pageSizeOptions={[10, 25, 50]}
            onRowSelectionModelChange={(model) => {
                setSelectedId(model.ids.size > 0 ? Number([...model.ids][0]) : null)
            }}
            slots={{
                footer: () => (
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1}}>
                        <Box>
                            {selectedId && (
                                <>
                                    <Button color='error' onClick={() => deleteTransaction(selectedId)} startIcon={<DeleteIcon />}>
                                    {isMobile ? '' : 'Delete'}
                                    </Button>
                                    
                                    <Button color='warning' onClick={() => onUpdate(selectedId)} startIcon={< EditIcon />}>
                                      { isMobile ? '' : 'Update'}
                                    </Button>
                                </>
                            )}
                        </Box>
                        <GridPagination />
                    </Box>
                )
            }}/>
            <Dialog open={openModal.opened}  onClose={handleClose}>
                <Box component='form' noValidate onSubmit={handleSubmit(onSubmit)}>
                    <DialogAction>
                        <IconButton onClick={() => handleClose()}>
                            <CloseIcon/>
                        </IconButton>
                    </DialogAction>
                    <DialogTitle sx={{mb: 5}}>{openModal.formType} transaction</DialogTitle>
                    <DialogContent>
                        <Controller 
                        name='description'
                        control={control}
                        defaultValue=''
                        render={({ field, fieldState }) => (
                            <TextField
                            {...field}
                            label='Description'
                            type="text"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message || " "}
                            variant="outlined"
                            autoComplete="off"
                            fullWidth/>
                        )}/>
                        <Controller 
                        name='value'
                        control={control}
                        rules={{ required: "Value required"}}
                        render={({ field: {onChange, ...restField}, fieldState }) => (
                            <NumericFormat
                            {...restField}
                            onValueChange={(values) => onChange(values.floatValue ?? '')}
                            customInput={TextField}
                            label='Value'
                            decimalSeparator='.'
                            thousandSeparator=','
                            decimalScale={2}
                            fixedDecimalScale
                            allowNegative={false}
                            prefix='$'
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message || " "}
                            variant="outlined"
                            autoComplete="off"
                            fullWidth
                            
                            required/>
                            )}/>
                        <Controller 
                        name='category'
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth sx={{mb: 5}}>
                                <InputLabel id='category-label'>Category</InputLabel>
                                <Select 
                                {...field} 
                                label='Category'
                                labelId='category-label'
                                value={field.value ?? ''}
                                onChange={(e) => {
                                    const id = Number(e.target.value)
                                    field.onChange(id)

                                    const selectedCategory = categories?.data.find((cat) => cat.id === id)
                                    if (selectedCategory) {
                                        setValue('transaction_type', selectedCategory.transaction_type)
                                    }
                                }}>
                                    {categories?.data.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}/>
                        <Controller 
                        name='transaction_type'
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth sx={{mb: 5}}>
                                <InputLabel id='type-label'>Type</InputLabel>
                                <Select 
                                {...field} 
                                label='Category'
                                labelId='type-label'
                                value={field.value ?? ''}
                                onChange={(e) => {
                                    field.onChange(e.target.value)
                                        setValue('category', null)
                                }}>
                                        <MenuItem key='income' value='income'>
                                        Income
                                        </MenuItem>
                                        <MenuItem key='expense' value='expense'>
                                        Expense
                                        </MenuItem>
                                </Select>
                            </FormControl>
                        )}/>
                        <DialogContentText color='error'>{apiError ? apiError : ' '}</DialogContentText>
                    </DialogContent>
                    <DialogAction sx={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>
                        <Button type='submit' variant='contained'>Save</Button>
                    </DialogAction>
                </Box>
            </Dialog>
        </Box>
    )
}

export default HomeTransactions