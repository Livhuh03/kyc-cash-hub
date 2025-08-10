import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Building2, Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WithdrawModal = ({ open, onOpenChange }: WithdrawModalProps) => {
  const [amount, setAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [bankName, setBankName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Mock user balance
  const availableBalance = 15750.50;

  const handleWithdraw = async () => {
    if (!amount || !bankAccount || !accountHolder || !bankName) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields."
      });
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount < 100) {
      toast({
        variant: "destructive",
        title: "Minimum Withdrawal",
        description: "Minimum withdrawal amount is R 100.00"
      });
      return;
    }

    if (withdrawAmount > availableBalance) {
      toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: "Withdrawal amount exceeds available balance."
      });
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      onOpenChange(false);
      setAmount("");
      setBankAccount("");
      setAccountHolder("");
      setBankName("");
      
      toast({
        title: "Withdrawal Requested",
        description: `R ${withdrawAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })} withdrawal has been submitted for processing.`,
      });
    }, 2000);
  };

  const processingFee = 15.00;
  const totalDeduction = (parseFloat(amount) || 0) + processingFee;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <span>Withdraw Funds</span>
          </DialogTitle>
          <DialogDescription>
            Transfer funds to your bank account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Available Balance */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Available Balance</span>
                <span className="font-bold text-lg">
                  R {availableBalance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="withdraw-amount">Withdrawal Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">R</span>
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                min="100"
                max={availableBalance}
                step="0.01"
              />
            </div>
            <p className="text-xs text-muted-foreground">Minimum withdrawal: R 100.00</p>
          </div>

          {/* Bank Details */}
          <div className="space-y-4">
            <Label>Bank Account Details</Label>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="bank-name" className="text-sm">Bank Name</Label>
                <Input
                  id="bank-name"
                  placeholder="e.g., Standard Bank"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="account-holder" className="text-sm">Account Holder Name</Label>
                <Input
                  id="account-holder"
                  placeholder="Full name as per bank account"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="account-number" className="text-sm">Account Number</Label>
                <Input
                  id="account-number"
                  placeholder="Bank account number"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          {amount && (
            <Card className="bg-muted/30">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Withdrawal Amount:</span>
                  <span>R {parseFloat(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Processing Fee:</span>
                  <span>R {processingFee.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total Deduction:</span>
                    <span>R {totalDeduction.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Processing Time Notice */}
          <div className="flex items-start space-x-2 p-3 bg-warning-light rounded-lg">
            <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
            <div className="text-xs">
              <p className="font-medium text-foreground">Processing Time</p>
              <p className="text-muted-foreground">
                Withdrawals are processed within 1-3 business days. You'll receive confirmation once completed.
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start space-x-2 p-3 bg-primary/5 rounded-lg">
            <Shield className="h-4 w-4 text-primary mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Secure Withdrawal</p>
              <p>All withdrawals require verification and are monitored for your security.</p>
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
              onClick={handleWithdraw}
              className="flex-1"
              disabled={!amount || !bankAccount || !accountHolder || !bankName || isProcessing}
            >
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Request Withdrawal
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};