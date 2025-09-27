import { PageShell } from '@/components/common/page-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
  return (
    <PageShell>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="brand">Brand Kit</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card>
              <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Manage your profile settings.</CardDescription></CardHeader>
              <CardContent><p>Profile settings will be available here.</p></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="api">
            <Card>
              <CardHeader><CardTitle>API Keys</CardTitle><CardDescription>Manage your API keys.</CardDescription></CardHeader>
              <CardContent><p>API key management will be available here.</p></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="brand">
            <Card>
              <CardHeader><CardTitle>Brand Kit</CardTitle><CardDescription>Manage your brand assets.</CardDescription></CardHeader>
              <CardContent><p>Brand kit management will be available here.</p></CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
