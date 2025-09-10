# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Running the Application

To run this application, you'll need two separate terminal windows.

**In your first terminal, start the Next.js development server:**

```bash
npm run dev
```

This will make the web application available at `http://localhost:9002`.

**In your second terminal, start the Genkit AI flows:**

```bash
npm run genkit:watch
```

This starts the local Genkit server, which runs your AI flows. The web application will automatically connect to it.

Once both are running, you can open your browser to `http://localhost:9002` to use the app.