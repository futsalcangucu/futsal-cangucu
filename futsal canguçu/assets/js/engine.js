/* ===========================================================
   engine.js — motor de classificação
   Regras do Regulamento Municipal de Futsal 2026:
   - Vitória = 3 pts, Empate = 1 pt, Derrota = 0 pts
   - Desempate entre 2: confronto direto, gols sofridos,
     saldo, gols feitos, vitórias, vermelhos, amarelos, sorteio
   - Desempate entre 3+: gols sofridos, saldo, gols feitos,
     vitórias, vermelhos, amarelos, sorteio
   =========================================================== */

function calcularClassificacao(grupoNome, equipesDoGrupo, todosOsJogos) {
  const jogos = todosOsJogos.filter(j =>
    j.grupo === grupoNome &&
    j.golsMandante !== null && j.golsMandante !== undefined &&
    j.golsVisitante !== null && j.golsVisitante !== undefined
  );

  const tabela = {};
  for (const eq of equipesDoGrupo) {
    tabela[eq] = {
      nome: eq,
      pts: 0, j: 0, v: 0, e: 0, d: 0,
      gf: 0, gs: 0, sg: 0,
      am: 0, vm: 0
    };
  }

  for (const jogo of jogos) {
    const m = tabela[jogo.mandante];
    const v = tabela[jogo.visitante];
    if (!m || !v) continue;

    const gm = Number(jogo.golsMandante);
    const gv = Number(jogo.golsVisitante);

    m.j++; v.j++;
    m.gf += gm; m.gs += gv;
    v.gf += gv; v.gs += gm;
    m.sg = m.gf - m.gs;
    v.sg = v.gf - v.gs;

    if (jogo.cartoesAmarelosMandante)  m.am += Number(jogo.cartoesAmarelosMandante);
    if (jogo.cartoesVermelhosMandante) m.vm += Number(jogo.cartoesVermelhosMandante);
    if (jogo.cartoesAmarelosVisitante)  v.am += Number(jogo.cartoesAmarelosVisitante);
    if (jogo.cartoesVermelhosVisitante) v.vm += Number(jogo.cartoesVermelhosVisitante);

    if (gm > gv)      { m.v++; m.pts += 3; v.d++; }
    else if (gm < gv) { v.v++; v.pts += 3; m.d++; }
    else              { m.e++; m.pts++;     v.e++; v.pts++; }
  }

  const times = Object.values(tabela);
  return ordenarClassificacao(times, jogos);
}

function ordenarClassificacao(times, jogos) {
  if (times.length === 0) return [];

  times.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    return desempatarDois(a, b, jogos);
  });

  // Reordena grupos de empate entre 3+ com critério próprio
  let resultado = [];
  let i = 0;
  while (i < times.length) {
    let j = i;
    while (j < times.length && times[j].pts === times[i].pts) j++;
    const grupo = times.slice(i, j);
    if (grupo.length === 2) {
      grupo.sort((a, b) => desempatarDois(a, b, jogos));
    } else if (grupo.length >= 3) {
      grupo.sort((a, b) => desempatarTresMais(a, b));
    }
    resultado = resultado.concat(grupo);
    i = j;
  }
  return resultado;
}

/* Desempate entre 2 equipes — Art. 50 do Regulamento */
function desempatarDois(a, b, jogos) {
  const d = confrontoDireto(a.nome, b.nome, jogos);
  if (d !== 0) return d;
  if (a.gs !== b.gs) return a.gs - b.gs;
  if (b.sg !== a.sg) return b.sg - a.sg;
  if (b.gf !== a.gf) return b.gf - a.gf;
  if (b.v  !== a.v)  return b.v  - a.v;
  if (a.vm !== b.vm) return a.vm - b.vm;
  if (a.am !== b.am) return a.am - b.am;
  return 0;
}

/* Desempate entre 3+ equipes — Art. 50 do Regulamento */
function desempatarTresMais(a, b) {
  if (a.gs !== b.gs) return a.gs - b.gs;
  if (b.sg !== a.sg) return b.sg - a.sg;
  if (b.gf !== a.gf) return b.gf - a.gf;
  if (b.v  !== a.v)  return b.v  - a.v;
  if (a.vm !== b.vm) return a.vm - b.vm;
  if (a.am !== b.am) return a.am - b.am;
  return 0;
}

function confrontoDireto(nomeA, nomeB, jogos) {
  let ptsA = 0, ptsB = 0;
  for (const j of jogos) {
    if (j.golsMandante === null || j.golsMandante === undefined) continue;
    if (j.mandante === nomeA && j.visitante === nomeB) {
      const gm = Number(j.golsMandante), gv = Number(j.golsVisitante);
      if (gm > gv) ptsA += 3;
      else if (gm < gv) ptsB += 3;
      else { ptsA++; ptsB++; }
    } else if (j.mandante === nomeB && j.visitante === nomeA) {
      const gm = Number(j.golsMandante), gv = Number(j.golsVisitante);
      if (gm > gv) ptsB += 3;
      else if (gm < gv) ptsA += 3;
      else { ptsA++; ptsB++; }
    }
  }
  return ptsB - ptsA;
}

/* ==========================================================
   htmlClassificacao
   config = {
     diretos:   N,     // posições 1..N ficam em dourado (classificados diretos)
     terceiros: bool,  // posição N+1 fica em azul (melhor terceiro)
     rebaixados: M     // últimas M posições ficam em vermelho
   }
   ========================================================== */
