import { PageShell } from '@/components/common/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  return (
    <PageShell>
      <div className="container flex items-center justify-center py-24">
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>Have a question or feedback? We'd love to hear from you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Your Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" type="text" placeholder="e.g. Feature Request" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Your message..." />
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">Send Message</Button>
            </CardFooter>
        </Card>
      </div>
    </PageShell>
  );
}
