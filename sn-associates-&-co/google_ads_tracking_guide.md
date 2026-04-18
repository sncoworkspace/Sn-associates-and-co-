# Google Ads Conversion Tracking Guide

This guide covers how to set up Google Ads tracking for both **WordPress** (using the "WPCode / Insert Headers and Footers" plugin) and your **React** project.

---

## 🚀 Step 1: Add Google Ads Global Site Tag (gtag.js)

The Global Site Tag links your website to Google Ads.

### On WordPress

1. **Get your Tag:** In Google Ads, go to **Tools & Settings** > **Conversions** > **Settings** > **Google Tag**. Copy the code snippet starting with `<!-- Google tag (gtag.js) -->`.
2. **Install Plugin:** Install the **"WPCode – Insert Headers, Footers and Code Snippets"** plugin.
3. **Insert Code:**
   - Go to **Code Snippets** > **Header & Footer**.
   - Paste the code into the **Header** section.
   - Click **Save Changes**.

### On your React App

Open [index.html](file:///c:/Users/CSC/Documents/sn%20assocites/sn-associates-&-co/index.html) and add your Google Ads tag next to the existing GA4 tag.

```html
<!-- Google tag (gtag.js) - Google Ads: AW-XXXXXXXXX -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-XXXXXXXXX');
</script>
```

---

## ✅ Step 2: Track "Thank You" Page After Form Submission

This tracks a conversion when a user reaches a specific success page.

1. **Create Conversion Action:** In Google Ads, create a new conversion for **Website**.
2. **Choose Page Load:** Set the conversion to fire on a specific URL (e.g., `yoursite.com/thank-you`).
3. **WordPress Setup:**
   - Ensure you have a page titled "Thank You".
   - In Google Ads, under "Event Snippet", choose **Page Load**.
   - Use a plugin like **WPCode** to insert this specific snippet ONLY on the Thank You page (using the "Page-Specific Snippets" feature).

---

## 📞 Step 3: Track Phone Number Button Clicks

This tracks when someone clicks your "Call Us" button.

### Implementation

1. **Google Ads Setup:** Create a conversion action and select **Click** as the event type.
2. **Add Event Code:** Copy the event snippet. It looks like this:

   ```javascript
   gtag('event', 'conversion', {
       'send_to': 'AW-XXXXXXXXX/YYYYYYYYYYYY',
       'value': 1.0,
       'currency': 'INR'
   });
   ```

3. **Add to Button:**
   - **WordPress:** If using a button block, add a "Custom HTML" block or use a plugin to add an `onclick` attribute to your link:

     ```html
     <a href="tel:+917406581456" onclick="gtag('event', 'conversion', {'send_to': 'AW-XXXXXXXXX/YYYYYYYYYYYY'});">Call Now</a>
     ```

   - **React:** In [BookConsultation.tsx](file:///c:/Users/CSC/Documents/sn%20assocites/sn-associates-&-co/pages/BookConsultation.tsx), add the call to your button handler:

     ```tsx
     const handleCallClick = () => {
       if (window.gtag) {
         window.gtag('event', 'conversion', { 'send_to': 'AW-XXXXXXXXX/YYYY_CONVERSION_ID' });
       }
     };
     ```

---

## 🛡️ Step 4: How to Verify if it's Working

1. **Google Tag Assistant:**
   - Install the **Tag Assistant Companion** Chrome extension.
   - Go to your website and click the "Tag Assistant" icon.
   - Click **Enable** and refresh the page.
   - It will show a green/blue icon if the tag is found.
2. **Google Ads "Status":**
   - After 24-48 hours, check the Status column in Google Ads (Tools > Conversions). It should change from "Unverified" to "Recording conversions".
3. **Real-time Test:**
   - Submit your form or click your phone button.
   - Check the **Tag Assistant Debug** window to see if the "Conversion" event fired.

---

> [!TIP]
> **Pro Tip:** Always use the "Global Site Tag" (gtag.js) over older tracking methods as it's more reliable with modern browser privacy settings.
