import { PageShell } from '@/components/common/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <PageShell>
      <div className="container flex items-center justify-center py-24">
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Get started with ClipForge AI today.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button className="w-full">Create Account</Button>
                <p className="text-sm text-muted-foreground">Already have an account? <Link href="/login" className="text-primary hover:underline">Sign In</Link></p>
            </CardFooter>
        </Card>
      </div>
    </PageShell>
  );
}
