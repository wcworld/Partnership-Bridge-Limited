import { CheckCircle, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ActionItem {
  id: number;
  text: string;
  completed?: boolean;
}

interface ActionItemsProps {
  actionItems: ActionItem[];
}

export function ActionItems({ actionItems: initialActionItems }: ActionItemsProps) {
  const [actionItems, setActionItems] = useState(
    initialActionItems.map(item => ({ ...item, completed: item.completed || false }))
  );

  const toggleComplete = (id: number) => {
    setActionItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
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
        <div className="space-y-4">
          {actionItems.map((item) => (
            <div 
              key={item.id} 
              className={`
                flex items-center gap-3 p-3 rounded-lg border transition-all
                ${item.completed 
                  ? 'bg-green-50 border-green-200 opacity-75' 
                  : 'bg-background border-border hover:bg-muted/50'
                }
              `}
            >
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-6 w-6"
                onClick={() => toggleComplete(item.id)}
              >
                {item.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
              
              <div className="flex-1">
                <p className={`
                  text-sm
                  ${item.completed 
                    ? 'text-green-700 line-through' 
                    : 'text-foreground'
                  }
                `}>
                  {item.text}
                </p>
              </div>

              {!item.completed && (
                <Button size="sm" variant="outline">
                  Start
                </Button>
              )}
            </div>
          ))}

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