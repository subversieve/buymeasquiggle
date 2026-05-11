# buymeasquiggle.xyz

Landing page for the Buy Me A Squiggle on-chain crowdfund.

## What's in this folder

```
buymeasquiggle/
├── app/
│   ├── layout.js       ← site-wide metadata, fonts, favicon
│   └── page.js         ← the actual page (squiggle, mint UI, marquee, nav)
├── public/
│   └── favicon.svg     ← tab icon (mini squiggle)
├── package.json        ← dependencies
├── next.config.js
└── .gitignore
```

---

## Part 1 — Get the site live (no terminal required)

You can do everything in the browser through GitHub's web UI.

### Step 1: Create a GitHub repo

1. Go to **github.com/new**
2. Repository name: `buymeasquiggle`
3. Set it to **Public** (Vercel free tier prefers public, and there's nothing secret here)
4. Don't check "Add a README" — we have our own
5. Click **Create repository**

### Step 2: Upload these files

On the new empty repo page, click **"uploading an existing file"** (it's a small link in the middle of the page).

Then drag this entire folder's contents into the upload box. **Important: drag the contents, not the parent folder.** You should see `app/`, `public/`, `package.json`, etc. at the top level — not a `buymeasquiggle/` folder containing them.

Scroll down, click **Commit changes**.

### Step 3: Deploy to Vercel

1. Go to **vercel.com/new**
2. You should see your `buymeasquiggle` repo in the list — click **Import**
3. Leave all the defaults alone (Vercel auto-detects Next.js)
4. Click **Deploy**

Wait about 60 seconds. Vercel will give you a URL like `buymeasquiggle-xxx.vercel.app`. Open it — your site is live.

### Step 4: Connect your domain

In your Vercel project dashboard:

1. Click **Settings** → **Domains**
2. Type `buymeasquiggle.xyz` and click **Add**
3. Vercel will show you DNS records to add — usually one **A record** pointing to `76.76.21.21` and one **CNAME** for `www`

In a new tab, go to **name.com**:

1. Sign in → click your domain `buymeasquiggle.xyz`
2. Click **DNS Records** (or **Manage DNS**)
3. Delete any existing A or CNAME records pointing to a parking page
4. Add the records Vercel showed you:
   - Type: **A**, Host: leave blank (or `@`), Answer: `76.76.21.21`, TTL: 300
   - Type: **CNAME**, Host: `www`, Answer: `cname.vercel-dns.com`, TTL: 300
5. Save

Go back to Vercel — within 5-15 minutes it'll say "Valid Configuration" with a green check. SSL is automatic.

Visit **buymeasquiggle.xyz**. Done.

---

## Part 2 — Editing the site later

Two ways:

**Easy way (browser only):** Edit files directly on GitHub. Click any file → pencil icon → make changes → "Commit changes." Vercel auto-redeploys in ~1 minute.

**Real way (when you want to develop locally):** Install Node.js (nodejs.org, LTS version), then in a terminal:

```
git clone https://github.com/YOUR-USERNAME/buymeasquiggle.git
cd buymeasquiggle
npm install
npm run dev
```

Open `http://localhost:3000`. Edit files, see changes instantly. `git push` to deploy.

---

## What's next (the actual mint)

Right now this is a beautiful demo — the MINT button just shows an animation, no blockchain. Real launch needs:

- **Smart contract** (Solidity) — escrow + refund logic
- **Wallet connection** — wagmi + RainbowKit
- **On-chain reads** — pull raised / patrons from the contract instead of hardcoded values
- **Generative art** — unique squiggle per token, deterministic from token ID

Ping me when you're ready for any of these.

---

## Demo state (what to change later)

In `app/page.js`, near the top, you'll find:

```js
const GOAL_ETH = 2.8;
const RAISED_ETH = 1.6234;
const PATRONS = 142;
const POINTS_TOTAL = 720;
```

These are placeholder numbers for the demo. Once the contract is live, these become real reads from the chain. For the demo / pre-launch landing page, you can tweak them to whatever looks right.
