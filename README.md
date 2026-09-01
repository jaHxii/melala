# Scan & Pay

company.com.et

                              │

                 ┌────────────┴────────────┐

                 │                         │

              HOME                       QR CODES

                 │                    ┌────┴────┐

                 │                    │         │

                 │                  CAFE    RESTAURANT

                 │                    │         │

                 │                    ▼         ▼

                 │              /cafe       /restaurant

                 │                    │         │

                 │              [PAYMENT]  [PAYMENT]

                 │                    │         │

                 │                    └────┬────┘

                 │                         ▼

                 │                    /payment

                 │                         │

                 │                 ┌───────┼───────┐

                 │                 │       │       │

                 │                QR 1    QR 2    QR 3

                 │

          📍 Find Us

          📞 Call Us




Here is the updated master prompt you can use:




MASTER PROMPT — QR DIGITAL MENU + PAYMENT WEBSITE




Build a polished, production-quality, mobile-first digital menu website for a company that operates two separate food-service experiences:




- Cafe

- Restaurant




The system uses ONE ".com.et" domain.




The website has four main routes:




/

 /cafe

 /restaurant

 /payment




The website must follow the visual design of the supplied "design.png" extremely closely.




---




1. DESIGN REFERENCE — "design.png"




I will provide an image named:




"design.png"




This is the PRIMARY visual design reference.




Before implementing anything, deeply analyze the image.




Study:




- Layout

- Grid

- Spacing

- Typography

- Font hierarchy

- Font weights

- Letter spacing

- Colors

- Backgrounds

- Borders

- Corner radius

- Shadows

- Cards

- Buttons

- Icons

- Image treatment

- Header

- Footer

- Section spacing

- Mobile composition

- Desktop composition

- Overall visual personality




Recreate the same design language.




Do NOT use a generic restaurant template.




Do NOT introduce unrelated design trends.




Do NOT automatically add:




- Glassmorphism

- Huge gradients

- Excessive shadows

- Excessive rounded cards

- Random illustrations

- Random emojis

- Generic Bootstrap components




unless those elements are clearly consistent with "design.png".




The final website should look like it was designed using the same design system as "design.png".




---




2. WEBSITE ARCHITECTURE




Use one domain:




company.com.et




Routes:




company.com.et/

company.com.et/cafe

company.com.et/restaurant

company.com.et/payment




---




3. QR CODE ENTRY SYSTEM




There are two physical menu QR codes.




CAFE QR




https://company.com.et/cafe




Scanning this QR opens the Cafe menu directly.




RESTAURANT QR




https://company.com.et/restaurant




Scanning this QR opens the Restaurant menu directly.




There should be no intermediate page.




---




4. HOME PAGE




Route:




/




The Home page is a simple company landing page.




IMPORTANT:




DO NOT put Cafe Menu or Restaurant Menu buttons on the Home page.




Do NOT create:




- View Cafe Menu

- View Restaurant Menu

- Explore Menu

- Menu Selection

- Choose Your Menu




The menus are accessed through their physical QR codes.




The Home page should focus on the company/business identity.




Include:




Brand




- Company logo

- Company name

- Tagline

- Elegant introductory content




Find Us




Provide a clear:




Find Us




action.




It should open the company's exact Google Maps location.




Use this placeholder:




GOOGLE_MAPS_LINK_HERE




Call Us




Provide a:




Call Us




action.




Use:




tel:+251XXXXXXXXX




Make the action mobile-friendly.




Optional




Depending on the visual design of "design.png", include:




- Address

- Opening hours

- Social media

- Short description

- Minimal footer




Keep it elegant and simple.




---




5. CAFE MENU




Route:




/cafe




This page is accessed through the Cafe QR.




The customer should immediately see the Cafe menu.




There must be:




NO BACK BUTTON.




NO HOME BUTTON.




NO RESTAURANT BUTTON.




NO MENU SELECTION.




The Cafe page should behave as a standalone digital menu.




---




6. CAFE MENU CONTENT




I will provide an image containing the real Cafe menu.




Use that image as the source of truth.




Extract/recreate:




- Categories

- Item names

- Prices

- Descriptions

- Organization

- Relevant menu imagery




