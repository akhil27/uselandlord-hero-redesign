import { ArrowRightIcon, PlayIcon } from "./icons";
import { ProductPreview } from "./ProductPreview";
import styles from "./NewHero.module.css";

const customers = [
  { src: "/brand/bonnys.png", alt: "Bonny’s Self Storage", width: 850, height: 242 },
  { src: "/brand/liberty.webp", alt: "Liberty Self Storage", width: 606, height: 225 },
  { src: "/brand/magenta.png", alt: "Magenta Self Storage", width: 800, height: 227 },
  { src: "/brand/hold.svg", alt: "HOLD Self Storage", width: 168, height: 40 },
];

export function NewHero() {
  return (
    <section className={styles.hero} aria-labelledby="new-hero-heading">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.rule} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            AI employees for self storage
          </p>

          <h1 className={styles.headline} id="new-hero-heading">
            Your best employee
            <br />
            <span className={styles.headlineAccent}>never clocks out.</span>
          </h1>

          <p className={styles.lede}>
            Landlord’s AI employees answer calls, WhatsApp messages, and emails{" "}
            <strong>24/7</strong> — qualifying leads, booking units, and following up while you focus on
            running the business.
          </p>

          <div className={styles.actions}>
            <a
              className={styles.primary}
              href="https://calendly.com/landlord-ai/demo"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Demo
              <span className={styles.primaryIcon}>
                <ArrowRightIcon size={16} />
              </span>
            </a>
            <a
              className={styles.secondary}
              href="https://uselandlord.com/ai-employees/sales-customer-support"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.playIcon}>
                <PlayIcon size={11} />
              </span>
              See How It Works
            </a>
          </div>

          <div className={styles.trust}>
            <p className={styles.trustLabel}>Trusted by operators in the US, UK &amp; Europe</p>
            <div className={styles.logos}>
              {customers.map((customer) => (
                <img
                  key={customer.src}
                  className={`${styles.logo} ${customer.src.includes("hold") ? styles.logoCompact : ""}`}
                  src={customer.src}
                  alt={customer.alt}
                  width={customer.width}
                  height={customer.height}
                  loading="eager"
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.visual}>
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}
