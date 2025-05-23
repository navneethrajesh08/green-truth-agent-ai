
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, Building2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CompanyReportUploadProps {
  onUpload: (file: File) => void;
}

const CompanyReportUpload = ({ onUpload }: CompanyReportUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedReport, setUploadedReport] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 100 * 1024 * 1024; // 100MB for company reports

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Company report must be smaller than 100MB",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate processing the company report
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadedReport(file);
      onUpload(file);
      setIsOpen(false);
      
      toast({
        title: "Company report uploaded successfully",
        description: "P&G sustainability data will be used for fact-checking claims",
      });
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to process the company report",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const removeReport = () => {
    setUploadedReport(null);
    toast({
      title: "Report removed",
      description: "Company report has been removed from fact-checking",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Building2 className="h-4 w-4" />
          <span>P&G Report</span>
          {uploadedReport ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>P&G Company Report Upload</DialogTitle>
          <DialogDescription>
            Upload P&G's annual sustainability report or environmental data to enable fact-checking against company practices
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Status */}
          {uploadedReport ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Report Loaded</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{uploadedReport.name}</p>
                      <p className="text-sm text-gray-500">
                        {(uploadedReport.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button variant="destructive" onClick={removeReport}>
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload Company Report</CardTitle>
                <CardDescription>
                  This report will be used to fact-check claims against actual company data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, Word, or Excel files (Max 100MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    onChange={handleFileUpload}
                    disabled={isProcessing}
                  />
                </label>
                
                {isProcessing && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-500 bg-blue-100">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing report...
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">How Company Reports Enhance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Fact-check claims against actual company performance data</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Identify contradictions between marketing claims and reported metrics</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Ensure alignment with disclosed sustainability commitments</span>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <span>Data is processed locally and not shared externally</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recommended P&G Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 border rounded-lg">
                  <Badge variant="outline" className="mb-2">Annual Report</Badge>
                  <p className="text-xs text-gray-600">Comprehensive sustainability metrics and goals</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <Badge variant="outline" className="mb-2">ESG Report</Badge>
                  <p className="text-xs text-gray-600">Environmental, social, and governance data</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <Badge variant="outline" className="mb-2">CDP Disclosure</Badge>
                  <p className="text-xs text-gray-600">Climate change and water security data</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <Badge variant="outline" className="mb-2">GRI Report</Badge>
                  <p className="text-xs text-gray-600">Global Reporting Initiative standards</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyReportUpload;
