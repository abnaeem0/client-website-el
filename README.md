# Embassy Lodge website

A portable static website. No build, server, subscriptions or API keys required.

## Preview on your computer

Extract this ZIP, then open `index.html` in Chrome. Keep `assets`, `styles.css` and `app.js` beside it. Analytics should be tested on the live HTTPS site, not a local file.

## Publish with GitHub Pages

1. Create or open your GitHub repository (a public repository supports Pages on GitHub Free).
2. Choose **Add file → Upload files**. Upload the extracted CONTENTS, not the ZIP or its outer folder. `index.html` must appear directly at the repository root, alongside `assets`, `app.js`, `styles.css` and `privacy.html`. Alternatively copy these files into your GitHub Desktop repository, commit and push.
3. Go to **Settings → Pages**.
4. Under Source choose **Deploy from a branch**, then **main** and **/(root)**. Save.
5. Open the published URL displayed there once deployment finishes.

Official guide: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

All asset links are relative, so this works under a repository URL and a custom domain. There is no dependency on ChatGPT hosting. A `.nojekyll` file is included; include it when copying with GitHub Desktop.

## Google Analytics

GA4 ID `G-K84HNTXJLX` is configured in `app.js`. It loads after a visitor allows analytics; declining keeps the tag unloaded. Visitors can change their choice from the footer. Ad personalisation and Google signals are disabled. No enquiry details are sent as custom event parameters.

Tracked custom events:
- `whatsapp_click`: the enquiry form opens WhatsApp
- `call_click`: a phone link is clicked
- `directions_click`: a Maps link is clicked
- `booking_platform_click`: Booking.com is opened
- `reviews_click`: the Google listing is opened from the review explanation
- `social_click`: Instagram is opened
- `explore_click`: the city guide is opened
- `gallery_open`: a gallery image is opened

Each has a `placement` parameter. A click is NOT a sent message, answered call or confirmed booking. Reception must record confirmed stays and their source.

After publishing:
1. Open the live site and allow analytics.
2. In your Analytics account, open this property's Realtime report. Check for your visit and a `call_click` or `directions_click` event (you do not need to complete a call).
3. Confirm that this property's Web data stream URL is your final website URL.
4. Optionally mark `whatsapp_click` and `call_click` as key events in Analytics, understanding these measure enquiry intent only. Create a custom dimension for `placement` if you want it in standard reports.
5. Keep Enhanced Measurement form interactions disabled: the custom event covers enquiries without collecting form inputs. Review other data-stream settings before launching ads.

A final live Analytics ingestion check has NOT been performed because the site is not yet hosted. Ad blockers and consent choices reduce measured traffic.

Campaign URL example: append `?utm_source=google&utm_medium=cpc&utm_campaign=f6_launch&utm_content=family` to your actual site URL. Use non-personal, letter/number/underscore/hyphen campaign labels. These standard parameters are preserved for Analytics attribution. The WhatsApp message contains `EL-WEB` as a consistent website reference. It does not carry a separate campaign code.

## Update content

- Copy, prices, FAQs, contact links: `index.html`.
- Calculator rates, WhatsApp number, gallery and Analytics ID: `app.js`.
- Colours, spacing, responsive layout: `styles.css`.
- Privacy wording: `privacy.html`.
- Photographs: `assets/` (20 optimised WebP images from your uploads).

Prices appear in both HTML and the calculator; update both together. Current formula: `(9000 + 1500 × (adults - 1 + children needing mattresses)) × 1.15`, multiplied by nights. Sharing children do not affect price. Family/interconnected room requests show “Ask for a quote” rather than incorrectly estimating several rooms as one. The form supports 1–2 adults and up to two child mattresses for a one-room estimate. Larger groups should contact reception by phone for a quote.

## Content notes

- Address, phone, prices, tax, amenities, breakfast, check-in/out and room arrangements are based on your confirmations.
- No invented reviews, ratings, availability claims or travel times.
- Google reviews include previous premises/marquee; this is explained in the FAQ.
- Payment/deposit/cancellation terms are left for reception to confirm.
- Facebook was omitted because no confirmed Facebook URL was supplied.
- The gallery includes representative room variations; exact rooms are confirmed before booking.
- Add a real breakfast photo when available.
- Once a final domain is known, add absolute canonical/Open Graph image URLs and a sitemap. None are guessed in this package.

## Validation

JavaScript syntax checked; local asset and anchor references checked. Desktop browser preview used to verify price updates (two nights, two adults, two mattresses = PKR 31,050) and expanding to 20 photos. CSS includes mobile breakpoints, accessible focus styles and reduced-motion support. Test the final hosted page on your own phone before starting the ad campaign.
