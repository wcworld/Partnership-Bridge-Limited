import { Upload, Check, Clock, X, FileText, Eye, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Document {
  name: string;
  status: 'missing' | 'processing' | 'approved' | 'reupload_needed';
  document_type: string;
}

interface DocumentUploaderProps {
  documents: Document[];
  loanId: string;
  onDocumentUploaded?: () => void;
}

export function DocumentUploader({ documents, loanId, onDocumentUploaded }: DocumentUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const { toast } = useToast();
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'reupload_needed':
        return <X className="h-4 w-4 text-red-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'approved': 'bg-green-100 text-green-800 border-green-200',
      'reupload_needed': 'bg-red-100 text-red-800 border-red-200',
      'processing': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'missing': 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const displayNames = {
      'approved': 'Approved',
      'reupload_needed': 'Rejected',
      'processing': 'Processing',
      'missing': 'Required'
    };

    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        {displayNames[status as keyof typeof displayNames] || status}
      </Badge>
    );
  };

  const handleUpload = (document: Document) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('data-document-type', document.document_type);
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const documentType = event.target.getAttribute('data-document-type');
    
    if (!file || !documentType) return;

    setUploadingDoc(documentType);

    try {
      console.log('Starting document upload for:', documentType);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: "Error", description: "Please sign in to upload documents", variant: "destructive" });
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('loanId', loanId);
      formData.append('documentType', documentType);

      console.log('Calling upload-document function with:', { 
        fileName: file.name, 
        loanId, 
        documentType 
      });

      const { data, error } = await supabase.functions.invoke('upload-document', {
        body: formData,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      console.log('Upload response:', { data, error });

      if (error) {
        throw error;
      }

      if (data?.success) {
        toast({ title: "Success", description: "Document uploaded successfully" });
        onDocumentUploaded?.();
      } else {
        throw new Error(data?.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to upload document",
        variant: "destructive" 
      });
    } finally {
      setUploadingDoc(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleViewDocument = async (document: Document) => {
    try {
      // For now, since we're using simulated file paths, show document info
      // In a real implementation, you would fetch the actual file from storage
      console.log('Viewing document:', document);
      toast({ 
        title: "Document Info", 
        description: `${document.name} (${document.document_type}) - ${document.status}` 
      });
    } catch (error) {
      console.error('Error viewing document:', error);
      toast({
        title: "Error",
        description: "Failed to view document",
        variant: "destructive"
      });
    }
  };

  const pendingCount = documents.filter(doc => doc.status === 'missing').length;
  const completedCount = documents.filter(doc => doc.status === 'approved').length;

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
                    {document.status === 'missing' && 'Upload required'}
                    {document.status === 'processing' && 'Under review'}
                    {document.status === 'approved' && 'Document approved'}
                    {document.status === 'reupload_needed' && 'Please resubmit'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(document.status)}
                
                {document.status === 'missing' && (
                  <Button 
                    size="sm"
                    onClick={() => handleUpload(document)}
                    disabled={uploadingDoc === document.document_type}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingDoc === document.document_type ? 'Uploading...' : 'Upload'}
                  </Button>
                )}

                {document.status === 'reupload_needed' && (
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpload(document)}
                    disabled={uploadingDoc === document.document_type}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingDoc === document.document_type ? 'Uploading...' : 'Re-upload'}
                  </Button>
                )}

                {(document.status === 'processing' || document.status === 'approved') && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DocumentViewDialog document={document} loanId={loanId} />
                  </Dialog>
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
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
      />
    </Card>
  );
}

// Document View Dialog Component
function DocumentViewDialog({ document, loanId }: { document: Document; loanId: string }) {
  const { toast } = useToast();

  const handleDownloadDocument = async (document: Document) => {
    try {
      // Get the file path from the database  
      const { data: docData, error } = await supabase
        .from('loan_documents')
        .select('file_path')
        .eq('document_type', document.document_type)
        .eq('loan_id', loanId)
        .maybeSingle();

      if (error) {
        console.error('Database error:', error);
        toast({ 
          title: "Error", 
          description: "Database error occurred", 
          variant: "destructive" 
        });
        return;
      }

      if (!docData?.file_path) {
        toast({ 
          title: "Error", 
          description: "Document file not found", 
          variant: "destructive" 
        });
        return;
      }

      // Download the file from Supabase storage
      const { data, error: downloadError } = await supabase.storage
        .from('documents')
        .download(docData.file_path);

      if (downloadError) {
        console.error('Download error:', downloadError);
        toast({ 
          title: "Error", 
          description: "Failed to download document", 
          variant: "destructive" 
        });
        return;
      }

      // Create a download link
      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({ 
        title: "Success", 
        description: "Document downloaded successfully" 
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({ 
        title: "Error", 
        description: "Failed to download document", 
        variant: "destructive" 
      });
    }
  };

  const handlePreviewDocument = async (document: Document) => {
    try {
      // Get the file path from the database
      const { data: docData, error } = await supabase
        .from('loan_documents')
        .select('file_path')
        .eq('document_type', document.document_type)
        .eq('loan_id', loanId)
        .maybeSingle();

      if (error) {
        console.error('Database error:', error);
        toast({ 
          title: "Error", 
          description: "Database error occurred", 
          variant: "destructive" 
        });
        return;
      }

      if (!docData?.file_path) {
        toast({ 
          title: "Error", 
          description: "Document file not found", 
          variant: "destructive" 
        });
        return;
      }

      // Get the public URL for the document
      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(docData.file_path);

      if (data?.publicUrl) {
        // Open in new tab for preview
        window.open(data.publicUrl, '_blank');
      } else {
        toast({ 
          title: "Error", 
          description: "Failed to generate preview URL", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Preview error:', error);
      toast({ 
        title: "Error", 
        description: "Failed to preview document", 
        variant: "destructive" 
      });
    }
  };
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Document Details
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Document Name</label>
              <p className="font-medium">{document.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Document Type</label>
              <p className="font-medium">{document.document_type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge variant={
                  document.status === 'approved' ? 'default' :
                  document.status === 'processing' ? 'secondary' :
                  document.status === 'reupload_needed' ? 'destructive' : 'outline'
                }>
                  {document.status === 'approved' ? 'Approved' :
                   document.status === 'processing' ? 'Processing' :
                   document.status === 'reupload_needed' ? 'Reupload Needed' :
                   document.status === 'missing' ? 'Required' : document.status}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Upload Date</label>
              <p className="font-medium">
                {document.status === 'processing' || document.status === 'approved' ? 
                  new Date().toLocaleDateString() : 'Not uploaded yet'}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Document Actions</h4>
          <div className="flex gap-2">
            {(document.status === 'processing' || document.status === 'approved') && (
              <>
                <Button size="sm" variant="outline" onClick={() => handleDownloadDocument(document)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button size="sm" variant="outline" onClick={() => handlePreviewDocument(document)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </>
            )}
            {document.status === 'missing' && (
              <p className="text-sm text-muted-foreground">
                Please upload this document to view its details.
              </p>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Document Status Information</h4>
              <p className="text-sm text-blue-700">
                {document.status === 'approved' && 'This document has been reviewed and approved by our team.'}
                {document.status === 'processing' && 'This document is currently being reviewed by our team.'}
                {document.status === 'reupload_needed' && 'This document needs to be re-uploaded. Please check the requirements.'}
                {document.status === 'missing' && 'This document is required for your application.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}