
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, User, Calendar, Activity, Bot, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressRing } from '@/components/ui/progress-ring';

export const OpsMapCell: React.FC<{ai: number; human: number}> = ({ai,human}) => {

  return (
                  <table>
                    <tr>
                        <td>
                            <Bot/>
                        </td>
                        <td>
                            <User/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {ai}
                        </td>
                        <td>
                            {human}
                        </td>
                    </tr>
                  </table>
      );
};
