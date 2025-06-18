
"use client";

import PageTitle from '@/components/page-title';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PhoneCall, Globe, ShieldAlert, HeartHandshake } from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  description: string;
  phone?: string;
  website?: string;
  type: 'hotline' | 'resource' | 'local';
}

const indianHelplines: EmergencyContact[] = [
  {
    id: '1',
    name: 'Vandrevala Foundation',
    description: 'Mental health helpline providing free psychological counseling and crisis intervention.',
    phone: '1860-266-2345 / 1800-233-3330',
    website: 'https://www.vandrevalafoundation.com',
    type: 'hotline',
  },
  {
    id: '2',
    name: 'AASRA',
    description: '24/7 helpline for suicide prevention and emotional distress.',
    phone: '+91-9820466726',
    website: 'http://www.aasra.info',
    type: 'hotline',
  },
  {
    id: '3',
    name: 'KIRAN Helpline',
    description: 'Mental Health Rehabilitation Helpline by the Ministry of Social Justice and Empowerment, Govt. of India.',
    phone: '1800-599-0019',
    website: 'https://socialjustice.gov.in/kiran-mental-health-rehabilitation-helpline',
    type: 'hotline',
  },
  {
    id: '6',
    name: 'CHILDLINE India',
    description: 'National 24/7 helpline for children in distress. Emergency outreach service for children in need of care and protection.',
    phone: '1098',
    website: 'https://www.childlineindia.org.in',
    type: 'hotline',
  },
  {
    id: '4',
    name: 'NAMI (National Alliance on Mental Illness)',
    description: 'A global grassroots mental health organization dedicated to building better lives for people affected by mental illness. (Website for resources)',
    website: 'https://www.nami.org',
    type: 'resource',
  },
  {
    id: '5',
    name: 'Indian Emergency Services',
    description: 'For immediate life-threatening emergencies, please dial the national emergency helpline number.',
    phone: '112',
    type: 'local',
  },
];

export default function EmergencyContactsPage() {
  return (
    <div className="space-y-8">
      <PageTitle
        title="Emergency Contacts & Support"
        description="If you are in a crisis or need immediate support, please reach out to these resources. You are not alone."
      />

      <Card className="bg-destructive/10 border-destructive shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-destructive-foreground flex items-center">
            <ShieldAlert className="mr-2 h-6 w-6 text-destructive" />
            <span>Immediate Crisis Support</span>
          </CardTitle>
          <CardDescription className="text-destructive-foreground/80">
            If you or someone you know is in immediate danger, please call your local emergency number (e.g., 112 in India) or go to the nearest emergency room.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-primary flex items-center">
            <HeartHandshake className="mr-2 h-6 w-6" />
            <span>Indian Helplines & Resources</span>
          </CardTitle>
          <CardDescription>
            National helplines and resources available in India for mental health support and crisis intervention.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {indianHelplines.map((contact) => (
            <Card key={contact.id} className="shadow-md flex flex-col justify-between bg-background/50">
              <CardHeader>
                <CardTitle className="text-lg font-headline text-primary">{contact.name}</CardTitle>
                <CardDescription className="text-sm text-foreground/90">{contact.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex flex-col items-start space-y-2 pt-4">
                {contact.phone && (
                  <Button variant="outline" asChild className="w-full h-auto justify-start text-primary border-primary hover:bg-primary/10 whitespace-normal">
                    <a href={`tel:${contact.phone.replace(/\s|-|\//g,'')}`}> {/* Normalize phone number for tel link */}
                      <PhoneCall className="mr-2 h-4 w-4 flex-shrink-0" /> <span className="break-all">{contact.phone}</span>
                    </a>
                  </Button>
                )}
                {contact.website && (
                  <Button variant="outline" asChild className="w-full h-auto justify-start text-accent border-accent hover:bg-accent/10 whitespace-normal">
                    <a href={contact.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4 flex-shrink-0" /> <span className="break-all">{contact.website}</span>
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
