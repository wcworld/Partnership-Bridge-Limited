import { Upload, Check, Clock, X, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Document {
  name: string;
  status: 'Requested' | 'Uploaded' | 'Approved' | 'Rejected';
}

interface DocumentUploaderProps {
  documents: Document[];
}

export function DocumentUploader({ documents }: DocumentUploaderProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'Rejected':
        return <X className="h-4 w-4 text-red-600" />;
      case 'Uploaded':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Approved': 'bg-green-100 text-green-800 border-green-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200',
      'Uploaded': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Requested': 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    );
  };

  const handleUpload = (documentName: string) => {
    // Placeholder for upload functionality
    console.log(`Uploading ${documentName}`);
    // You would implement actual file upload logic here
  };

  const pendingCount = documents.filter(doc => doc.status === 'Requested').length;
  const completedCount = documents.filter(doc => doc.status === 'Approved').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Required Documents</CardTitle>
          <div className="text-sm text-muted-foreground">
            {completedCount} of {documents.length} completed
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((document, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(document.status)}
                <div>
                  <h4 className="font-medium text-foreground">{document.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {document.status === 'Requested' && 'Upload required'}
                    {document.status === 'Uploaded' && 'Under review'}
                    {document.status === 'Approved' && 'Document approved'}
                    {document.status === 'Rejected' && 'Please resubmit'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(document.status)}
                
                {document.status === 'Requested' && (
                  <Button 
                    size="sm"
                    onClick={() => handleUpload(document.name)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                )}

                {document.status === 'Rejected' && (
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpload(document.name)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Re-upload
                  </Button>
                )}

                {(document.status === 'Uploaded' || document.status === 'Approved') && (
                  <Button size="sm" variant="ghost">
                    View
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {pendingCount > 0 && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <h4 className="font-medium text-yellow-800">Action Required</h4>
            </div>
            <p className="text-sm text-yellow-700">
              You have {pendingCount} document{pendingCount > 1 ? 's' : ''} pending upload. 
              Please upload the required documents to continue with your application.
            </p>
          </div>
        )}

        {documents.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Document Completion</span>
              <span>{Math.round((completedCount / documents.length) * 100)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / documents.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}