Do NOT invent Cafe menu items when the information can be read from the supplied image.




The final digital Cafe menu should preserve the character and organization of the original menu while making it easier to read on a phone.




Do not simply show the entire menu image as a tiny unreadable image.




Where possible, convert the menu into structured HTML components.




---




7. RESTAURANT MENU




Route:




/restaurant




This page is accessed through the Restaurant QR.




Again:




NO BACK BUTTON.




NO HOME BUTTON.




NO CAFE BUTTON.




It should be a standalone restaurant menu.




For now, use a simple mock restaurant menu.




Example categories:




STARTERS




MAIN COURSE




ETHIOPIAN SPECIALS




PIZZA




PASTA




BURGERS




SALADS




DESSERTS




DRINKS




Use realistic mock food names and ETB prices.




Structure the data so the mock content can easily be replaced later.




---




8. PAYMENT SYSTEM — IMPORTANT




Both the Cafe and Restaurant menus must have a Payment button.




This is the ONLY navigation intentionally shared between the two menu experiences.




The payment button should take the customer to:




/payment




Example:




Cafe Menu

      │

      ▼

  [ PAYMENT ]

      │

      ▼

 /payment




and:




Restaurant Menu

      │

      ▼

  [ PAYMENT ]

      │

      ▼

 /payment




---




9. PAYMENT PAGE




Route:




/payment




This page contains THREE payment QR codes.




For now, use mock QR-code images.




Do NOT generate real payment QR codes.




The QR images are only visual placeholders for the prototype.




The page should clearly communicate:




PAYMENT




or whatever payment title best matches "design.png".




Then display three payment methods.




Example:




PAYMENT




┌─────────────────────────┐

│                         │

│       MOCK QR #1        │

│                         │

│     Payment Method 1    │

│                         │

└─────────────────────────┘





┌─────────────────────────┐

│                         │

│       MOCK QR #2        │

│                         │

│     Payment Method 2    │

│                         │

└─────────────────────────┘





┌─────────────────────────┐

│                         │

│       MOCK QR #3        │

│                         │

│     Payment Method 3    │

│                         │

└─────────────────────────┘




However, DO NOT necessarily use this exact card layout.




The payment page must visually follow "design.png".




---




10. THREE PAYMENT QR CODES




Create three clearly distinguishable mock payment methods.




Use placeholder names such as:




Payment Method 1

Payment Method 2

Payment Method 3




OR, if the business context suggests specific Ethiopian payment services, structure the UI so their names can easily be replaced later.




Example data:




const paymentMethods = [

  {

    name: "Payment Method 1",

    qrImage: "/images/payment-1.png"

  },

  {

    name: "Payment Method 2",

    qrImage: "/images/payment-2.png"

  },

  {

    name: "Payment Method 3",

    qrImage: "/images/payment-3.png"

  }

];




Use three visually distinct mock QR images.




The QR codes do not need to actually process payments.




---




11. PAYMENT PAGE UX




The payment page must be extremely easy to use on a phone.




Customer flow:




Scan menu QR

       ↓

Cafe / Restaurant Menu

       ↓

Customer finishes choosing

       ↓

Taps PAYMENT

       ↓

Payment Page

       ↓

Sees 3 payment QR codes

       ↓

Chooses the appropriate payment method




The payment QR codes should be large enough to scan from another phone if necessary.




Avoid making the QR images tiny.




Maintain adequate whitespace around every QR code.




---




12. PAYMENT BUTTON




The Payment button should be visible on both menu pages.




Example:




[ PAYMENT ]




But style it according to "design.png".




It should not look like a generic Bootstrap button.




Use the reference design's:




- Shape

- Border

- Typography

- Spacing

- Hover state

- Active state

- Icon treatment




If "design.png" uses a minimal text-link style, use that instead.




---




13. PAYMENT PAGE NAVIGATION




The payment page is an exception to the "no navigation" rule.




The Cafe and Restaurant pages should have no back/home navigation.




However, once the customer is on:




/payment




provide a subtle way to return to the menu only if necessary and if it fits the reference design.




If a return action is included, it should ideally return the customer to the page they came from.




For example:




Cafe → Payment → Cafe




