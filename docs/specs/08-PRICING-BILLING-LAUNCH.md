# 08 - Pricing, Billing, and Launch Roadmap

**Product:** AI Video Studio Commercial Strategy  
**Billing Engine:** Stripe Subscriptions & Checkout  
**Pricing Currency:** Render Credits (1 Credit = 1 Minute of 1080p Master Render).

---

## 1. The Credit Model

Because video rendering, Whisper transcription, and AI generation incur real, variable compute and API costs, AI Video Studio uses a consumption-backed credit economy rather than a deceptive flat-rate or one-time license:

- **1 Credit = Exactly 1 Minute of Finished 1080p Master Video.**
  - A 3-minute video requires 3 credits.
  - An 8-minute video requires 8 credits.
- **540p Fast Previews are Free:**
  - Users can generate unlimited 540p previews to review edits before committing credits to a master render.
- **Atomic Hold and Capture:**
  - Credits are placed on `hold` when a 1080p render job is enqueued.
  - Credits are `captured` ONLY when the master MP4 passes all quality checks and is uploaded to R2.
  - If a render job fails or is canceled by the user, the held credits are immediately `released` back to the user's available balance.
- **Append-Only Ledger:**
  - Balance is derived dynamically from `SUM(delta)` in `credit_ledger`. Mutable balance counters in the database are prohibited.

---

## 2. Subscription Tiers & Unit Economics

| Tier | Monthly Price | Monthly Credits | Cost per Credit | Included Features |
|---|---|---|---|---|
| **Free Trial** | $0 (One-time) | 5 Credits | $0.00 | Standard queue, 540p previews, 1080p master, watermarked. |
| **Starter** | $29 / mo (Rs 2,499) | 30 Credits | $0.97 / min | 15 projects, no watermark, 6 Remotion templates, 1 Short cut. |
| **Pro** | $79 / mo (Rs 6,499) | 100 Credits | $0.79 / min | Unlimited projects, priority render queue, 12+ templates, 3 Shorts. |
| **Agency** | $199 / mo (Rs 16,499) | 300 Credits | $0.66 / min | 3 concurrent render slots, custom brand kits, MCP agent access. |

### Credit Top-Up Packs (For Active Subscribers)
- **Small Pack:** 10 Credits for $10.00 ($1.00 / credit).
- **Medium Pack:** 30 Credits for $25.00 ($0.83 / credit).
- **Large Pack:** 100 Credits for $70.00 ($0.70 / credit).

---

## 3. Stripe Billing Integration

- **Subscription Lifecycle:** Managed via Stripe Customer Portal.
- **Webhook Reconciliation:**
  - Webhooks handled at `POST /v1/webhooks/stripe`.
  - Signature verified using `STRIPE_WEBHOOK_SECRET`.
  - Events logged in `processed_stripe_events` to ensure strict idempotency.
  - `checkout.session.completed` -> Grants purchased top-up credits.
  - `invoice.paid` -> Grants monthly subscription credit allowance.
  - `customer.subscription.deleted` -> Sets user status to `canceled` at period end.

---

## 4. Go-To-Market & Launch Milestones

```
[ Phase 0: 5-7 Day Validation Spike ] ──> 1 Real Pixalified Video Postable
                   │
                   ▼
[ Phase 1: Internal Dogfooding ] ───────> 12 Real Videos Produced on Pixalified Channels
                   │
                   ▼
[ Phase 2: Closed Alpha ] ──────────────> 10 Invited External Creators (Feedback & Bug Hunt)
                   │
                   ▼
[ Phase 3: Public SaaS Launch ] ────────> Open Signups, Paid Marketing & Product Hunt
```

1. **Phase 0: 5-7 Day Validation Spike:**
   - Zero UI CLI pipeline. Run 1 real Pixalified topic end-to-end.
   - Exit Criteria: One 3-5 minute video ready for public posting; confirmed unit costs.
2. **Phase 1: Internal Dogfooding (Weeks 1-4):**
   - Use the Next.js MVP web app internally to produce all Pixalified channel content.
   - Exit Criteria: 12 real videos published to YouTube/Instagram without developer intervention.
3. **Phase 2: Closed Alpha (Weeks 5-8):**
   - Invite 10 target creators from education, agency, and tech backgrounds.
   - Exit Criteria: 8 out of 10 creators successfully render videos and report $>4/5$ satisfaction score.
4. **Phase 3: Public Commercial Launch:**
   - Enable self-serve Stripe checkout, public signup, and Product Hunt campaign.
