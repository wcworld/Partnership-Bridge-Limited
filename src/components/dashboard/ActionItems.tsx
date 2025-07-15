import { CheckCircle, Circle, FileText, User, MessageSquare, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ActionItem {
  id: string;
  text: string;
  completed?: boolean;
  type: 'document' | 'profile' | 'application' | 'message';
  icon?: React.ComponentType<{ className?: string }>;
  priority: 'high' | 'medium' | 'low';
  action?: () => void;
}

interface ActionItemsProps {
  userId: string;
  applications: any[];
  profile: any;
  onActionClick?: (actionType: string, data?: any) => void;
}

export function ActionItems({ userId, applications, profile, onActionClick }: ActionItemsProps) {
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateActionItems();
  }, [userId, applications, profile]);

  const generateActionItems = async () => {
    setLoading(true);
    const items: ActionItem[] = [];

    try {
      // 1. Check for incomplete profile information
      if (!profile?.first_name || !profile?.last_name || !profile?.phone || !profile?.company_name) {
        items.push({
          id: 'complete-profile',
          text: 'Complete your profile information',
          type: 'profile',
          icon: User,
          priority: 'high',
          completed: false,
          action: () => onActionClick?.('profile')
        });
      }

      // 2. Check for missing documents in active applications
      if (applications && applications.length > 0) {
        for (const app of applications) {
          if (app.status !== 'rejected' && app.status !== 'funded') {
            const { data: documents } = await supabase
              .from('loan_documents')
              .select('*')
              .eq('loan_id', app.id)
              .eq('status', 'missing');

            if (documents && documents.length > 0) {
              items.push({
                id: `upload-docs-${app.id}`,
                text: `Upload ${documents.length} missing document${documents.length > 1 ? 's' : ''} for ${app.loan_type}`,
                type: 'document',
                icon: FileText,
                priority: 'high',
                completed: false,
                action: () => onActionClick?.('documents', app.id)
              });
            }

            // Check for documents needing reupload
            const { data: reuploadDocs } = await supabase
              .from('loan_documents')
              .select('*')
              .eq('loan_id', app.id)
              .eq('status', 'reupload_needed');

            if (reuploadDocs && reuploadDocs.length > 0) {
              items.push({
                id: `reupload-docs-${app.id}`,
                text: `Re-upload ${reuploadDocs.length} document${reuploadDocs.length > 1 ? 's' : ''} for ${app.loan_type}`,
                type: 'document',
                icon: FileText,
                priority: 'high',
                completed: false,
                action: () => onActionClick?.('documents', app.id)
              });
            }

            // Application-specific tasks based on stage
            if (app.status === 'submitted' && app.current_stage === 1) {
              items.push({
                id: `review-application-${app.id}`,
                text: `Review your submitted ${app.loan_type} application`,
                type: 'application',
                icon: Clock,
                priority: 'medium',
                completed: false,
                action: () => onActionClick?.('application', app.id)
              });
            }
          }
        }

        // 3. Check for unread messages
        const { data: unreadMessages } = await supabase
          .from('loan_messages')
          .select('id, loan_id')
          .eq('is_read', false)
          .neq('sender_id', userId);

        if (unreadMessages && unreadMessages.length > 0) {
          items.push({
            id: 'check-messages',
            text: `Check ${unreadMessages.length} new message${unreadMessages.length > 1 ? 's' : ''}`,
            type: 'message',
            icon: MessageSquare,
            priority: 'medium',
            completed: false,
            action: () => onActionClick?.('messages')
          });
        }
      }

      // Sort by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      items.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

      setActionItems(items);
    } catch (error) {
      console.error('Error generating action items:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = (id: string) => {
    setActionItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleActionClick = (item: ActionItem) => {
    if (item.action) {
      item.action();
    }
  };

  const completedCount = actionItems.filter(item => item.completed).length;
  const totalCount = actionItems.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your To-Do List</CardTitle>
          <div className="text-sm text-muted-foreground">
            {completedCount} of {totalCount} completed
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div className="h-5 w-5 bg-muted rounded-full animate-pulse" />
                <div className="flex-1 h-4 bg-muted rounded animate-pulse" />
                <div className="h-8 w-16 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {actionItems.map((item) => {
              const IconComponent = item.icon || Circle;
              const getPriorityColor = (priority: string) => {
                switch (priority) {
                  case 'high': return 'text-red-600 border-red-200 bg-red-50';
                  case 'medium': return 'text-orange-600 border-orange-200 bg-orange-50';
                  case 'low': return 'text-blue-600 border-blue-200 bg-blue-50';
                  default: return 'text-muted-foreground border-border bg-background';
                }
              };

              return (
                <div 
                  key={item.id} 
                  className={`
                    flex items-center gap-3 p-4 rounded-lg border transition-all cursor-pointer
                    ${item.completed 
                      ? 'bg-green-50 border-green-200 opacity-75' 
                      : `hover:bg-muted/50 ${item.priority === 'high' ? 'border-l-4 border-l-red-500' : 
                          item.priority === 'medium' ? 'border-l-4 border-l-orange-500' : 
                          'border-l-4 border-l-blue-500'}`
                    }
                  `}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-6 w-6 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(item.id);
                    }}
                  >
                    {item.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>

                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${getPriorityColor(item.priority)}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1">
                      <p className={`
                        text-sm font-medium
                        ${item.completed 
                          ? 'text-green-700 line-through' 
                          : 'text-foreground'
                        }
                      `}>
                        {item.text}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.type === 'document' && 'Documents'}
                        {item.type === 'profile' && 'Profile'}
                        {item.type === 'application' && 'Application'}
                        {item.type === 'message' && 'Messages'}
                        {' • '}
                        <span className={`font-medium ${
                          item.priority === 'high' ? 'text-red-600' :
                          item.priority === 'medium' ? 'text-orange-600' :
                          'text-blue-600'
                        }`}>
                          {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
                        </span>
                      </p>
                    </div>
                  </div>

                  {!item.completed && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActionClick(item);
                      }}
                      className="shrink-0"
                    >
                      Start
                    </Button>
                  )}
                </div>
              );
            })}

            {actionItems.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  All caught up!
                </h3>
                <p className="text-muted-foreground">
                  You have no pending action items.
                </p>
              </div>
            )}
          </div>
        )}

        {totalCount > 0 && (
          <div className="mt-6">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Completion Progress</span>
              <span>{Math.round((completedCount / totalCount) * 100)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}