import type { Metadata } from "next";
import { BeforeAfter } from "@/components/BeforeAfter";
import { PhonePreview } from "@/components/PhonePreview";
import { ProductPreview } from "@/components/ProductPreview";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  CheckCircleIcon,
  LayersIcon,
  PulseIcon,
  TargetIcon,
} from "@/components/icons";
import styles from "./design-review.module.css";

export const metadata: Metadata = {
  title: "Landlord — Hero Redesign · Design Review",
  description:
    "Before and after: a focused redesign of the Landlord homepage hero, with the rationale behind the new value proposition, product visualization, and conversion path.",
  robots: { index: false, follow: false },
};

const meta = [
  { label: "Scope", value: "Hero section only" },
  { label: "Audience", value: "Self-storage owners & operators" },
  { label: "Objective", value: "Qualified demo bookings" },
  { label: "Approach", value: "Clarify · Visualize · Convert" },
];

const shifts = [
  {
    label: "Message",
    before: "Stop losing leads",
    after: "Never clocks out",
  },
  {
    label: "Proof",
    before: "Founder video",
    after: "Live product moment",
  },
  {
    label: "Action",
    before: "Two equal CTAs",
    after: "One clear path",
  },
];

const reasons = [
  {
    number: "01",
    icon: TargetIcon,
    title: "Clearer positioning",
    body:
      "The category sits above the headline: “AI employees for self storage.” A visitor knows what Landlord is and who it is for before reading a single benefit.",
    evidence: "Eyebrow + headline",
  },
  {
    number: "02",
    icon: LayersIcon,
    title: "Product proof",
    body:
      "Instead of describing 24/7 coverage, the hero shows it: an AI employee answering a WhatsApp inquiry after hours, holding a unit, and sending the rental link.",
    evidence: "Inbox visualization",
  },
  {
    number: "03",
    icon: ArrowRightIcon,
    title: "Stronger conversion path",
    body:
      "One dominant green CTA replaces two similar-weight buttons. “See How It Works” stays available for visitors who need more evidence before they book.",
    evidence: "CTA hierarchy",
  },
  {
    number: "04",
    icon: CheckCircleIcon,
    title: "Greater trust",
    body:
      "Real customer logos sit directly beneath the action, using proof Landlord already has rather than a new statistic, claim, or invented endorsement.",
    evidence: "Customer proof",
  },
];

const annotations = [
  {
    number: "01",
    title: "Channel-aware inbox",
    body: "WhatsApp, calls, and email sit in one place, so the AI employee meets renters where they already are.",
  },
  {
    number: "02",
    title: "Status you can see",
    body: "“AI Employee Active” and “After hours” make the 24/7 promise tangible at a glance.",
  },
  {
    number: "03",
    title: "Outcome, not just a reply",
    body: "The unit is held and the rental link is sent. The conversation ends in a captured lead.",
  },
];

const kept = [
  {
    title: "Brand green",
    body: "#7DC869 still carries the primary action, with a darker green for accessible display text.",
  },
  {
    title: "The after-hours tension",
    body: "The original idea survives — now framed as the outcome instead of only the warning.",
  },
  {
    title: "Real customer proof",
    body: "Bonny’s, Liberty, Magenta, and HOLD logos, used exactly as they appear on Landlord’s site.",
  },
  {
    title: "Inter + tight tracking",
    body: "The same typeface and compressed display rhythm, just with a more confident scale.",
  },
  {
    title: "Rounded geometry",
    body: "8–12px control radii and hairline borders keep the existing interface language.",
  },
  {
    title: "Plain-spoken voice",
    body: "Short sentences. No jargon. No invented metrics or customer endorsements.",
  },
];

const swatches = [
  { name: "Ink", hex: "#081504", color: "#081504" },
  { name: "Brand green", hex: "#7DC869", color: "#7DC869" },
  { name: "Soft green", hex: "#F0F9F4", color: "#F0F9F4" },
  { name: "Hairline", hex: "#E5E7EB", color: "#E5E7EB" },
];