or




Restaurant → Payment → Restaurant




Do NOT add unnecessary navigation to the payment page.




Prefer a very minimal solution.




If technically appropriate, preserve the previous route using browser history.




---




14. PAYMENT PAGE MUST NOT BE ACCESSIBLE ONLY FROM ONE MENU




The route:




/payment




must work independently.




A user should be able to visit:




company.com.et/payment




directly.




Do not require the user to first visit "/cafe" or "/restaurant".




---




15. RESPONSIVE PAYMENT QR DESIGN




On mobile:




Use a single-column layout:




Payment Method 1

       QR




Payment Method 2

       QR




Payment Method 3

       QR




On larger screens, use the layout that best matches "design.png".




Possible:




QR 1     QR 2     QR 3




or another composition consistent with the reference.




Do not force three columns if that makes the QR codes too small.




QR readability has priority.




---




16. QR CODE IMAGE REQUIREMENTS




Use placeholder QR images that visually resemble real QR codes.




Each QR should:




- Have high contrast

- Be square

- Have adequate white quiet-zone around it

- Be large

- Remain sharp

- Maintain its aspect ratio

- Never be stretched




Use:




aspect-ratio: 1 / 1;




and appropriate responsive sizing.




Do not place text directly over the QR.




---




17. MENU PAGE PAYMENT CTA




Place the Payment action where it is easy to find without interrupting the menu.




Good positions may include:




- Header area

- Sticky bottom action

- End of menu

- Floating action




BUT choose the approach that best matches "design.png".




Do not blindly use a floating button.




The button must remain accessible while the user scrolls through a long menu if the reference design supports this.




---




18. MOBILE UX




This is a QR-first website.




Prioritize mobile.




Test visually for:




320px

360px

375px

390px

412px

430px




Ensure:




- No horizontal scrolling

- Large readable text

- Easy scrolling

- Large payment QR codes

- Clear prices

- Comfortable touch targets

- Fast loading

- No unnecessary popups

- No intrusive animations




---




19. DESKTOP UX




The website should also work beautifully on:




- Tablets

- Laptops

- Desktop




Do not stretch the menus unnecessarily.




Use a comfortable maximum content width.




The website should look intentionally designed at large resolutions.




---




20. COMPONENT ARCHITECTURE




Use reusable components.




Suggested:




src/

├── pages/

│   ├── Home.jsx

│   ├── CafeMenu.jsx

│   ├── RestaurantMenu.jsx

│   └── Payment.jsx

│

├── components/

│   ├── BrandHeader.jsx

│   ├── MenuSection.jsx

│   ├── MenuItem.jsx

│   ├── PaymentButton.jsx

│   ├── PaymentQR.jsx

│   ├── ContactActions.jsx

│   └── Footer.jsx

│

├── data/

│   ├── cafeMenu.js

│   ├── restaurantMenu.js

│   └── paymentMethods.js

│

└── assets/

    ├── design.png

    ├── cafe-menu.png

    ├── payment-1.png

    ├── payment-2.png

    └── payment-3.png




Adapt this architecture to the framework being used.




---




21. DATA-DRIVEN MENU




Do not hardcode every menu item directly inside the page component.




Use structured data.




Example:




const restaurantMenu = [

  {

    category: "Main Course",

    items: [

      {

        name: "Grilled Chicken",

        description: "Grilled chicken with...",

        price: 450

      }

    ]

  }

];




This allows the menu to be updated later without redesigning the page.




---




22. DATA-DRIVEN PAYMENT METHODS




Use:




const paymentMethods = [

  {

    name: "Payment Method 1",

    image: "/images/payment-1.png"

  },

  {

    name: "Payment Method 2",

    image: "/images/payment-2.png"

  },

  {

    name: "Payment Method 3",

    image: "/images/payment-3.png"

  }

];




Make replacing the QR images and names extremely easy.




---




23. DESIGN SYSTEM




Create reusable CSS variables based on "design.png".




Example:




:root {

  --background: ...;

  --foreground: ...;

  --primary: ...;

  --secondary: ...;

  --accent: ...;

  --muted: ...;

  --border: ...;

  --radius: ...;

}




