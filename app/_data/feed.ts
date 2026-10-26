export type PostType = "achievement" | "activity" | "announcement";

export interface PostAuthor {
  name: string;
  initial?: string;
  background: string;
  color: string;
  icon?: "megaphone";
}

export interface Post {
  id: string;
  type: PostType;
  author: PostAuthor;
  time: string;
  audience: string;
  body: string;
  likes: number;
  comments: number;
  photo?: { description: string };
}

export const posts: Post[] = [
  {
    id: "mateo-achievement",
    type: "achievement",
    author: {
      name: "Mateo",
      initial: "M",
      background: "#A9D9E8",
      color: "#1F7A93",
    },
    time: "14:20",
    audience: "familia de Mateo",
    body: "¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.",
    likes: 3,
    comments: 1,
  },
  {
    id: "mateo-activity",
    type: "activity",
    author: {
      name: "Mateo",
      initial: "M",
      background: "#A9D9E8",
      color: "#1F7A93",
    },
    time: "09:40",
    audience: "familia de Mateo",
    body: "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.",
    likes: 5,
    comments: 2,
    photo: { description: "Foto · pintando con témperas" },
  },
  {
    id: "park-announcement",
    type: "announcement",
    author: {
      name: "Anuncio general",
      background: "#CCD8F4",
      color: "#4E72C8",
      icon: "megaphone",
    },
    time: "07:50",
    audience: "toda la sala",
    body: "El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.",
    likes: 8,
    comments: 0,
  },
];