export default function DesignReviewPage() {
  return (
    <div className={styles.page} id="top">
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <a
            className={styles.brand}
            href="https://uselandlord.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Landlord — open live site"
          >
            <img src="/brand/landlordlogo.png" alt="Landlord" width={165} height={84} />
          </a>
          <span className={styles.brandDivider} aria-hidden="true" />
          <span className={styles.topTitle}>Hero redesign</span>

          <nav className={styles.topNav} aria-label="Review sections">
            <a href="#comparison">Comparison</a>
            <a href="#rationale">Rationale</a>
            <a href="#details">Details</a>
            <a href="#responsive">Responsive</a>
          </nav>

          <div className={styles.topMeta}>
            <span>Nov 2026</span>
            <a href="https://uselandlord.com" target="_blank" rel="noopener noreferrer">
              Live site
              <ArrowUpRightIcon size={12} />
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className={styles.intro}>
          <div className={styles.introInner}>
            <div className={styles.introCopy}>
              <p className={styles.breadcrumb}>
                <span>Homepage</span>
                <span className={styles.slash}>/</span>
                <span>Hero section</span>
                <span className={styles.pill}>Design review</span>
              </p>

              <h1 className={styles.title}>
                The first five seconds,
                <br className={styles.titleBreak} /> <span>reconsidered.</span>
              </h1>

              <p className={styles.deck}>
                A focused redesign of the Landlord homepage hero — built to make the product
                unmistakable, the proof tangible, and the next step obvious. Same brand. Sharper story.
              </p>

              <dl className={styles.metaGrid}>
                {meta.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <aside className={styles.readCard} aria-label="The five-second read">
              <p className={styles.readLabel}>
                <PulseIcon size={13} />
                The five-second read
              </p>
              <ol className={styles.readList}>
                <li>
                  <span>01</span>
                  <div>
                    <strong>AI employees for self storage.</strong>
                    <p>The category, before anything else.</p>
                  </div>
                </li>
                <li>
                  <span>02</span>
                  <div>
                    <strong>Calls, WhatsApp, email — 24/7.</strong>
                    <p>The job it does, in plain language.</p>
                  </div>
                </li>
                <li>
                  <span>03</span>
                  <div>
                    <strong>Never lose another after-hours lead.</strong>
                    <p>The outcome worth booking a demo for.</p>
                  </div>
                </li>
              </ol>
              <p className={styles.readFoot}>
                Every claim in the new hero is drawn from Landlord’s live site.
              </p>
            </aside>
          </div>
        </section>

        <section className={styles.section} id="comparison">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <p className={styles.sectionKicker}>
                <span>01</span>
                Before &amp; after
              </p>
              <div className={styles.sectionHeadRow}>
                <h2>
                  Before, it named the problem.
                  <br />
                  <span>Now it shows the solution.</span>
                </h2>
                <p>
                  The current hero opens with a warning and hands the product story to a founder video.
                  The redesign opens with the category, the outcome, and a working product moment — while
                  keeping the same voice, palette, and customer proof.
                </p>
              </div>
            </div>

            <div className={styles.shiftBar} aria-label="Summary of the redesign shift">
              {shifts.map((shift) => (
                <div key={shift.label} className={styles.shift}>
                  <span className={styles.shiftLabel}>{shift.label}</span>
                  <span className={styles.shiftOld}>{shift.before}</span>
                  <ArrowRightIcon size={13} />
                  <span className={styles.shiftNew}>{shift.after}</span>
                </div>
              ))}
            </div>

            <BeforeAfter
              beforeSrc="/screens/current-hero-desktop.png"
              beforeAlt="The current Landlord homepage hero: “Stop losing leads after hours,” two CTAs, and a James Bonny testimonial video."
              afterSrc="/hero-preview"
            />
          </div>
        </section>

        <section className={styles.section} id="rationale">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <p className={styles.sectionKicker}>
                <span>02</span>
                Why this is better
              </p>
              <div className={styles.sectionHeadRow}>
                <h2>Five seconds. Four decisions.</h2>
                <p>
                  The redesign is not a new brand. It is a reallocation of attention: less time spent
                  decoding the problem, more time spent understanding the product and the next step.
                </p>
              </div>
            </div>

            <div className={styles.reasonGrid}>
              {reasons.map((reason) => {
                const Icon = reason.icon;
                return (
                  <article key={reason.number} className={styles.reasonCard}>
                    <div className={styles.reasonTop}>
                      <span className={styles.reasonNumber}>{reason.number}</span>
                      <span className={styles.reasonIcon}>
                        <Icon size={17} />
                      </span>
                    </div>
                    <h3>{reason.title}</h3>
                    <p>{reason.body}</p>
                    <span className={styles.evidence}>Seen in · {reason.evidence}</span>
                  </article>
                );
              })}
            </div>

            <div className={styles.quoteCard}>
              <div className={styles.quoteBrand}>
                <img src="/brand/bonnys.png" alt="Bonny’s Self Storage" width={850} height={242} />
                <span>Existing customer proof</span>
              </div>
              <div className={styles.quoteBody}>
                <blockquote>
                  “I was starting to miss calls. You miss out on the customer because they end up going
                  with someone else who does answer the phone.”
                </blockquote>
                <p>
                  <strong>James Bonny</strong>
                  <span>Owner, Bonny’s Self Storage</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} id="details">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <p className={styles.sectionKicker}>
                <span>03</span>
                The details
              </p>
              <div className={styles.sectionHeadRow}>
                <h2>
                  Built like a product,
                  <br />
                  <span>not a poster.</span>
                </h2>
                <p>
                  The visualization is a real interface composition: channel filters, conversation
                  state, a live AI status, and a concrete outcome. It is designed to read as software,
                  not as an AI illustration.
                </p>
              </div>
            </div>

            <div className={styles.anatomy}>
              <div className={styles.uiStage}>
                <div className={styles.stageLabel}>
                  <span>Product interface</span>
                  <span>Live component</span>
                </div>
                <ProductPreview />
              </div>

              <div className={styles.anatomyCopy}>
                <p className={styles.miniKicker}>Product proof</p>
                <h3>A claim you can watch happen.</h3>
                <p className={styles.anatomyLede}>
                  The hero does not ask visitors to imagine 24/7 coverage. It shows one after-hours
                  inquiry moving from question to held unit — the smallest complete proof of the
                  product.
                </p>

                <ol className={styles.annotationList}>
                  {annotations.map((annotation) => (
                    <li key={annotation.number}>
                      <span>{annotation.number}</span>
                      <div>
                        <strong>{annotation.title}</strong>
                        <p>{annotation.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className={styles.typeStrip}>
                  <p className={styles.typeSample}>
                    Your best employee <span>never clocks out.</span>
                  </p>
                  <div className={styles.typeMeta}>
                    <span>Inter 600</span>
                    <span>64.8px / 0.99</span>
                    <span>−4.7% tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} id="responsive">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <p className={styles.sectionKicker}>
                <span>04</span>
                Responsive
              </p>
              <div className={styles.sectionHeadRow}>
                <h2>The same story, one column.</h2>
                <p>
                  Mobile keeps the order of the argument: category, outcome, action, proof. Nothing
                  essential is hidden behind a carousel or a horizontal scroll.
                </p>
              </div>
            </div>

            <div className={styles.responsiveGrid}>
              <div className={styles.phoneColumn}>
                <PhonePreview src="/hero-preview" width={390} height={844} />
                <p className={styles.phoneCaption}>
                  <span>Mobile web · 390px</span>
                  First screen, live preview
                </p>
              </div>

              <div className={styles.responsiveCopy}>
                <p className={styles.miniKicker}>Designed for the thumb</p>
                <h3>Confident on a phone, not compressed from desktop.</h3>
                <p className={styles.anatomyLede}>
                  The layout changes at 980px and 640px. Type, spacing, and the product preview each get
                  a mobile-specific treatment rather than simply shrinking.
                </p>

                <ol className={styles.annotationList}>
                  <li>
                    <span>01</span>
                    <div>
                      <strong>The headline keeps its rhythm.</strong>
                      <p>
                        The desktop headline becomes a 40px mobile line with the same break and tight
                        tracking.
                      </p>
                    </div>
                  </li>
                  <li>
                    <span>02</span>
                    <div>
                      <strong>Actions are thumb-first.</strong>
                      <p>Both CTAs become full-width, 54px targets, with the primary action first.</p>
                    </div>
                  </li>
                  <li>
                    <span>03</span>
                    <div>
                      <strong>Proof stays legible.</strong>
                      <p>
                        The inbox drops the conversation list on narrow screens, so the thread, the held
                        unit, and the outcome keep their space.
                      </p>
                    </div>
                  </li>
                </ol>

                <div className={styles.specRow}>
                  <span>390px viewport</span>
                  <span>20px gutters</span>
                  <span>54px targets</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.continuity}>
          <div className={styles.continuityInner}>
            <div className={styles.continuityHead}>
              <p className={styles.darkKicker}>
                <span>05</span>
                Brand continuity
              </p>
              <h2>Still unmistakably Landlord.</h2>
              <p>
                This is a refinement, not a rebrand. The palette, voice, and proof stay put. The
                attention moves.
              </p>

              <div className={styles.swatches}>
                {swatches.map((swatch) => (
                  <div key={swatch.hex} className={styles.swatch}>
                    <span style={{ background: swatch.color }} />
                    <div>
                      <strong>{swatch.name}</strong>
                      <code>{swatch.hex}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ul className={styles.keptList}>
              {kept.map((item) => (
                <li key={item.title}>
                  <span className={styles.keptCheck}>
                    <CheckIcon size={11} />
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className={styles.continuityNote}>
            No new typefaces. No new brand colors. No invented proof.
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <img src="/brand/landlordlogo.png" alt="Landlord" width={165} height={84} />
            <span>Hero redesign · Design review · November 2026</span>
          </div>
          <div className={styles.footerLinks}>
            <a href="/hero-preview" target="_blank" rel="noopener noreferrer">
              Open proposed hero
              <ArrowUpRightIcon size={11} />
            </a>
            <a href="https://uselandlord.com" target="_blank" rel="noopener noreferrer">
              uselandlord.com
              <ArrowUpRightIcon size={11} />
            </a>
            <a href="#top">Back to top ↑</a>
          </div>
        </div>
        <p className={styles.sources}>
          Source: copy, customer names, logos, and proof points are drawn from uselandlord.com — the
          homepage, the Sales &amp; Customer Support page, and the FAQ. The current hero screenshot was
          captured from the live site at 1440 × 851. The product conversation is illustrative: names,
          phone numbers, locations, availability, and dates are fictional demo data. The proposed hero
          is implemented as a live Next.js route at <code>/hero-preview</code>.
        </p>
      </footer>
    </div>
  );
}
