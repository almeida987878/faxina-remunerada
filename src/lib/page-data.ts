import mariana from "@/assets/mariana.png.asset.json";
import carlos from "@/assets/carlos.png.asset.json";
import fernanda from "@/assets/fernanda.png.asset.json";
import roberto from "@/assets/roberto.png.asset.json";
import juliana from "@/assets/juliana.png.asset.json";
import diego from "@/assets/diego.png.asset.json";

export const videoTitle =
  "Como pessoas comuns estão participando de projetos de IA através de tarefas domésticas";
export const viewCount = "42 mil visualizações";
export const publishedAt = "há 1 dia";
export const commentCount = 263;

/**
 * Returns confirmed purchases within a time window.
 * No checkout integration yet → returns null (counter shows as demo only).
 */
export async function getRecentPurchases(): Promise<number | null> {
  return null;
}
export const DEMO_PURCHASES = 30;

export const comments = [
  { name: "Mariana Costa", avatar: mariana.url, time: "há 12 minutos", likes: 48, text: "Eu não conhecia esse mercado. A parte que explica como funcionam as plataformas deixou tudo muito mais claro." },
  { name: "Carlos Oliveira", avatar: carlos.url, time: "há 25 minutos", likes: 36, text: "Alguém sabe se dá para começar somente com o celular ou algumas plataformas exigem equipamento específico?" },
  { name: "Fernanda Lima", avatar: fernanda.url, time: "há 37 minutos", likes: 27, text: "Gostei da explicação sobre privacidade. Eu nem tinha pensado nas coisas que podem aparecer no fundo da gravação." },
  { name: "Roberto Souza", avatar: roberto.url, time: "há 52 minutos", likes: 19, text: "Essa parte do enquadramento POV ajudou bastante a entender como esse tipo de gravação funciona." },
  { name: "Juliana Mendes", avatar: juliana.url, time: "há 1 hora", likes: 31, text: "Eu já tinha visto pessoas falando desse tipo de projeto, mas nunca tinha entendido por que as empresas precisam dessas gravações." },
  { name: "Diego Ramos", avatar: diego.url, time: "há 1 hora", likes: 24, text: "O interessante é entender o que analisar antes de entrar em uma plataforma: país, equipamento, regras e forma de pagamento." },
];

export const ATOMOPAY_CHECKOUT_URL = "https://go.atomopay.com.br/p14pjthjpl";
/** Share of the video that must actually be watched (not skipped) before unlocking. */
export const MIN_WATCHED_RATIO = 0.8;

export function shouldShowPurchaseButton(videoCompleted: boolean, keepVisible: boolean): boolean {
  return videoCompleted || keepVisible;
}
