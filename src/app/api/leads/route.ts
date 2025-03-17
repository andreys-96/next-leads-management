import { NextResponse } from 'next/server';

interface Lead {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  linkedinProfile: string | null;
  visasOfInterest: string[];
  additionalInfo: string | null;
  status: 'PENDING' | 'REACHED_OUT';
  createdAt: string;
  resumeFileName?: string;
  resumeSize?: number;
  resumeType?: string;
}

// This would typically be replaced with a database connection
let leads: Lead[] = [];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const lead: Lead = {
      id: Date.now(),
      firstName: formData.get('firstName')?.toString() || null,
      lastName: formData.get('lastName')?.toString() || null,
      email: formData.get('email')?.toString() || null,
      linkedinProfile: formData.get('linkedinProfile')?.toString() || null,
      visasOfInterest: JSON.parse(formData.get('visasOfInterest') as string),
      additionalInfo: formData.get('additionalInfo')?.toString() || null,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    // Handle file upload - in a real application, you would upload this to a storage service
    const resume = formData.get('resume') as File;
    if (resume) {
      lead.resumeFileName = resume.name;
      lead.resumeSize = resume.size;
      lead.resumeType = resume.type;
    }

    // Store the lead (in memory for now)
    leads.push(lead);

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error('Error processing lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process lead' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // In a real application, this would be protected by authentication
  return NextResponse.json({ leads });
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    const leadIndex = leads.findIndex(lead => lead.id === id);
    
    if (leadIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    if (status !== 'REACHED_OUT') {
      return NextResponse.json(
        { success: false, error: 'Invalid status transition' },
        { status: 400 }
      );
    }

    leads[leadIndex] = {
      ...leads[leadIndex],
      status,
    };

    return NextResponse.json({ success: true, lead: leads[leadIndex] });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update lead' },
      { status: 500 }
    );
  }
} 