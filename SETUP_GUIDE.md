# Quick Setup Guide for Advanced Features

## Step 1: Run Database Migration

Open your terminal and run the SQL migration script:

```bash
# If using MySQL command line
mysql -u root -p betadrop < scripts/add-advanced-features.sql

# Or if using a different user
mysql -u your_username -p betadrop < scripts/add-advanced-features.sql
```

## Step 2: Add Gemini API Key

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your `.env.local` file:

```env
GEMINI_API_KEY=your_api_key_here
```

## Step 3: Install AI Package

```bash
npm install @google/generative-ai
```

## Step 4: Restart Development Server

```bash
npm run dev
```

## Step 5: Test the Features

1. **Sign in** to your account
2. **Upload a build** - Try the AI release notes generator
3. **Set expiry rules** - Test time/download/device limits
4. **Create share links** - Generate role-based links
5. **View analytics** - Check the analytics tab in build management

## Verification Checklist

- [ ] Database migration completed successfully
- [ ] Gemini API key configured
- [ ] AI package installed
- [ ] Development server running
- [ ] Upload page shows advanced options
- [ ] AI release notes generator works
- [ ] Build management shows new tabs
- [ ] Analytics tab displays data
- [ ] Share links can be created

## Troubleshooting

### Database Migration Fails
- Ensure MySQL is running
- Check database name is correct (`betadrop`)
- Verify user has CREATE/ALTER permissions

### AI Release Notes Not Working
- Verify `GEMINI_API_KEY` is set in `.env.local`
- Check API key is valid
- Restart development server after adding key

### TypeScript Errors
- Run `npm install` to ensure all types are updated
- Restart your IDE/editor

## Next Steps

After setup, explore:
1. Upload a build with custom branding
2. Set up different expiry rules
3. Create role-based share links
4. View detailed analytics
5. Test the QR code feature

For full documentation, see `ADVANCED_FEATURES.md`
