import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Eye, Download, CheckCircle, XCircle, Clock, Upload, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentWithApplication {
  id: string;
  document_name: string;
  document_type: string;
  status: string;
  file_path: string | null;
  uploaded_at: string | null;
  loan_id: string;
  application_reference: string;
  user_name: string;
  user_email: string;
}

export default function DocumentManager() {
  const [documents, setDocuments] = useState<DocumentWithApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<DocumentWithApplication | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, [statusFilter]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('loan_documents')
        .select(`
          id,
          document_name,
          document_type,
          status,
          file_path,
          uploaded_at,
          loan_id,
          loan_applications!inner(
            reference_number,
            user_id
          )
        `);

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query.order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: "Error",
          description: "Failed to fetch documents",
          variant: "destructive"
        });
        return;
      }

      // Transform the data and fetch profile info separately
      const transformedData: DocumentWithApplication[] = [];
      
      if (data) {
        // Get all unique user IDs
        const userIds = [...new Set(data.map((doc: any) => doc.loan_applications.user_id))];
        
        // Fetch profiles for these users
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name, email')
          .in('user_id', userIds);
        
        // Create a profile map for quick lookup
        const profileMap = new Map(
          profiles?.map(profile => [profile.user_id, profile]) || []
        );
        
        // Transform the documents with profile data
        data.forEach((doc: any) => {
          const profile = profileMap.get(doc.loan_applications.user_id);
          transformedData.push({
            id: doc.id,
            document_name: doc.document_name,
            document_type: doc.document_type,
            status: doc.status,
            file_path: doc.file_path,
            uploaded_at: doc.uploaded_at,
            loan_id: doc.loan_id,
            application_reference: doc.loan_applications.reference_number,
            user_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Unknown User',
            user_email: profile?.email || 'Unknown Email'
          });
        });
      }

      setDocuments(transformedData);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDocumentStatus = async (documentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('loan_documents')
        .update({ status: newStatus })
        .eq('id', documentId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update document status",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Document status updated successfully"
      });

      fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update document status",
        variant: "destructive"
      });
    }
  };

  const handleDownloadDocument = async (document: DocumentWithApplication) => {
    if (!document.file_path) {
      toast({
        title: "Error",
        description: "No file available for download",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to download document",
          variant: "destructive"
        });
        return;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.document_name;
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

  const handlePreviewDocument = async (document: DocumentWithApplication) => {
    if (!document.file_path) {
      toast({
        title: "Error",
        description: "No file available for preview",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(document.file_path);

      if (data?.publicUrl) {
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

  const handleDeleteDocument = async (document: DocumentWithApplication) => {
    try {
      // Delete the file from storage if it exists
      if (document.file_path) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([document.file_path]);

        if (storageError) {
          console.error('Error deleting file from storage:', storageError);
          // Continue with database deletion even if file deletion fails
        }
      }

      // Delete the document record from database
      const { error } = await supabase
        .from('loan_documents')
        .delete()
        .eq('id', document.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete document",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Document deleted successfully"
      });

      fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'reupload_needed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Upload className="h-4 w-4 text-gray-600" />;
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
      'missing': 'Missing'
    };

    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        {displayNames[status as keyof typeof displayNames] || status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Management
          </CardTitle>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Documents</SelectItem>
              <SelectItem value="missing">Missing</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="reupload_needed">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No documents found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Application</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(doc.status)}
                      <div>
                        <div className="font-medium">{doc.document_name}</div>
                        <div className="text-sm text-muted-foreground">{doc.document_type}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{doc.application_reference}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{doc.user_name}</div>
                      <div className="text-sm text-muted-foreground">{doc.user_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(doc.status)}
                  </TableCell>
                  <TableCell>
                    {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : 'Not uploaded'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {doc.file_path && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleDownloadDocument(doc)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handlePreviewDocument(doc)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedDocument(doc)}>
                            Manage
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Manage Document</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Document Status</label>
                              <Select 
                                value={doc.status} 
                                onValueChange={(value) => updateDocumentStatus(doc.id, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="missing">Missing</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="reupload_needed">Reupload Needed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${doc.document_name}"? This action cannot be undone.`)) {
                            handleDeleteDocument(doc);
                          }
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}