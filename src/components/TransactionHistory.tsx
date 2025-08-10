import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, Search } from "lucide-react";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  reference: string;
  method: string;
}

export const TransactionHistory = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock transaction data
  const transactions: Transaction[] = [
    {
      id: "1",
      type: "deposit",
      amount: 5000,
      status: "completed",
      date: "2024-01-15",
      reference: "DEP001234",
      method: "Bank Transfer"
    },
    {
      id: "2", 
      type: "withdrawal",
      amount: 2500,
      status: "pending",
      date: "2024-01-14",
      reference: "WTH001235",
      method: "Bank Transfer"
    },
    {
      id: "3",
      type: "deposit",
      amount: 1500,
      status: "completed", 
      date: "2024-01-13",
      reference: "DEP001236",
      method: "Card Payment"
    },
    {
      id: "4",
      type: "withdrawal",
      amount: 3000,
      status: "failed",
      date: "2024-01-12",
      reference: "WTH001237",
      method: "Bank Transfer"
    },
    {
      id: "5",
      type: "deposit",
      amount: 7500,
      status: "completed",
      date: "2024-01-11",
      reference: "DEP001238", 
      method: "Instant EFT"
    }
  ];

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === "all" || tx.type === filter || tx.status === filter;
    const matchesSearch = tx.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.method.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success-light text-success">Completed</Badge>;
      case "pending":
        return <Badge className="bg-warning-light text-warning">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle>Transaction History</CardTitle>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="deposit">Deposits</SelectItem>
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    transaction.type === "deposit" ? "bg-success-light" : "bg-primary/10"
                  }`}>
                    {transaction.type === "deposit" ? (
                      <ArrowDownLeft className="h-4 w-4 text-success" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium capitalize">{transaction.type}</p>
                      {getStatusIcon(transaction.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{transaction.method}</p>
                    <p className="text-xs text-muted-foreground">{transaction.reference}</p>
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <p className={`font-bold ${
                    transaction.type === "deposit" ? "text-success" : "text-primary"
                  }`}>
                    {transaction.type === "deposit" ? "+" : "-"}R {transaction.amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                  </p>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(transaction.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString('en-ZA')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        
        {filteredTransactions.length > 0 && (
          <div className="mt-6 text-center">
            <Button variant="outline">Load More Transactions</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};