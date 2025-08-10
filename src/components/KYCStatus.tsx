import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Camera, 
  User,
  ArrowRight
} from "lucide-react";

interface KYCStatusProps {
  status: "pending" | "verified" | "rejected" | "incomplete";
}

export const KYCStatus = ({ status }: KYCStatusProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "verified":
        return {
          title: "KYC Verified",
          description: "Your identity has been successfully verified",
          color: "success",
          icon: CheckCircle,
          progress: 100,
          bgColor: "bg-success-light",
          textColor: "text-success"
        };
      case "pending":
        return {
          title: "KYC Under Review",
          description: "Your documents are being reviewed (1-2 business days)",
          color: "warning",
          icon: Clock,
          progress: 75,
          bgColor: "bg-warning-light",
          textColor: "text-warning"
        };
      case "rejected":
        return {
          title: "KYC Verification Failed",
          description: "Please resubmit your documents with correct information",
          color: "destructive",
          icon: AlertTriangle,
          progress: 25,
          bgColor: "bg-destructive/10",
          textColor: "text-destructive"
        };
      default:
        return {
          title: "Complete KYC Verification",
          description: "Verify your identity to unlock all features",
          color: "primary",
          icon: Shield,
          progress: 0,
          bgColor: "bg-primary/10",
          textColor: "text-primary"
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  const verificationSteps = [
    {
      id: 1,
      title: "Personal Information",
      description: "Full name, ID number, phone",
      icon: User,
      completed: status !== "incomplete"
    },
    {
      id: 2,
      title: "Document Upload",
      description: "ID document (front & back)",
      icon: FileText,
      completed: status === "verified" || status === "pending"
    },
    {
      id: 3,
      title: "Selfie Verification",
      description: "Live photo for identity match",
      icon: Camera,
      completed: status === "verified" || status === "pending"
    }
  ];

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-0 ${config.bgColor} opacity-50`} />
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${config.bgColor}`}>
              <StatusIcon className={`h-5 w-5 ${config.textColor}`} />
            </div>
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>{config.title}</span>
                <Badge 
                  variant={status === "verified" ? "default" : "secondary"}
                  className={
                    status === "verified" ? "bg-success text-success-foreground" :
                    status === "pending" ? "bg-warning text-warning-foreground" :
                    status === "rejected" ? "bg-destructive text-destructive-foreground" :
                    "bg-primary text-primary-foreground"
                  }
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{config.description}</p>
            </div>
          </div>
          
          {status !== "verified" && (
            <Button size="sm" className="bg-gradient-to-r from-primary to-primary-light">
              {status === "rejected" ? "Retry KYC" : "Complete KYC"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Verification Progress</span>
            <span>{config.progress}%</span>
          </div>
          <Progress 
            value={config.progress} 
            className="h-2"
          />
        </div>

        {/* Verification Steps */}
        {status !== "verified" && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Verification Steps</h4>
            <div className="space-y-2">
              {verificationSteps.map((step) => (
                <div 
                  key={step.id}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-background/50"
                >
                  <div className={`p-1.5 rounded-full ${
                    step.completed ? "bg-success-light" : "bg-muted"
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <step.icon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      step.completed ? "text-success" : "text-foreground"
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                  
                  {step.completed && (
                    <Badge variant="outline" className="text-xs">
                      Complete
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefits of KYC */}
        {status === "verified" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-sm font-medium text-success">Higher Limits</p>
              <p className="text-xs text-muted-foreground">Up to R 50,000</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-sm font-medium text-success">Fast Withdrawals</p>
              <p className="text-xs text-muted-foreground">Same day processing</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};