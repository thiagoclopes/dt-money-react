import { ReactNode, createContext, useEffect, useState } from "react";
import { api } from "../lib/axios";

interface Transaction {
    id: number;
    description: string;
    type: 'income' | 'outcome';
    price: number;
    category: string;
    createdAt: string;
}


interface TransactionContextType {
    transactions: Transaction[];
    fetchTransactions: (query?: string) => Promise<void>;
    createTransaction: (data: CreateTransactionInput) => Promise<void>;
}

interface TransactionProviderProps {
    children: ReactNode;
}

interface CreateTransactionInput{
    description: string,
    price: number,
    category: string,
    type: 'income' | 'outcome';
}

export const TransactionContext = createContext({} as TransactionContextType);

export function TransactionsProvider({children}: TransactionProviderProps){
    const [transactions, setTransactions] = useState<Transaction[]>([])
    
    async function fetchTransactions(query?: string){
        const response = await api.get('transactions', {
            params: {
                _sort: 'createdAt',
                _order: 'desc',
                q: query,
            }

        })

        setTransactions(response.data);
    }

    async function createTransaction(data: CreateTransactionInput) {
        const response = await api.post('transactions', {
            description: data.description,
            category: data.category,
            price: data.price,
            type: data.type,
            createdAt: new Date()
        })

        setTransactions(state => [response.data, ...state]);
    }

    useEffect(() => {
        fetchTransactions();
    }, [])

    return(
        <TransactionContext.Provider value={{transactions, fetchTransactions, createTransaction}}>
            {children}
        </TransactionContext.Provider>
    )
}