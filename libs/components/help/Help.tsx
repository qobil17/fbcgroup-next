import { useState } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "../../../lib/AuthContext";

interface FaqItem {
  q: string;
  a: string;
}

interface QuickLink {
  label: string;
  href: string;
}

interface HelpContent {
  faqTitle: string;
  faq: FaqItem[];
  contactTitle: string;
  phone: string;
  phoneLabel: string;
  email: string;
  emailLabel: string;
  hours: string;
  hoursLabel: string;
  quickLinksTitle: string;
  quickLinks: QuickLink[];
}

interface HelpProps {
  bannerTitle: string;
  bannerSub: string;
  content: HelpContent;
}

const Help = ({ bannerTitle, bannerSub, content }: HelpProps) => {
  const router = useRouter();
  const { authMember } = useAuthContext();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleQuickLink = (href: string) => {
    if (href === "/order" && !authMember) {
      router.push("/auth");
      return;
    }
    router.push(href);
  };

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="help-page">
      {/* Banner */}
      <div className="help-banner">
        <h1 className="help-banner__title">{bannerTitle}</h1>
        <p className="help-banner__sub">{bannerSub}</p>
      </div>
      {/* FAQ */}
      <section className="help-faq">
        <div className="help-container">
          <h2 className="help-section-title">{content.faqTitle}</h2>
          <div className="help-faq__list">
            {content.faq.map((item, i) => (
              <div
                key={i}
                className={`help-faq__item${openIndex === i ? " open" : ""}`}
              >
                <button
                  className="help-faq__question"
                  onClick={() => toggle(i)}
                  aria-expanded={openIndex === i}
                >
                  <span className="help-faq__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="help-faq__q-text">{item.q}</span>
                  <span className="help-faq__chevron">{openIndex === i ? "▴" : "▾"}</span>
                </button>
                {openIndex === i && (
                  <div className="help-faq__answer">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom grid: contact + quick links */}
      <section className="help-bottom">
        <div className="help-container help-bottom__grid">
          {/* Contact */}
          <div className="help-contact">
            <h2 className="help-section-title">{content.contactTitle}</h2>
            <div className="help-contact__list">
              <div className="help-contact__item">
                <span className="help-contact__icon">☎</span>
                <div>
                  <p className="help-contact__label">{content.phoneLabel}</p>
                  <a className="help-contact__value" href={`tel:${content.phone}`}>
                    {content.phone}
                  </a>
                </div>
              </div>
              <div className="help-contact__item">
                <span className="help-contact__icon">✉</span>
                <div>
                  <p className="help-contact__label">{content.emailLabel}</p>
                  <a className="help-contact__value" href={`mailto:${content.email}`}>
                    {content.email}
                  </a>
                </div>
              </div>
              <div className="help-contact__item">
                <span className="help-contact__icon">◷</span>
                <div>
                  <p className="help-contact__label">{content.hoursLabel}</p>
                  <p className="help-contact__value">{content.hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="help-links">
            <h2 className="help-section-title">{content.quickLinksTitle}</h2>
            <div className="help-links__list">
              {content.quickLinks.map((link) => (
                <button
                  key={link.href}
                  className="help-links__item"
                  onClick={() => handleQuickLink(link.href)}
                >
                  <span className="help-links__arrow">→</span>
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;
