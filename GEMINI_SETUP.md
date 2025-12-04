# GEMINI API KEY SETUP

To use the AI Supplement Analyzer feature, you need to add your Gemini API key to the .env.local file.

## Steps:

1. Get your Gemini API key from: https://makersuite.google.com/app/apikey

2. Add the following line to your `.env.local` file:

```
GEMINI_API_KEY=your_api_key_here
```

3. Restart your development server:

```bash
npm run dev
```

4. Navigate to the AI Supplement Analyzer by clicking the "AI Supplement Analizi" button in the trending section.

## Note:
The .env.local file is already in .gitignore, so your API key will not be committed to version control.
