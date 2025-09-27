import { PageShell } from "@/components/common/page-shell";

export default function PrivacyPage() {
  return (
    <PageShell>
      <div className="container py-16 prose dark:prose-invert max-w-3xl mx-auto">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          Your privacy is important to us. It is ClipForge AI's policy to
          respect your privacy regarding any information we may collect from
          you across our website.
        </p>
        <h2>1. Information We Collect</h2>
        <p>
          We only ask for personal information when we truly need it to provide
          a service to you. We collect it by fair and lawful means, with your
          knowledge and consent.
        </p>
        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect in various ways, including to:
        </p>
        <ul>
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
        </ul>
        <p>This is a placeholder document. For a real application, consult with a legal professional.</p>
      </div>
    </PageShell>
  );
}
