import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Building2, Smartphone, Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDepositSuccess?: () => void;
}

export const DepositModal = ({ open, onOpenChange, onDepositSuccess }: DepositModalProps) => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      description: "Instant deposit via card",
      icon: CreditCard,
      fee: "2.9%",
      time: "Instant"
    },
    {
      id: "eft",
      name: "Instant EFT",
      description: "Bank-to-bank transfer",
      icon: Building2,
      fee: "R 5.00",
      time: "Instant"
    },
    {
      id: "mobile",
      name: "Mobile Payment",
      description: "Pay via mobile wallet",
      icon: Smartphone,
      fee: "1.5%",
      time: "1-2 minutes"
    }
  ];

  const selectedMethodDetails = paymentMethods.find(m => m.id === method);

  const handleDeposit = async () => {
    if (!amount || !method) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter an amount and select a payment method."
      });
      return;
    }

    const depositAmount = parseFloat(amount);
    if (depositAmount < 50) {
      toast({
        variant: "destructive", 
        title: "Minimum Deposit",
        description: "Minimum deposit amount is R 50.00"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Get current wallet balance
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance_cents')
        .eq('user_id', user.id)
        .single();

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      const depositAmountCents = Math.round(depositAmount * 100);
      const newBalanceCents = wallet.balance_cents + depositAmountCents;

      // Update wallet balance
      const { error: walletError } = await supabase
        .from('wallets')
        .update({ balance_cents: newBalanceCents })
        .eq('user_id', user.id);

      if (walletError) throw walletError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'deposit',
          amount_cents: depositAmountCents,
          description: `Deposit via ${selectedMethodDetails?.name}`,
          status: 'completed',
          provider_reference: `DEP_${Date.now()}`
        });

      if (transactionError) throw transactionError;

      setIsProcessing(false);
      onOpenChange(false);
      setAmount("");
      setMethod("");
      
      toast({
        title: "Deposit Successful",
        description: `R ${depositAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })} has been added to your account.`,
      });

      // Trigger refresh of balance
      onDepositSuccess?.();
    } catch (error) {
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Deposit Failed",
        description: error instanceof Error ? error.message : "An error occurred during deposit."
      });
    }
  };

  const calculateFee = () => {
    if (!amount || !selectedMethodDetails) return 0;
    const depositAmount = parseFloat(amount);
    if (selectedMethodDetails.fee.includes('%')) {
      const percentage = parseFloat(selectedMethodDetails.fee.replace('%', ''));
      return (depositAmount * percentage) / 100;
    } else {
      return parseFloat(selectedMethodDetails.fee.replace('R ', ''));
    }
  };

  const getTotalAmount = () => {
    const depositAmount = parseFloat(amount) || 0;
    const fee = calculateFee();
    return depositAmount + fee;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="p-2 bg-success-light rounded-lg">
              <CreditCard className="h-5 w-5 text-success" />
            </div>
            <span>Make a Deposit</span>
          </DialogTitle>
          <DialogDescription>
            Add funds to your account securely and instantly
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Deposit Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">R</span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                min="50"
                step="0.01"
              />
            </div>
            <p className="text-xs text-muted-foreground">Minimum deposit: R 50.00</p>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <div className="space-y-2">
              {paymentMethods.map((paymentMethod) => (
                <Card 
                  key={paymentMethod.id}
                  className={`cursor-pointer transition-all ${
                    method === paymentMethod.id 
                      ? 'ring-2 ring-primary bg-accent' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setMethod(paymentMethod.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <paymentMethod.icon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{paymentMethod.name}</p>
                          <p className="text-sm text-muted-foreground">{paymentMethod.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {paymentMethod.time}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Fee: {paymentMethod.fee}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Summary */}
          {amount && method && (
            <Card className="bg-muted/30">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Deposit Amount:</span>
                  <span>R {parseFloat(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Processing Fee:</span>
                  <span>R {calculateFee().toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total to Pay:</span>
                    <span>R {getTotalAmount().toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Notice */}
          <div className="flex items-start space-x-2 p-3 bg-primary/5 rounded-lg">
            <Shield className="h-4 w-4 text-primary mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Secure Transaction</p>
              <p>Your payment is protected by bank-grade encryption and fraud monitoring.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeposit}
              className="flex-1 bg-gradient-to-r from-success to-success/90"
              disabled={!amount || !method || isProcessing}
            >
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Deposit Funds
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};