function htmlClassificacao(classificacao, nomeGrupo, config) {
  const { diretos = 2, terceiros = false, rebaixados = 0 } = config || {};

  if (!classificacao || classificacao.length === 0) {
    return `<div class="standings-empty">Nenhuma partida registrada ainda.</div>`;
  }

  const total = classificacao.length;

  const rows = classificacao.map((t, idx) => {
    const pos = idx + 1;
    let rowClass = '';

    if (pos <= diretos) {
      rowClass = 'qualify';
    } else if (terceiros && pos === diretos + 1) {
      rowClass = 'qualify-conditional';
    } else if (rebaixados > 0 && pos > total - rebaixados) {
      rowClass = 'relegated';
    }

    return `<tr class="${rowClass}">
      <td class="pos">${pos}</td>
      <td class="team">${t.nome}</td>
      <td>${t.j}</td>
      <td class="pts">${t.pts}</td>
      <td>${t.v}</td>
      <td>${t.e}</td>
      <td>${t.d}</td>
      <td>${t.gf}</td>
      <td>${t.gs}</td>
      <td>${t.sg > 0 ? '+' : ''}${t.sg}</td>
    </tr>`;
  }).join('');

  // Legenda dinâmica: só aparece quando há algo a explicar
  const legendItems = [];
  if (diretos > 0)  legendItems.push(`<span class="leg qualify-leg">Classificado</span>`);
  if (terceiros)    legendItems.push(`<span class="leg conditional-leg">Melhor 3° (disputa vaga)</span>`);
  if (rebaixados > 0) legendItems.push(`<span class="leg relegated-leg">Rebaixado</span>`);
  const legend = legendItems.length
    ? `<div class="standings-legend">${legendItems.join('')}</div>`
    : '';

  return `<div class="table-scroll">
  <table class="standings">
    <caption>Grupo ${nomeGrupo}</caption>
    <thead>
      <tr>
        <th>#</th>
        <th style="text-align:left">Equipe</th>
        <th title="Jogos">J</th>
        <th title="Pontos">PTS</th>
        <th title="Vitórias">V</th>
        <th title="Empates">E</th>
        <th title="Derrotas">D</th>
        <th title="Gols feitos">GF</th>
        <th title="Gols sofridos">GS</th>
        <th title="Saldo">SG</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</div>${legend}`;
}

/* ---- renderiza lista de partidas ---- */
function htmlPartidas(jogos, grupoFiltro) {
  const filtrados = jogos.filter(j =>
    !grupoFiltro || j.grupo === grupoFiltro
  );

  if (!filtrados.length) {
    return `<div class="empty-state">Nenhuma partida cadastrada neste grupo ainda.</div>`;
  }

  const tickets = filtrados.map(j => {
    const temPlacar = j.golsMandante !== null && j.golsMandante !== undefined;
    const placar = temPlacar
      ? `<span>${j.golsMandante}</span><span class="dash">—</span><span>${j.golsVisitante}</span>`
      : null;

    const status = temPlacar
      ? `<span class="status encerrado">Encerrado</span>`
      : `<span class="status agendado">Agendado</span>`;

    const dataStr = j.data
      ? `<span>${new Date(j.data + 'T00:00:00').toLocaleDateString('pt-BR', {day:'2-digit',month:'2-digit'})}</span>`
      : '';

    const amM = Number(j.cartoesAmarelosMandante  || 0);
    const vmM = Number(j.cartoesVermelhosMandante || 0);
    const amV = Number(j.cartoesAmarelosVisitante  || 0);
    const vmV = Number(j.cartoesVermelhosVisitante || 0);
    const temCartoes = amM || vmM || amV || vmV;

    const cartoesHtml = temCartoes ? `
      <div class="cards-row">
        <span>${j.mandante}: ${amM ? `<span class="chip"><span class="sq y"></span>${amM}</span>` : '—'} ${vmM ? `<span class="chip"><span class="sq r"></span>${vmM}</span>` : ''}</span>
        <span>${j.visitante}: ${amV ? `<span class="chip"><span class="sq y"></span>${amV}</span>` : '—'} ${vmV ? `<span class="chip"><span class="sq r"></span>${vmV}</span>` : ''}</span>
      </div>` : '';

    return `<div class="ticket reveal">
  <div class="ticket-top">
    <span>Grupo ${j.grupo} · ${j.fase ? faseLabel(j.fase) : 'Classificatória'}</span>
    <span style="display:flex;align-items:center;gap:8px;">${dataStr}${status}</span>
  </div>
  <div class="teams">
    <span class="name">${j.mandante}</span>
    <span class="score${placar ? '' : ' tbd'}">${placar || 'A definir'}</span>
    <span class="name right">${j.visitante}</span>
  </div>
  ${cartoesHtml}
</div>`;
  }).join('');

  return `<div class="tickets">${tickets}</div>`;
}

function faseLabel(fase) {
  const m = {
    classificatoria: 'Classificatória',
    quartas:         'Quartas de Final',
    semifinal:       'Semifinal',
    final:           'Final'
  };
  return m[fase] || fase;
}

window.Engine = { calcularClassificacao, htmlClassificacao, htmlPartidas };