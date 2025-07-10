
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Send, X } from 'lucide-react';
import { AISuggestion } from '@/types';

interface EmailDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  suggestion: AISuggestion;
}

export const EmailDraftModal: React.FC<EmailDraftModalProps> = ({
  isOpen,
  onClose,
  clientName,
  suggestion
}) => {
  const generateEmailContent = () => {
    if (suggestion.message.includes('passport')) {
      return {
        subject: 'Request for Missing Passport - Account Opening',
        body: `Dear ${clientName},

To complete your account opening process, we need a clear, scanned copy of your government-issued passport.

Please upload this document at your earliest convenience through our secure portal, or email it directly to our operations team.

If you have any questions or need assistance with the upload process, please don't hesitate to reach out.

Best regards,
USPB Operations Team`
      };
    }
    
    return {
      subject: 'Document Request - Account Opening',
      body: `Dear ${clientName},

We are reviewing your account opening application and need additional documentation to proceed.

Please provide the requested documents at your earliest convenience.

Best regards,
USPB Operations Team`
    };
  };

  const emailTemplate = generateEmailContent();
  const [subject, setSubject] = useState(emailTemplate.subject);
  const [body, setBody] = useState(emailTemplate.body);

  const handleSend = () => {
    console.log('Sending email:', { subject, body, to: clientName });
    // In real app, this would send the email
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Draft Email - {clientName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Subject
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Message
            </label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="w-full"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSend}>
              <Send className="w-4 h-4 mr-2" />
              Send Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
