
// CAMPEONATO DE FILMES — Semana 2 (TypeScript)
// Regras: maior nota vence; empate -> ordem alfabética (localeCompare)


// Tipos e Interfaces
type Fase = "Primeira" | "Semifinal" | "Final";

interface Filme {
  titulo: string;
  nota: number;
}

type Confronto = [Filme, Filme];

interface Partida {
  fase: Fase;
  confronto: Confronto;
  vencedor: Filme;
  perdedor: Filme;
}

// Dados iniciais dos filmes

const filmes: Filme[] = [
  { titulo: "Matrix", nota: 9 },
  { titulo: "Cidade de Deus", nota: 8.5 },
  { titulo: "O Senhor dos Anéis", nota: 9 },
  { titulo: "A Origem", nota: 8.8 },
  { titulo: "Interestelar", nota: 9 },
  { titulo: "Parasita", nota: 8.9 },
  { titulo: "Clube da Luta", nota: 8.8 },
  { titulo: "Corra!", nota: 8.2 },
];


// Funções utilitárias

// Compara dois filmes: primeiro por nota (decrescente), depois por ordem alfabética (crescente)
function compararFilmes(a: Filme, b: Filme): number {
  // Primeiro critério: nota mais alta
  if (a.nota !== b.nota) {
    return b.nota - a.nota; // Nota decrescente
  }
  // Segundo critério: ordem alfabética
  return a.titulo.localeCompare(b.titulo, "pt-BR");
}

// Decide o vencedor de um confronto seguindo as regras do campeonato
function disputarPartida(fase: Fase, confronto: Confronto): Partida {
  const [filme1, filme2] = confronto;

  // Usa a função de comparação para determinar o vencedor
  const resultado = compararFilmes(filme1, filme2);

  // Se resultado <= 0, filme1 vence (nota maior ou título em ordem alfabética anterior)
  const vencedor = resultado <= 0 ? filme1 : filme2;
  const perdedor = vencedor === filme1 ? filme2 : filme1;

  return { fase, confronto, vencedor, perdedor };
}

// Monta os confrontos da primeira fase: primeiro vs último, segundo vs penúltimo, etc.
function montarConfrontosPrimeiraFase(lista: Filme[]): Confronto[] {
  const confrontos: Confronto[] = [];
  const metade = Math.floor(lista.length / 2);
  
  for (let i = 0; i < metade; i++) {
    const primeiro = lista[i];
    const ultimo = lista[lista.length - 1 - i];
    confrontos.push([primeiro, ultimo]);
  }
  
  return confrontos;
}

// Monta confrontos agrupando elementos consecutivos (para semifinais e finais)
function montarConfrontosDuplasConsecutivas(lista: Filme[]): Confronto[] {
  const confrontos: Confronto[] = [];
  
  for (let i = 0; i < lista.length; i += 2) {
    confrontos.push([lista[i], lista[i + 1]]);
  }
  
  return confrontos;
}

// Processa uma fase completa: recebe confrontos e retorna partidas e vencedores
const avancarFase = (fase: Fase, confrontos: Confronto[]): { partidas: Partida[]; vencedores: Filme[] } => {
  const partidas = confrontos.map((confronto) => disputarPartida(fase, confronto));
  const vencedores = partidas.map((partida) => partida.vencedor);
  return { partidas, vencedores };
};


// Pipeline principal do campeonato (3 fases)

function campeonatoDeFilmes(listaOriginal: Filme[]): { campeao: Filme; vice: Filme; historico: Partida[] } {
  // Validação: número de filmes deve ser potência de 2
  if (listaOriginal.length < 2 || (listaOriginal.length & (listaOriginal.length - 1)) !== 0) {
    throw new Error("Use um número de filmes que seja potência de 2 (ex.: 4, 8, 16...).");
  }

  // Cria cópia da lista original para não modificar os dados originais
  const listaBase = [...listaOriginal];

  //  FASE 1: Primeira fase (confrontos: primeiro vs último)
  const confrontosPrimeira = montarConfrontosPrimeiraFase(listaBase);
  const { partidas: partidasPrimeira, vencedores: classificadosPrimeira } = avancarFase("Primeira", confrontosPrimeira);

  //  FASE 2: Semifinal (confrontos: duplas consecutivas)
  const confrontosSemifinal = montarConfrontosDuplasConsecutivas(classificadosPrimeira);
  const { partidas: partidasSemifinal, vencedores: finalistas } = avancarFase("Semifinal", confrontosSemifinal);

  //  FASE 3: Final (confronto entre os dois finalistas)
  const confrontosFinal = montarConfrontosDuplasConsecutivas(finalistas);
  const { partidas: partidasFinal, vencedores: campeoes } = avancarFase("Final", confrontosFinal);

  const campeao = campeoes[0];

  // Encontra o vice-campeão entre os finalistas
  const vice = finalistas.find((filme) => filme.titulo !== campeao.titulo) || finalistas[1];

  // Compila todo o histórico de partidas
  const historico: Partida[] = [...partidasPrimeira, ...partidasSemifinal, ...partidasFinal];

  return { campeao, vice, historico };
}


// Execução e Exibição

console.log("=== CAMPEONATO DE FILMES ===");
console.log("");

// Exibe a lista inicial ordenada por título
const filmesOrdenadosPorTitulo = [...filmes].sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));
console.log("Lista inicial (ordenada por título):");
filmesOrdenadosPorTitulo.forEach((filme) => console.log(`- ${filme.titulo} (Nota: ${filme.nota})`));
console.log("");

try {
  // Executa o campeonato
  const { campeao, vice, historico } = campeonatoDeFilmes(filmes);

  // Exibe o histórico de todas as partidas
  const linhaSeparadora = "-".repeat(50);
  historico.forEach((partida) => {
    const [filmeA, filmeB] = partida.confronto;
    console.log(linhaSeparadora);
    console.log(`[${partida.fase}] ${filmeA.titulo} (${filmeA.nota})  x  ${filmeB.titulo} (${filmeB.nota})`);
    console.log(`Vencedor: ${partida.vencedor.titulo} (${partida.vencedor.nota})`);
  });
  console.log(linhaSeparadora);
  console.log("");

  // Exibe o resultado final
  console.log(`Campeao: ${campeao.titulo}  Nota: ${campeao.nota}`);
  console.log(`Vice-campeao: ${vice.titulo}  Nota: ${vice.nota}`);
} catch (erro) {
  console.error(String(erro));
}