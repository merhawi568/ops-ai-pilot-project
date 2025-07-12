
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, User, Calendar, Activity, Bot, CheckCircle, ChevronDown, ChevronUp, OctagonAlert } from 'lucide-react';
import { useApplicationStore } from '@/store/useApplicationStore';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressRing } from '@/components/ui/progress-ring';
import {OpsMapCell} from './OpsMapCell'
import { SystemInsightsModal } from '@/components/SystemInsightsModal';


export const OpsMap: React.FC = () => {

  const [opsMapData,setOpsMapData] = useState(
    [
        {
            intent:'Credit Card Processing',
            color:'teal',
            workflow: [
                {
                    label:'Collect Data',
                    human: 10,
                    ai:15,
                    color:'bg-teal-100',
               },
                {
                    label:'Verify Data',
                    human: 20,
                    ai:25,
                    color:'bg-teal-200',
                },
                {
                    label:'Finalize Data',
                    human: 5,
                    ai:15,
                    color:'bg-teal-300',
                },
                {
                    label:'Completion',
                    human: 10,
                    ai:35,
                    color:'bg-teal-400',
                },
            ]
        },
        {
            intent:'Trust Onboarding',
            color:'teal',
            workflow: [
                {
                    label:'Collect Data',
                    human: 10,
                    ai:15,
                    color:'bg-blue-100',
                },
                {
                    label:'Verify Data',
                    human: 20,
                    ai:25,
                    color:'bg-blue-200',
                },
                {
                    label:'Finalize Data',
                    human: 5,
                    ai:15,
                    color:'bg-blue-300',
                },
                {
                    label:'Completion',
                    human: 10,
                    ai:35,
                    color:'bg-blue-400',
                },
            ]
        },
        {
            intent:'Intent 3...',
            color:'teal',
            workflow: [
                {
                    label:'Collect Data',
                    human: 10,
                    ai:15,
                    color:'bg-green-100'
                },
                {
                    label:'Verify Data',
                    human: 20,
                    ai:25,
                    color:'bg-green-200'
                },
                {
                    label:'Finalize Data',
                    human: 5,
                    ai:15,
                    color:'bg-green-300'
                },
                {
                    label:'Completion',
                    human: 10,
                    ai:35,
                    color:'bg-green-400'
                },
            ]
        },
        {
            intent:'Intent 4...',
            color:'teal',
            workflow: [
                {
                    label:'Collect Data',
                    human: 10,
                    ai:15,
                    color:'bg-yellow-100'
                },
                {
                    label:'Verify Data',
                    human: 20,
                    ai:25,
                    color:'bg-yellow-200'
                },
                {
                    label:'Finalize Data',
                    human: 5,
                    ai:15,
                    color:'bg-yellow-300'
                },
                {
                    label:'Completion',
                    human: 10,
                    ai:35,
                    color:'bg-yellow-400'
                },
            ]
        },
        {
            intent:'Intent 5...',
            color:'teal',
            workflow: [
                {
                    label:'Collect Data',
                    human: 10,
                    ai:15,
                    color:'bg-red-50'
                },
                {
                    label:'Verify Data',
                    human: 20,
                    ai:25,
                    color:'bg-red-100'
                },
                {
                    label:'Finalize Data',
                    human: 5,
                    ai:15,
                    color:'bg-red-200'
                },
                {
                    label:'Completion',
                    human: 10,
                    ai:35,
                    color:'bg-red-300'
                },
            ]
        },
        {
            intent:'Intent 6...',
            color:'teal',
            workflow: [
                {
                    label:'Collect Data',
                    human: 10,
                    ai:15,
                    color:'bg-emerald-50'
                },
                {
                    label:'Verify Data',
                    human: 20,
                    ai:25,
                    color:'bg-emerald-100'
                },
                {
                    label:'Finalize Data',
                    human: 5,
                    ai:15,
                    color:'bg-emerald-200'
                },
                {
                    label:'Completion',
                    human: 10,
                    ai:35,
                    color:'bg-emerald-300'
                },
            ]
        },
        {
            intent:'Intent 7...',
            color:'teal',
            workflow: [
                {
                    label:'Collect Data',
                    human: 10,
                    ai:15,
                    color:'bg-sky-50'
                },
                {
                    label:'Verify Data',
                    human: 20,
                    ai:25,
                    color:'bg-sky-100'
                },
                {
                    label:'Finalize Data',
                    human: 5,
                    ai:15,
                    color:'bg-sky-200'
                },
                {
                    label:'Completion',
                    human: 10,
                    ai:35,
                    color:'bg-sky-300'
                }
            ]
        }

    ]

  )

  return (
       <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 text-sm font-medium text-black-600">Intent</th>
                <th className="pb-3 text-sm font-medium text-black-600" colspan='5'>
                    <table cellSpacing='10' cellPadding='5'>
                        <tr>
                            <td>Exceptions</td>
                            <td className='bg-red-700 text-white rounded-full cursor-pointer' >&nbsp;&nbsp;13&nbsp;&nbsp;</td>
                        </tr>
                    </table>
              </th>
              </tr>
            </thead>
            <tbody>
            <tr>
                <td className="w-[200px] pb-3 text-sm font-medium text-gray-600 py-2"></td>
                <td className={'w-[150px] pb-3 text-sm font-medium text-gray-600  py-2'}>Collect Data</td>
                <td className={'w-[150px] pb-3 text-sm font-medium text-gray-600  py-2'}>Verify Data</td>
                <td className={'w-[150px] pb-3 text-sm font-medium text-gray-600 py-2'}>Finalize Data</td>
                <td className={'w-[150px] pb-3 text-sm font-medium text-gray-600 py-2'}>Completion</td>
            </tr>
            {opsMapData.map((data,index) =>
            (
                <tr key={index}>
                    <td className="w-[200px] pb-3 text-sm font-medium text-gray-600 py-2">{data.intent}</td>
                    <td className={'w-[150px] justify-center  text-center pb-3 text-sm font-medium text-gray-600 py-2 ' + data.workflow[0].color}><OpsMapCell ai={data.workflow[0].ai} human={data.workflow[0].human}/></td>
                    <td className={'w-[150px] text-center pb-3 text-sm font-medium text-gray-600 py-2 ' + data.workflow[1].color}><OpsMapCell ai={data.workflow[1].ai} human={data.workflow[1].human}/></td>
                    <td className={'w-[150px] text-center pb-3 text-sm font-medium text-gray-600 py-2 ' + data.workflow[2].color}><OpsMapCell ai={data.workflow[2].ai} human={data.workflow[2].human}/></td>
                    <td className={'w-[150px] text-center pb-3 text-sm font-medium text-gray-600 py-2 ' + data.workflow[3].color}><OpsMapCell ai={data.workflow[3].ai} human={data.workflow[3].human}/></td>
                </tr>
            ))

            }
            </tbody>
          </table>
        </div>
      );
};
