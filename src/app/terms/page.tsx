import { PageShell } from "@/components/common/page-shell";

export default function TermsPage() {
  return (
    <PageShell>
      <div className="container py-16 prose dark:prose-invert max-w-3xl mx-auto">
        <h1>Terms of Service</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          Welcome to ClipForge AI. These terms and conditions outline the rules
          and regulations for the use of our website and services.
        </p>
        <h2>1. Introduction</h2>
        <p>
          By accessing this website we assume you accept these terms and
          conditions. Do not continue to use ClipForge AI if you do not agree
          to take all of the terms and conditions stated on this page.
        </p>
        <h2>2. Intellectual Property Rights</h2>
        <p>
          Other than the content you own, under these Terms, ClipForge AI
          and/or its licensors own all the intellectual property rights and
          materials contained in this Website.
        </p>
        <h2>3. Restrictions</h2>
        <p>You are specifically restricted from all of the following:</p>
        <ul>
          <li>publishing any Website material in any other media;</li>
          <li>
            selling, sublicensing and/or otherwise commercializing any Website
            material;
          </li>
          <li>publicly performing and/or showing any Website material;</li>
        </ul>
        <p>This is a placeholder document. For a real application, consult with a legal professional.</p>
      </div>
    </PageShell>
  );
}
