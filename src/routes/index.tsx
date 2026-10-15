import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Menu, Search, Mic, Bell, Play, Pause, Volume2, VolumeX, Captions, Settings, RectangleHorizontal, Maximize,
  ThumbsUp, ThumbsDown, Share2, Bookmark, MoreHorizontal, MoreVertical, ListFilter, ChevronDown,
} from "lucide-react";
import videoAsset from "@/assets/video.mp4.asset.json";
import poster from "@/assets/poster.jpg";
import youtubeLogo from "@/assets/youtube-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { buildCheckoutUrl } from "@/lib/checkout-url";
import {
  videoTitle, viewCount, publishedAt, commentCount, comments, getRecentPurchases, DEMO_PURCHASES, ATOMOPAY_CHECKOUT_URL, MIN_WATCHED_RATIO, shouldShowPurchaseButton,
} from "@/lib/page-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Faxina Remunerada — Seu resultado está pronto" },
      { name: "description", content: "Veja como funciona e como você também pode participar." },
      { property: "og:title", content: "Faxina Remunerada — Seu resultado está pronto" },
      { property: "og:description", content: "Veja como funciona e como você também pode participar." },
      { property: "og:type", content: "video.other" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const fmt = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

function Logo({ small }: { small?: boolean }) {
  return (
    small ? <span className="text-sm font-bold text-foreground">FR</span> :
    <img src={youtubeLogo.url} alt="YouTube" width={113} height={25} className="h-[25px] w-[113px] object-contain" />
  );
}

function VideoPlayer({ onComplete }: { onComplete: () => void }) {
  const watched = useRef(0);
  const last = useRef(0);
  const seeked = useRef(false);
  const unlocked = useRef(false);
  const ref = useRef<HTMLVideoElement>(null);
  const done = useRef(onComplete);
  done.current = onComplete;
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [t, setT] = useState(0);
  const [d, setD] = useState(0);

  // The page is server-rendered, so the video can be under way before React has
  // attached its own listeners. Bind natively and sync whatever already happened,
  // otherwise the sound pill, the timer and the play button never update.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const unlock = () => {
      if (unlocked.current) return;
      unlocked.current = true;
      done.current();
    };
    const qualifies = () =>
      !seeked.current || watched.current >= (v.duration || 0) * MIN_WATCHED_RATIO;
    const onLoaded = () => setD(v.duration || 0);
    const onPlay = () => { setPlaying(true); };
    const onPause = () => setPlaying(false);
    const onSeeking = () => {
      if (Math.abs(v.currentTime - last.current) > 1.5) seeked.current = true;
    };
    const onTime = () => {
      const ct = v.currentTime;
      const delta = ct - last.current;
      if (delta > 0 && delta < 1.5) watched.current += delta;
      last.current = ct;
      setT(ct);
      // Reached the final seconds with enough real watch time: unlock even if
      // the "ended" event gets lost (some mobile browsers swallow it).
      if ((v.duration || 0) > 0 && ct >= v.duration - 1 && qualifies()) unlock();
    };
    const onEnd = () => {
      if (qualifies()) unlock();
    };
    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("play", onPlay);
    v.addEventListener("playing", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("seeking", onSeeking);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnd);
    onLoaded();
    onTime();
    if (!v.paused) onPlay();
    v.muted = true;
    v.play().catch(() => {});
    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("playing", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("seeking", onSeeking);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  };
  const unmute = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
    if (v.paused) v.play();
  };
  const toggleMute = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-video-surface">
      <video
        ref={ref}
        src={videoAsset.url}
        poster={poster}
        autoPlay muted playsInline preload="metadata"
        className="h-full w-full object-cover"
        onClick={toggle}
      />
      {!playing && (
        <Button variant="ghost" onClick={toggle} aria-label="Play" className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-primary-foreground bg-video-overlay text-primary-foreground transition hover:scale-105 sm:h-20 sm:w-20">
          <Play className="ml-1 h-8 w-8" fill="currentColor" />
        </Button>
      )}
      {muted && playing && (
        <Button variant="ghost" onClick={unmute} className="absolute bottom-16 left-1/2 -translate-x-1/2 rounded-full bg-video-overlay px-4 py-2 text-sm font-semibold text-primary-foreground backdrop-blur transition hover:scale-105">
          🔊 Toque para ativar o som
        </Button>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-video-overlay to-transparent px-4 pb-2 pt-6 text-primary-foreground">
        <input
          type="range" min={0} max={d || 0} step={0.1} value={t}
          onChange={(e) => { const v = ref.current; if (v) v.currentTime = +e.target.value; }}
          className="h-1 w-full cursor-pointer accent-primary"
          aria-label="Progresso"
        />
        <div className="mt-1 flex items-center gap-4">
          <Button variant="ghost" onClick={toggle} aria-label="Play/Pause">{playing ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5" fill="currentColor" />}</Button>
          <Button variant="ghost" onClick={toggleMute} aria-label="Volume">{muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}</Button>
          <span className="text-xs sm:text-sm">{fmt(t)} / {fmt(d)}</span>
          <div className="ml-auto flex items-center gap-4">
            <Captions className="h-5 w-5" />
            <Settings className="h-5 w-5" />
            <RectangleHorizontal className="hidden h-5 w-5 sm:block" />
            <Button variant="ghost" onClick={() => ref.current?.parentElement?.requestFullscreen?.()} aria-label="Tela cheia"><Maximize className="h-5 w-5" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PurchaseActivity() {
  const [real, setReal] = useState<number | null>(null);
  useEffect(() => { getRecentPurchases().then(setReal); }, []);
  const isDemo = real === null;
  if (isDemo && !import.meta.env.DEV) return null;
  return (
    <div className="flex items-center gap-3 rounded-full bg-secondary px-4 py-2.5 text-sm font-semibold text-foreground">
      <span className="pulse-dot h-2.5 w-2.5 shrink-0 rounded-full bg-success" />
      {isDemo ? `DEMONSTRAÇÃO · ${DEMO_PURCHASES} aquisições` : `${real} pessoas adquiriram o Método Faxina Remunerada recentemente`}
    </div>
  );
}

function PurchaseCTA({ checkoutUrl }: { checkoutUrl: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.bottom > window.innerHeight) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);
  return (
    <div ref={ref} className="cta-reveal mt-4 rounded-2xl border border-border bg-secondary p-4 text-center sm:p-5">
      <h2 className="text-xl font-extrabold text-foreground">Seu acesso está liberado! 🔓</h2>
      <p className="mt-1 text-sm text-muted-foreground">Agora você pode acessar o Método Faxina Remunerada e descobrir o passo a passo completo.</p>
      <Button asChild className="cta-pulse mt-4 flex min-h-16 w-full items-center justify-center whitespace-normal rounded-2xl bg-cta px-4 text-base font-extrabold text-cta-foreground hover:bg-cta/90 sm:text-lg">
      <a href={checkoutUrl}>
        QUERO ACESSAR O MÉTODO AGORA →
      </a>
      </Button>
      <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>🔒 Pagamento seguro</span><span>⚡ Acesso liberado após a confirmação</span><span>📱 Acesso pelo celular</span>
      </div>
    </div>
  );
}

const pill = "flex shrink-0 items-center gap-2 rounded-full bg-secondary px-5 py-2.5 font-semibold text-foreground transition duration-200 hover:bg-accent active:scale-95";

function Index() {
  const [offerUnlocked, setOfferUnlocked] = useState(false);
  const [keepPurchaseVisible, setKeepPurchaseVisible] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState(ATOMOPAY_CHECKOUT_URL);
  useEffect(() => {
    setCheckoutUrl(buildCheckoutUrl(ATOMOPAY_CHECKOUT_URL, window.location.search));
  }, []);
  return (
    <main className="min-h-screen bg-background font-sans">
      <header className="flex h-14 items-center justify-between gap-6 px-4 sm:px-6">
        <div className="flex shrink-0 items-center gap-5">
          <Menu aria-hidden="true" className="h-5 w-5 text-foreground" />
          <Logo />
        </div>
        <form action="https://www.youtube.com/results" method="get" target="_blank" className="hidden w-full max-w-[640px] items-center gap-4 sm:flex">
          <div className="flex h-10 flex-1 overflow-hidden rounded-full border border-border">
            <input name="search_query" aria-label="Pesquisar no YouTube" placeholder="Pesquisar" className="min-w-0 flex-1 bg-background px-4 text-sm text-foreground outline-none" />
            <Button type="submit" variant="secondary" className="h-full w-16 rounded-none border-l border-border" aria-label="Pesquisar"><Search /></Button>
          </div>
          <Mic aria-hidden="true" className="h-5 w-5 shrink-0 text-foreground" />
        </form>
        <div className="flex items-center gap-5 text-foreground">
          <Bell aria-hidden="true" className="h-5 w-5" />
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold">FR</span>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1600px] gap-6 px-3 pb-8 pt-2 sm:px-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0">
      <VideoPlayer onComplete={() => setOfferUnlocked(true)} />

      <div className="mt-3 flex items-center justify-between gap-3">
        <label htmlFor="keep-purchase-visible" className="cursor-pointer text-sm text-muted-foreground">
          Manter botão de compra visível
        </label>
        <Switch id="keep-purchase-visible" checked={keepPurchaseVisible} onCheckedChange={setKeepPurchaseVisible} />
      </div>
      {shouldShowPurchaseButton(offerUnlocked, keepPurchaseVisible) && <PurchaseCTA checkoutUrl={checkoutUrl} />}

      <h1 className="mt-3 text-lg font-bold leading-snug text-foreground sm:text-xl">{videoTitle}</h1>
      <p className="mt-1 text-xs text-muted-foreground">{viewCount} · {publishedAt}</p>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-secondary"><Logo small /></div>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-foreground">Faxina Remunerada</div>
          <div className="text-sm text-muted-foreground">Comunidade Faxina Remunerada</div>
        </div>
        <Button className="rounded-full bg-foreground px-5 font-bold text-background hover:bg-foreground/90">Inscrever-se</Button>
      </div>

      <div className="-mx-3 mt-4 flex gap-3 overflow-x-auto px-3 pb-1 sm:mx-0 sm:px-0">
        <Button variant="ghost" className={pill}><ThumbsUp className="h-5 w-5" fill="currentColor" /> Gostei</Button>
        <Button variant="ghost" className={pill}><ThumbsDown className="h-5 w-5" /> Não gostei</Button>
        <Button variant="ghost" className={pill}><Share2 className="h-5 w-5" /> Compartilhar</Button>
        <Button variant="ghost" className={pill}><Bookmark className="h-5 w-5" /> Salvar</Button>
        <Button variant="ghost" className={pill} aria-label="Mais"><MoreHorizontal className="h-5 w-5" /></Button>
      </div>

      <div className="mt-4"><PurchaseActivity /></div>
      <Button asChild className="mt-4 flex min-h-16 w-full items-center justify-center whitespace-normal rounded-2xl bg-cta px-4 text-center text-base font-extrabold text-cta-foreground hover:bg-cta/90 sm:text-lg">
        <a href={checkoutUrl} aria-label="Comprar Método Faxina Remunerada">
          QUERO ACESSAR O MÉTODO AGORA →
        </a>
      </Button>
      </div>
      <section className="min-w-0 pt-2 xl:pt-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <h2 className="text-lg font-extrabold text-foreground">{commentCount} comentários</h2>
          <Button variant="ghost" className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-foreground">
            <ListFilter className="h-4 w-4" /> Mais recentes <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <ul className="mt-4 space-y-6">
          {comments.map((c) => (
            <li key={c.name} className="flex gap-3">
              <img src={c.avatar} alt={`Foto de ${c.name}`} width={56} height={56} loading="lazy" className="h-11 w-11 shrink-0 rounded-full object-cover sm:h-14 sm:w-14" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-bold text-foreground">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{c.time}</span>
                </div>
                <p className="mt-0.5 text-sm text-foreground/80">{c.text}</p>
                <div className="mt-2 flex items-center gap-4 text-sm text-foreground">
                  <span className="flex items-center gap-2"><ThumbsUp className="h-4 w-4" fill="currentColor" /> {c.likes}</span>
                  <ThumbsDown className="h-4 w-4" fill="currentColor" />
                  <Button variant="ghost" className="font-medium">Responder</Button>
                </div>
              </div>
              <MoreVertical className="h-5 w-5 shrink-0 text-foreground" />
            </li>
          ))}
        </ul>
      </section>
      </div>
    </main>
  );
}
