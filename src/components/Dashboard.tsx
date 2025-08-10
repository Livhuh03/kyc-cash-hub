import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Shield, 
  Phone,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  EyeOff
} from "lucide-react";
import { TransactionHistory } from "./TransactionHistory";
import { DepositModal } from "./DepositModal";
import { WithdrawModal } from "./WithdrawModal";
import { KYCStatus } from "./KYCStatus";

export const Dashboard = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // User data with dynamic balance
  const user = {
    name: "Ratombo Livhuwani",
    phone: "+27 79 919 8802",
    balance: userBalance,
    kycStatus: "verified" as const,
    accountNumber: "****18176"
  };

  useEffect(() => {
    fetchUserBalance();
  }, []);

  const fetchUserBalance = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance_cents')
        .eq('user_id', user.id)
        .single();

      if (wallet) {
        setUserBalance(wallet.balance_cents / 100);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickStats = [
    {
      title: "Total Deposits",
      value: "R 25,890",
      change: "+12.5%",
      trend: "up" as const,
      icon: TrendingUp
    },
    {
      title: "Total Withdrawals", 
      value: "R 10,140",
      change: "-2.3%",
      trend: "down" as const,
      icon: TrendingDown
    },
    {
      title: "Pending Transactions",
      value: "3",
      change: "2 deposits",
      trend: "neutral" as const,
      icon: Clock
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-primary to-primary-light p-2 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">KYC Cash Hub</h1>
                <p className="text-sm text-muted-foreground">Secure Financial Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Welcome back</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Balance Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary opacity-10" />
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Account Balance</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              <div>
                <p className="text-3xl font-bold">
                  {showBalance ? `R ${user.balance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}` : "R ••••••"}
                </p>
                <p className="text-sm text-muted-foreground flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                  <span>•</span>
                  <span>Account {user.accountNumber}</span>
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  onClick={() => setIsDepositOpen(true)}
                  className="flex-1 bg-gradient-to-r from-success to-success/90 hover:from-success/90 hover:to-success/80"
                >
                  <ArrowDownLeft className="h-4 w-4 mr-2" />
                  Deposit
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsWithdrawOpen(true)}
                  className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYC Status */}
        <KYCStatus status={user.kycStatus} />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-sm flex items-center space-x-1 ${
                      stat.trend === 'up' ? 'text-financial-positive' : 
                      stat.trend === 'down' ? 'text-financial-negative' : 
                      'text-financial-neutral'
                    }`}>
                      <span>{stat.change}</span>
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    stat.trend === 'up' ? 'bg-success-light' :
                    stat.trend === 'down' ? 'bg-destructive/10' :
                    'bg-warning-light'
                  }`}>
                    <stat.icon className={`h-6 w-6 ${
                      stat.trend === 'up' ? 'text-success' :
                      stat.trend === 'down' ? 'text-destructive' :
                      'text-warning'
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Transaction History */}
        <TransactionHistory />
      </div>

      {/* Modals */}
      <DepositModal 
        open={isDepositOpen} 
        onOpenChange={setIsDepositOpen} 
        onDepositSuccess={fetchUserBalance}
      />
      <WithdrawModal 
        open={isWithdrawOpen} 
        onOpenChange={setIsWithdrawOpen} 
        onWithdrawSuccess={fetchUserBalance}
      />
    </div>
  );
};
