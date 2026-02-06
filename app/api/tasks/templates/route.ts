import { NextResponse } from 'next/server';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Template {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  checklist: ChecklistItem[];
}

const templates: Template[] = [
  {
    id: 'new-deal-intake',
    name: 'New Deal Intake',
    description: 'Initial intake process for new merchant deals',
    priority: 'high',
    tags: ['intake', 'new-deal'],
    checklist: [
      { id: 'ndi-1', text: 'Collect merchant application', completed: false },
      { id: 'ndi-2', text: 'Verify business information', completed: false },
      { id: 'ndi-3', text: 'Pull bank statements (last 3 months)', completed: false },
      { id: 'ndi-4', text: 'Check credit score', completed: false },
      { id: 'ndi-5', text: 'Calculate average daily balance', completed: false },
      { id: 'ndi-6', text: 'Review existing MCA positions', completed: false },
    ],
  },
  {
    id: 'submission-package',
    name: 'Submission Package',
    description: 'Prepare and compile submission package for funders',
    priority: 'high',
    tags: ['submission', 'packaging'],
    checklist: [
      { id: 'sp-1', text: 'Prepare submission summary', completed: false },
      { id: 'sp-2', text: 'Compile bank statements', completed: false },
      { id: 'sp-3', text: 'Include merchant application', completed: false },
      { id: 'sp-4', text: 'Add voided check', completed: false },
      { id: 'sp-5', text: 'Attach tax returns if required', completed: false },
      { id: 'sp-6', text: 'Review for completeness', completed: false },
      { id: 'sp-7', text: 'Submit to funder portal', completed: false },
    ],
  },
  {
    id: 'underwriting-review',
    name: 'Underwriting Review',
    description: 'Comprehensive underwriting review and analysis',
    priority: 'urgent',
    tags: ['underwriting', 'review'],
    checklist: [
      { id: 'ur-1', text: 'Analyze revenue trends', completed: false },
      { id: 'ur-2', text: 'Calculate debt service coverage', completed: false },
      { id: 'ur-3', text: 'Review existing positions/stacking', completed: false },
      { id: 'ur-4', text: 'Verify industry risk level', completed: false },
      { id: 'ur-5', text: 'Check negative days count', completed: false },
      { id: 'ur-6', text: 'Assess NSF frequency', completed: false },
      { id: 'ur-7', text: 'Prepare risk assessment summary', completed: false },
    ],
  },
  {
    id: 'offer-negotiation',
    name: 'Offer Negotiation',
    description: 'Review and negotiate funding offers with merchants',
    priority: 'medium',
    tags: ['offers', 'negotiation'],
    checklist: [
      { id: 'on-1', text: 'Compare funder offers', completed: false },
      { id: 'on-2', text: 'Calculate effective rates', completed: false },
      { id: 'on-3', text: 'Review buyback provisions', completed: false },
      { id: 'on-4', text: 'Confirm funding timeline', completed: false },
      { id: 'on-5', text: 'Present options to merchant', completed: false },
      { id: 'on-6', text: 'Negotiate terms if needed', completed: false },
    ],
  },
  {
    id: 'funding-closing',
    name: 'Funding & Closing',
    description: 'Process funding and closing procedures',
    priority: 'high',
    tags: ['funding', 'closing'],
    checklist: [
      { id: 'fc-1', text: 'Confirm offer acceptance', completed: false },
      { id: 'fc-2', text: 'Verify contract terms', completed: false },
      { id: 'fc-3', text: 'Process contract signing', completed: false },
      { id: 'fc-4', text: 'Confirm bank account for funding', completed: false },
      { id: 'fc-5', text: 'Verify funding amount', completed: false },
      { id: 'fc-6', text: 'Send funding confirmation to merchant', completed: false },
      { id: 'fc-7', text: 'Set up renewal calendar reminder', completed: false },
    ],
  },
  {
    id: 'renewal-follow-up',
    name: 'Renewal Follow-up',
    description: 'Follow up on renewal eligibility and submissions',
    priority: 'medium',
    tags: ['renewal', 'follow-up'],
    checklist: [
      { id: 'rf-1', text: 'Check renewal eligibility date', completed: false },
      { id: 'rf-2', text: 'Pull updated bank statements', completed: false },
      { id: 'rf-3', text: 'Review payment performance', completed: false },
      { id: 'rf-4', text: 'Assess additional funding capacity', completed: false },
      { id: 'rf-5', text: 'Contact merchant for renewal interest', completed: false },
      { id: 'rf-6', text: 'Prepare renewal submission', completed: false },
    ],
  },
];

export async function GET() {
  return NextResponse.json({ templates });
}
