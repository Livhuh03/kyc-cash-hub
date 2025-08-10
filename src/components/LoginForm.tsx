import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Phone, CreditCard, Shield, CheckCircle, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onLogin: () => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"input" | "verify">("input");
  const [loginMethod, setLoginMethod] = useState<"phone" | "id">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendOTP = async () => {
    const identifier = loginMethod === "phone" ? phoneNumber : idNumber;
    
    if (!identifier) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: `Please enter your ${loginMethod === "phone" ? "phone number" : "ID number"}.`
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep("verify");
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${loginMethod === "phone" ? "your phone" : "your registered phone number"}.`
      });
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter the 6-digit verification code."
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login Successful",
        description: "Welcome back to KYC Cash Hub!"
      });
      onLogin();
    }, 1500);
  };

  const features = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "256-bit encryption & fraud monitoring"
    },
    {
      icon: CheckCircle,
      title: "Instant Verification",
      description: "Quick KYC process with real-time approval"
    },
    {
      icon: DollarSign,
      title: "Competitive Rates",
      description: "Low fees and best exchange rates"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding & Features */}
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
              <div className="bg-gradient-to-br from-primary to-primary-light p-3 rounded-xl">
                <DollarSign className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                  KYC Cash Hub
                </h1>
                <p className="text-muted-foreground">Secure Financial Platform</p>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">
              Secure, Fast, and Reliable Financial Services
            </h2>
            <p className="text-muted-foreground mb-8">
              Deposit, withdraw, and manage your funds with South Africa's most trusted financial platform.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-background/50 backdrop-blur-sm border">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-background/95">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <p className="text-muted-foreground">
              {step === "input" ? "Sign in to your account" : "Enter verification code"}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step === "input" ? (
              <>
                <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as "phone" | "id")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="phone" className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>Phone</span>
                    </TabsTrigger>
                    <TabsTrigger value="id" className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span>ID Number</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="phone" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+27 82 123 4567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="id" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="id">ID Number</Label>
                      <Input
                        id="id"
                        type="text"
                        placeholder="Enter your SA ID number"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        maxLength={13}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <Button 
                  onClick={handleSendOTP}
                  className="w-full bg-gradient-to-r from-primary to-primary-light"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </Button>
              </>
            ) : (
              <>
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Code sent to {loginMethod === "phone" ? phoneNumber : "your registered phone"}
                  </p>
                  <Button 
                    variant="link" 
                    size="sm"
                    onClick={() => setStep("input")}
                    className="text-xs"
                  >
                    Change {loginMethod === "phone" ? "phone number" : "ID number"}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleVerifyOTP}
                    className="w-full bg-gradient-to-r from-success to-success/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Verify & Sign In"}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleSendOTP}
                    className="w-full"
                    disabled={isLoading}
                  >
                    Resend Code
                  </Button>
                </div>
              </>
            )}

            <div className="flex items-center justify-center space-x-2 pt-4 border-t">
              <Shield className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground">
                Secured with bank-grade encryption
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};