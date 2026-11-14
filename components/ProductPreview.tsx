import {
  BrandMark,
  BuildingIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  MailIcon,
  MoonIcon,
  MoreIcon,
  PhoneIcon,
  SearchIcon,
  SendIcon,
  SparkleIcon,
  WhatsAppIcon,
} from "./icons";
import styles from "./ProductPreview.module.css";

const conversations = [
  {
    initials: "SM",
    name: "Sarah Mitchell",
    channel: "WhatsApp",
    preview: "Do you have a 10×10 this weekend?",
    time: "11:42 PM",
    active: true,
    unread: true,
    tone: "warm",
  },
  {
    initials: "DO",
    name: "Daniel Ortiz",
    channel: "Phone",
    preview: "After-hours call · 2m 14s",
    time: "11:18 PM",
    active: false,
    unread: true,
    tone: "cool",
  },
  {
    initials: "EL",
    name: "Emma Lewis",
    channel: "Email",
    preview: "Question about my invoice",
    time: "10:54 PM",
    active: false,
    unread: false,
    tone: "sand",
  },
];

function ChannelIcon({ channel, size = 9 }: { channel: string; size?: number }) {
  if (channel === "WhatsApp") return <WhatsAppIcon size={size} />;
  if (channel === "Phone") return <PhoneIcon size={size} />;
  return <MailIcon size={size} />;
}

export function ProductPreview({ className = "" }: { className?: string }) {
  return (
    <div className={`${styles.wrap} ${className}`}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.dots} aria-hidden="true" />

      <figure
        className={styles.app}
        aria-label="Product preview: a Landlord AI employee handling an after-hours WhatsApp inquiry about a 10 by 10 unit."
      >
        <div className={styles.topbar}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>
              <BrandMark size={15} />
            </span>
            <span className={styles.brandName}>Landlord</span>
            <span className={styles.slash}>/</span>
            <span className={styles.muted}>Inbox</span>
          </div>
          <div className={styles.topActions}>
            <span className={styles.live}>
              <span className={styles.liveDot} />
              AI Employee Active
            </span>
            <span className={styles.more} aria-hidden="true">
              <MoreIcon size={14} />
            </span>
          </div>
        </div>

        <div className={styles.body}>
          <aside className={styles.rail} aria-label="Conversation list">
            <div className={styles.railTitle}>
              <span>Inbox</span>
              <span className={styles.count}>3</span>
            </div>
            <div className={styles.search}>
              <SearchIcon size={11} />
              <span>Search conversations</span>
            </div>
            <div className={styles.filters}>
              <span className={styles.filterActive}>All</span>
              <span>Unread 3</span>
            </div>
            <div className={styles.list}>
              {conversations.map((conversation) => (
                <div
                  key={conversation.name}
                  className={`${styles.conversation} ${conversation.active ? styles.conversationActive : ""}`}
                >
                  <span className={`${styles.avatar} ${styles[conversation.tone]}`}>
                    {conversation.initials}
                    <span className={styles.channelBadge}>
                      <ChannelIcon channel={conversation.channel} size={8} />
                    </span>
                  </span>
                  <span className={styles.conversationBody}>
                    <span className={styles.conversationTop}>
                      <strong>{conversation.name}</strong>
                      <time>{conversation.time}</time>
                    </span>
                    <span className={styles.conversationBottom}>
                      <span>{conversation.preview}</span>
                      {conversation.unread ? <i /> : null}
                    </span>
                  </span>
                </div>
              ))}
            </div>
            <div className={styles.railFoot}>
              <span className={styles.aiAvatar}>A</span>
              <span className={styles.aiIdentity}>
                <strong>Alex</strong>
                <span>
                  <i className={styles.onlineDot} /> AI employee · online
                </span>
              </span>
            </div>
          </aside>

          <section className={styles.chat} aria-label="Conversation with Sarah Mitchell">
            <header className={styles.chatHead}>
              <div className={styles.person}>
                <span className={styles.avatarLg}>
                  SM
                  <span className={styles.channelBadgeLg}>
                    <WhatsAppIcon size={9} />
                  </span>
                </span>
                <span className={styles.personText}>
                  <strong>Sarah Mitchell</strong>
                  <span>WhatsApp · +1 (512) ••• 0142</span>
                </span>
              </div>
              <div className={styles.headMeta}>
                <span className={styles.afterHours}>
                  <MoonIcon size={10} />
                  After hours
                </span>
                <span className={styles.headTime}>11:42 PM</span>
              </div>
            </header>

            <div className={styles.thread}>
              <div className={styles.day}>Today</div>

              <div className={`${styles.message} ${styles.incoming}`}>
                <p>
                  Hi — do you have a 10×10 unit available this weekend? Moving from out of town and need
                  somewhere safe by Saturday.
                </p>
                <time>11:42 PM</time>
              </div>

              <div className={styles.aiMeta}>
                <span className={styles.aiMetaLabel}>
                  <SparkleIcon size={11} />
                  Alex · AI employee
                </span>
                <span className={styles.aiMetaTime}>
                  <ClockIcon size={9} /> replied after hours
                </span>
              </div>

              <div className={`${styles.message} ${styles.aiMessage}`}>
                <p>
                  Hi Sarah — yes, we have a climate-controlled 10×10 at our Downtown location. I can hold
                  it for you and send a secure rental link. Would Saturday at 10:00 AM work for move-in?
                </p>
                <time>11:42 PM</time>
              </div>

              <div className={styles.unit}>
                <span className={styles.unitIcon}>
                  <BuildingIcon size={14} />
                </span>
                <span className={styles.unitText}>
                  <strong>10 × 10 · Climate controlled</strong>
                  <span>Downtown · Sat, Nov 15</span>
                </span>
                <span className={styles.held}>
                  <CheckIcon size={9} />
                  Held
                </span>
              </div>

              <div className={`${styles.message} ${styles.incoming} ${styles.short}`}>
                <p>That would be amazing — thank you!</p>
              </div>

              <div className={`${styles.message} ${styles.aiMessage}`}>
                <p>
                  Perfect — I’ve held the unit and sent your rental link by text. See you Saturday at
                  10:00!
                </p>
                <time>11:43 PM</time>
              </div>
            </div>

            <div className={styles.success}>
              <CheckCircleIcon size={13} />
              <span>
                <strong>Inquiry resolved</strong> · unit held, rental link sent
              </span>
            </div>

            <div className={styles.composer}>
              <div className={styles.composerBox}>
                <span>Ask Alex to follow up…</span>
                <span className={styles.send} aria-hidden="true">
                  <SendIcon size={11} />
                </span>
              </div>
              <span className={styles.composerHint}>
                <span className={styles.hintDot} />
                Alex is handling this conversation
              </span>
            </div>
          </section>
        </div>
      </figure>

      <div className={styles.floatNight} aria-hidden="true">
        <MoonIcon size={11} />
        <span>After hours</span>
        <strong>11:42 PM</strong>
      </div>

      <div className={styles.floatResolved} aria-hidden="true">
        <span className={styles.floatCheck}>
          <CheckIcon size={12} />
        </span>
        <span className={styles.floatText}>
          <strong>Lead captured</strong>
          <span>Unit held · follow-up scheduled</span>
        </span>
      </div>
    </div>
  );
}
