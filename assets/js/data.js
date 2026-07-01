/* ===========================================================
   FUTSAL CANGUÇU — dados do campeonato
   -----------------------------------------------------------
   ÚNICO ARQUIVO que você edita para atualizar resultados.

   COMO ADICIONAR UM RESULTADO
   -----------------------------------------------------------
   Vá até a categoria desejada e adicione um objeto dentro do
   array `jogos`, seguindo este modelo:

   {
     grupo: "A",
     mandante: "Estrela Azul",
     visitante: "Alegrense",
     golsMandante: 3,            // null = partida ainda não jogada
     golsVisitante: 1,           // null = partida ainda não jogada
     data: "2026-07-10",         // opcional, formato AAAA-MM-DD
     fase: "classificatoria",    // "classificatoria" | "quartas" | "semifinal" | "final"
     cartoesAmarelosMandante: 0, // opcional
     cartoesVermelhosMandante: 0,
     cartoesAmarelosVisitante: 0,
     cartoesVermelhosVisitante: 0
   }

   Use a página admin.html para gerar o bloco pronto.
   =========================================================== */

const CAMPEONATOS = {
  "municipal-2026": {
    id: "municipal-2026",
    nome: "Campeonato Municipal de Futsal 2026",
    descricao: "Série Ouro, Prata e Bronze, Veterano, Feminino e Seletiva.",

    categorias: {

      ouro: {
        nome: "Série Ouro",
        slug: "ouro",
        accent: "#DCA53E",
        info: [
          "Até 4 atletas de fora do município por equipe.",
          "Os 4 primeiros de cada grupo avançam à fase de mata.",
          "O último colocado de cada grupo é rebaixado para a Prata.",
          "Final com prorrogação de 2×5 min em caso de empate, seguida de pênaltis."
        ],
        // diretos: quantos avançam diretamente (destaque dourado)
        // terceiros: se o 3° lugar disputa vaga entre si (destaque azul)
        // rebaixados: quantos ao final da tabela são rebaixados (destaque vermelho)
        classificacao: { diretos: 4, terceiros: false, rebaixados: 1 },
        grupos: {
          A: ["Estrela Azul", "Alegrense", "Google", "Não Bóca", "Vila Mesko"],
          B: ["Borussia Canguçu", "Tijuana", "Rayo Vallecano", "Racing", "Red Bull"]
        },
        jogos: []
      },

      prata: {
        nome: "Série Prata",
        slug: "prata",
        accent: "#C7C7C7",
        info: [
          "Até 3 atletas de fora do município por equipe.",
          "Os 4 primeiros de cada grupo avançam à fase de mata.",
          "O último colocado de cada grupo é rebaixado para a Bronze."
        ],
        classificacao: { diretos: 4, terceiros: false, rebaixados: 1 },
        grupos: {
          A: ["Tétanos", "Peralta", "Horizonte FC", "Liverpool", "Juventus"],
          B: ["Sporting Resenha", "Real Madrid", "Bar Sem Lona", "E.C. Moura", "Arsenal"]
        },
        jogos: []
      },

      bronze: {
        nome: "Série Bronze",
        slug: "bronze",
        accent: "#C8743C",
        info: [
          "Até 2 atletas de fora do município por equipe.",
          "Os 2 primeiros de cada grupo + os 2 melhores terceiros avançam à fase de mata.",
          "Os 4 não classificados são rebaixados da competição.",
          "Vagas 'Seletiva 1–4' pertencem às equipes classificadas na fase Seletiva."
        ],
        // terceiros: true → 3° lugar fica em azul (disputa vaga entre si)
        // rebaixados: 1 → último de cada grupo (vermelho)
        classificacao: { diretos: 2, terceiros: true, rebaixados: 1 },
        grupos: {
          A: ["Eibar", "Canguçu Velho", "Olímpia", "Seletiva 1"],
          B: ["Figueirense", "Tottenham", "Boca JRS", "Seletiva 2"],
          C: ["Restoio", "Aurora", "Seletiva 3", "Seletiva 4"]
        },
        jogos: []
      },

      veterano: {
        nome: "Veterano",
        slug: "veterano",
        accent: "#6FA37C",
        info: [
          "Atletas nascidos em 1991 ou antes.",
          "Até 2 atletas de fora do município por equipe.",
          "Os 2 primeiros de cada grupo + os 2 melhores terceiros avançam à fase de mata."
        ],
        // rebaixados: 0 → sem rebaixamento no veterano
        classificacao: { diretos: 2, terceiros: true, rebaixados: 0 },
        grupos: {
          A: ["Gaúcho", "Renovação", "Rayo Vallecano", "Xavante"],
          B: ["CTDORC", "Vila Mesko", "Independente", "Estrela Esporte"],
          C: ["Estrada", "Boca JRS", "E.C. Moura", "Grenal"]
        },
        jogos: []
      },

      feminino: {
        nome: "Feminino",
        slug: "feminino",
        accent: "#C2598A",
        info: [
          "Até 2 atletas de fora do município por equipe.",
          "As 2 primeiras de cada grupo avançam à fase de mata."
        ],
        classificacao: { diretos: 2, terceiros: false, rebaixados: 0 },
        grupos: {
          A: ["Borracharia VB", "Hawai", "Napoli", "Esportivas"],
          B: ["Gurias da Vila", "Valência", "Aliadas", "Bellas"]
        },
        jogos: []
      },

      seletiva: {
        nome: "Seletiva",
        slug: "seletiva",
        accent: "#4E8FB0",
        info: [
          "Único caminho de acesso de novas equipes ao campeonato.",
          "Os 2 primeiros de cada grupo avançam à fase seguinte.",
          "As 4 classificadas ao final garantem vaga na Série Bronze.",
          "Máximo de 2 atletas por equipe que jogaram Ouro/Prata/Bronze em 2025."
        ],
        classificacao: { diretos: 2, terceiros: false, rebaixados: 0 },
        grupos: {
          A: ["Juv. Sta Marta", "CSKA", "Pedregulho"],
          B: ["Céu Azul", "Baccarat", "Austin FC"],
          C: ["Tabajara", "Brilhante", "Botafogo"],
          D: ["Real Madruga", "Juv. da Costa", "JDN Futsal"],
          E: ["Spartak", "Milionários", "Rosário"],
          F: ["Universal", "Juventude", "E.C.C.V."],
          G: ["Gurizada da Vila", "CGU Futled", "Qatar"],
          H: ["Aston Villa", "Fluminense", "Litoral"]
        },
        jogos: []
      }

    }
  }
};

window.CAMPEONATOS = CAMPEONATOS;