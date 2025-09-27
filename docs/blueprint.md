# **App Name**: AvatarForge AI

## Core Features:

- Image Upload & Preview: Allows users to upload a base character image (PNG/JPG, max 8MB, square recommended) to create talking-avatar videos, including client-side validations and previews.
- Character Selection: Provides a character dropdown menu with the options Kaira, Aisha, Mayra, and Bailey. Selecting an option shows a small avatar preview and a one-line persona blurb.
- Script Input: Features a large script input (multiline textarea) with character count, word count, and sample placeholder script, with script limits of 2-2,000 characters and real-time feedback.
- AI Video Generation: Uses AI tool for animating lip-sync of talking-avatar videos by synthesizing voice.
- Result Gallery: Displays a result gallery card with a video player (MP4) and companion files (.srt subtitles, .vtt, a poster image .png, and a JSON metadata file), each with individual download buttons.
- Download All: Offers a “Download All” button that zips outputs on the fly (client-side if small, or API route stub) for easy access to all generated files.
- Project Sharing: Includes copyable links for sharing projects.

## Style Guidelines:

- Primary color: Deep electric blue (#5674DF) for a modern, futuristic feel.
- Background color: Near-white (#F2F4F8) to provide a clean, unobtrusive backdrop that lets content pop.
- Accent color: Soft violet (#A274DF) to create visual interest in the buttons.
- Body and headline font: 'Inter' (sans-serif) for a modern, machined, objective look. A great match for the prompt, suitable for headlines and body text.
- Use 'lucide-react' icon set to match with Shadcn UI Kit. To give consistent look.
- Implement a consistent layout with shadcn/ui components, ensuring a clean and modern UI. Prioritize responsive design to support mobile to 1440px+ screens.
- Subtle animations with Framer Motion: fade/scale in, gentle parallax on hero, hover lift on cards, and delightful loading/progress animations. Adhere to prefers-reduced-motion support.