Determine the actual values from the reference image.




Do not arbitrarily choose colors.




---




24. TYPOGRAPHY




Match "design.png".




Use the closest available web font.




Maintain a clear hierarchy:




Company Name

Page Title

Category

Menu Item

Description

Price

Secondary Information




Prices must be immediately visible.




Avoid unnecessarily tiny typography.




---




25. ACCESSIBILITY




Use:




- Semantic HTML

- Proper heading hierarchy

- Accessible buttons/links

- Alt text

- Keyboard accessibility

- Focus states

- Adequate contrast

- Large touch targets




Payment QR images should have useful alt text, e.g.:




Payment QR code for Payment Method 1




---




26. PERFORMANCE




Because users arrive through QR scanning, performance is extremely important.




Optimize:




- Images

- Fonts

- JavaScript

- CSS

- QR assets




Avoid unnecessarily large images.




Use lazy loading for below-the-fold content where appropriate.




The user should reach the menu quickly after scanning.




---




27. SEO




Home:




[Company Name] — Cafe & Restaurant




Cafe:




[Company Name] — Cafe Menu




Restaurant:




[Company Name] — Restaurant Menu




Payment:




[Company Name] — Payment




Include:




- Meta descriptions

- Favicon

- Open Graph metadata

- Semantic HTML




---




28. ROUTING BEHAVIOR




Verify all routes work directly:




/

 /cafe

 /restaurant

 /payment




This is particularly important because customers will access "/cafe" and "/restaurant" directly from QR codes.




If using React Router or another SPA routing system, configure deployment correctly so direct URL access does not produce a server 404.




---




29. FINAL NAVIGATION RULES




These rules are mandatory.




HOME




/




Allowed:




- Find Us

- Call Us

- Other minimal company information




NOT allowed:




- Cafe Menu button

- Restaurant Menu button

- Menu selection

- QR scanner




---




CAFE




/cafe




Allowed:




- Menu content

- Payment button




NOT allowed:




- Back button

- Home button

- Restaurant button

- Cafe/Restaurant menu selector




---




RESTAURANT




/restaurant




Allowed:




- Menu content

- Payment button




NOT allowed:




- Back button

- Home button

- Cafe button

- Cafe/Restaurant selector




---




PAYMENT




/payment




Contains:




- Payment title

- Three payment QR codes

- Three payment method names

- Minimal return behavior if appropriate




---




30. FINAL USER JOURNEYS




CUSTOMER 1 — CAFE




Physical Cafe QR

       ↓

company.com.et/cafe

       ↓

Cafe Menu

       ↓

[ PAYMENT ]

       ↓

company.com.et/payment

       ↓

3 Payment QR Codes




---




CUSTOMER 2 — RESTAURANT




Physical Restaurant QR

       ↓

company.com.et/restaurant

       ↓

Restaurant Menu

       ↓

[ PAYMENT ]

       ↓

company.com.et/payment

       ↓

3 Payment QR Codes




---




CUSTOMER 3 — COMPANY WEBSITE




company.com.et

       ↓

Company Home

       ↓

Find Us

       ↓

Google Maps




OR




Call Us

       ↓

Phone Dialer




The Home page does NOT send users to the menus.




---




31. FINAL VISUAL REQUIREMENT




The most important rule:




The final website must look like "design.png".




Use "design.png" as the visual source of truth.




Use the supplied Cafe menu image as the Cafe content source of truth.




Use mock content for the Restaurant.




Use mock QR images for the three payment methods.




Do not confuse these roles.




design.png

     ↓

VISUAL DESIGN




Cafe menu image

     ↓

CAFE CONTENT




Mock restaurant data

     ↓

RESTAURANT CONTENT




Mock QR images

     ↓

PAYMENT CONTENT




Build the result as a professional, production-quality QR digital menu system, not a generic demo.




The final experience should be:




Minimal + premium + fast + mobile-first + easy to scan + easy to read + visually faithful to the reference design.This gives you a very clean system: 2 physical menu QR codes → 2 independent menus → 1 shared payment page containing 3 payment QR codes, while the main domain remains a simple company landing page.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/281daf0b-815b-4945-b958-ae93ff4a563d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
