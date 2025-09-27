import { PageShell } from '@/components/common/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const plans = [
    { name: "Free", price: "$0", features: ["2 generations per month", "720p resolution", "Basic characters"] },
    { name: "Pro", price: "$29", features: ["50 generations per month", "1080p resolution", "All characters", "Custom uploads"], popular: true },
    { name: "Team", price: "$99", features: ["Unlimited generations", "4K resolution", "Brand kit", "API access"], },
]

export default function BillingPage() {
  return (
    <PageShell>
      <div className="container py-16 lg:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Pricing</h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Choose the plan that's right for you.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {plans.map(plan => (
                <Card key={plan.name} className={plan.popular ? "border-primary shadow-2xl" : ""}>
                    <CardHeader>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.price}<span className="text-sm text-muted-foreground">/mo</span></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {plan.features.map(feature => (
                                <li key={feature} className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant={plan.popular ? "default" : "outline"}>Get Started</Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
      </div>
    </PageShell>
  );
}
