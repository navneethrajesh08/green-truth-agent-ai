
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, XCircle, FileText, ExternalLink } from "lucide-react";

interface AnalysisResults {
  overallScore: number;
  riskLevel: string;
  violations: Array<{
    type: string;
    severity: string;
    text: string;
    context?: string;
    position?: string;
    guideline: string;
    suggestion: string;
  }>;
  compliance: {
    eu: number;
    us: number;
  };
  companyReportConflicts?: Array<{
    claim: string;
    conflict: string;
    severity: string;
  }>;
}

interface GreenwashingAnalysisProps {
  results: AnalysisResults;
}

const GreenwashingAnalysis = ({ results }: GreenwashingAnalysisProps) => {
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-orange-600 bg-orange-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high": return "destructive";
      case "medium": return "outline";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high": return <XCircle className="h-4 w-4" />;
      case "medium": return <AlertTriangle className="h-4 w-4" />;
      case "low": return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Compliance Assessment</CardTitle>
          <CardDescription>
            Comprehensive analysis based on EU and US environmental marketing regulations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-300"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={results.overallScore >= 70 ? "text-green-500" : results.overallScore >= 50 ? "text-orange-500" : "text-red-500"}
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={`${results.overallScore}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{results.overallScore}%</span>
                </div>
              </div>
              <Badge className={getRiskColor(results.riskLevel)}>
                {results.riskLevel} Risk
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">EU Compliance</span>
                  <span className="text-sm text-gray-600">{results.compliance.eu}%</span>
                </div>
                <Progress value={results.compliance.eu} className="w-full" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">US Compliance</span>
                  <span className="text-sm text-gray-600">{results.compliance.us}%</span>
                </div>
                <Progress value={results.compliance.us} className="w-full" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {results.violations.filter(v => v.severity.toLowerCase() === "high").length}
                </div>
                <div className="text-sm text-gray-600">High Risk Issues</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {results.violations.filter(v => v.severity.toLowerCase() === "medium").length}
                </div>
                <div className="text-sm text-gray-600">Medium Risk Issues</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Violations List */}
      <Card>
        <CardHeader>
          <CardTitle>Detected Violations</CardTitle>
          <CardDescription>
            Issues found that may constitute greenwashing under current regulations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.violations.length > 0 ? (
              results.violations.map((violation, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getSeverityIcon(violation.severity)}
                      <h3 className="font-medium text-gray-900">{violation.type}</h3>
                      <Badge variant={getSeverityColor(violation.severity) as "destructive" | "outline" | "secondary"}>
                        {violation.severity}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Guideline
                    </Button>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded border-l-4 border-orange-400">
                    <p className="text-sm font-medium text-gray-700">Problematic Text:</p>
                    <p className="text-sm text-gray-900 italic">"{violation.text}"</p>
                    
                    {violation.context && (
                      <div className="mt-2 border-t border-gray-200 pt-2">
                        <p className="text-sm font-medium text-gray-700">Context:</p>
                        <p className="text-sm text-gray-900">"{violation.context}"</p>
                      </div>
                    )}
                    
                    {violation.position && (
                      <p className="text-xs text-gray-500 mt-2">Location: {violation.position}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Applicable Regulation:</p>
                      <p className="text-sm text-blue-600">{violation.guideline}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Recommended Action:</p>
                      <p className="text-sm text-gray-900">{violation.suggestion}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No violations detected in the current content.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Company Report Conflicts */}
      {results.companyReportConflicts && results.companyReportConflicts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>P&G Report Fact-Check</span>
            </CardTitle>
            <CardDescription>
              Claims that contradict information in the uploaded company sustainability report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.companyReportConflicts.map((conflict, index) => (
                <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-red-900">Factual Inconsistency</h4>
                      <p className="text-sm text-red-700 mt-1">
                        <strong>Claim:</strong> {conflict.claim}
                      </p>
                      <p className="text-sm text-red-700">
                        <strong>Company Report Says:</strong> {conflict.conflict}
                      </p>
                      <Badge variant="destructive" className="mt-2">
                        {conflict.severity} Priority
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GreenwashingAnalysis;
