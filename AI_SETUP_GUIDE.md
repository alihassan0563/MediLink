# 🤖 AI Prescription Reader Setup Guide

## Step 1: Generate OpenAI API Key

1. **Visit OpenAI Platform**: Go to [https://platform.openai.com/](https://platform.openai.com/)
2. **Sign up/Login**: Create an account or log in
3. **Navigate to API Keys**: Click profile → "API Keys" or go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
4. **Create New Key**: Click "Create new secret key"
5. **Name it**: Give it a name like "MediLink Prescription Reader"
6. **Copy the key**: It starts with `sk-` - save it immediately!

## Step 2: Create Environment File

Create a `.env` file in the `pharmacy-backend` folder with this content:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/pharmacydb

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# OpenAI API Key (for AI prescription processing)
OPENAI_API_KEY=sk-your-actual-api-key-here

# Email Configuration (for notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Step 3: Install Dependencies

Run this command in the pharmacy-backend folder:

```bash
npm install multer openai sharp tesseract.js
```

## Step 4: Test the Feature

1. Start your backend server: `npm start`
2. Start your frontend: `npm run dev` (in pharmacy-frontend folder)
3. Go to the "Buy Medicine" page
4. Upload a prescription image
5. Watch the AI extract medicine information!

## Step 5: Troubleshooting

### If you get API errors:
- Check your API key is correct
- Ensure you have credits in your OpenAI account
- Check the console for detailed error messages

### If OCR doesn't work:
- Make sure the image is clear and readable
- Try with different image formats (JPG, PNG)
- Check that the text in the image is in English

### Fallback Mode:
- If OpenAI API is not available, the system will show sample medicines
- This ensures the feature always works, even without AI

## Cost Information

- OpenAI API costs approximately $0.001-0.002 per prescription processed
- Very affordable for most use cases
- You can set usage limits in your OpenAI account

## Security Notes

- Never commit your `.env` file to version control
- Keep your API key secure
- Consider using environment variables in production
