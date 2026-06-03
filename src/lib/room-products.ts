// Mapa de cômodo → categorias de produto sugeridas.
// Usado para orientar a recomendação de produtos por ambiente
// (lista de compras + afiliados). Dados estáticos, sem lógica de risco.

export type RoomType =
  | "quarto"
  | "sala"
  | "cozinha"
  | "home-office"
  | "banheiro"
  | "quarto-infantil";

export const ROOM_PRODUCT_CATEGORIES: Record<RoomType, string[]> = {
  quarto: ["cama", "cabeceira", "criado-mudo", "luminária", "tapete", "cortina"],
  sala: ["sofá", "mesa de centro", "rack", "luminária", "tapete", "decoração"],
  cozinha: ["armários", "banquetas", "luminárias", "organizadores", "mesa"],
  "home-office": ["mesa", "cadeira", "monitor", "luminária", "suporte", "organizadores"],
  banheiro: ["gabinete", "espelho", "nichos", "metais", "acessórios"],
  // Categoria própria (não herda de "quarto"): itens de bebê/criança.
  "quarto-infantil": [
    "berço/cama infantil",
    "cômoda",
    "luminária",
    "tapete",
    "cortina blackout",
    "organizadores",
    "nichos/prateleiras",
  ],
};

/** Retorna as categorias sugeridas para um cômodo, ou [] se não mapeado. */
export function categoriesForRoom(room: string | null | undefined): string[] {
  if (!room) return [];
  return ROOM_PRODUCT_CATEGORIES[room as RoomType] ?? [];
}
