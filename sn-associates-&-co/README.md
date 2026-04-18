<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: <https://ai.studio/apps/drive/1PluB7mOg1_zcup1UBNtYbjrZTXyuDkRt>

## Deployment & Configuration

**IMPORTANT:** Before deploying, ensure the following are configured:

1. **Gemini API Key**: Set `GEMINI_API_KEY` in your environment variables for real-time news updates.
2. **Google Sheets Sync**:
   - Follow the instructions in [GOOGLE_SHEETS_SETUP.md](file:///c:/Users/CSC/.gemini/antigravity/brain/a5b0b3b7-cc0e-4851-be85-6f61cd96d8c0/GOOGLE_SHEETS_SETUP.md) (in artifacts folder).
   - Update `GOOGLE_SHEETS_URL` in `services/localDb.ts`.
3. **Resend Email**: Set `VITE_RESEND_API_KEY` for form notifications.

## Run Locally

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`
