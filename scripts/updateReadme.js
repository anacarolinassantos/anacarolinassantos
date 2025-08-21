scripts/updateReadme.js.

  const fs = require('fs');
const fetch = require('node-fetch');

const username = 'anacarolinassantos';
const readmePath = './README.md';

async function getRepos() {
  const response = await fetch(`https://api.github.com/users/${username}/repos`);
  const data = await response.json();
  return data;
}

async function getLanguages(repos) {
  const langTotals = {};
  for (const repo of repos) {
    const response = await fetch(repo.languages_url);
    const langs = await response.json();
    for (const [lang, bytes] of Object.entries(langs)) {
      langTotals[lang] = (langTotals[lang] || 0) + bytes;
    }
  }
  return langTotals;
}

async function generateReadme() {
  const repos = await getRepos();
  const languages = await getLanguages(repos);

  const totalRepos = repos.length;
  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

  let langText = '';
  for (const [lang, bytes] of Object.entries(languages)) {
    langText += `- ${lang}: ${bytes} bytes\n`;
  }

  const content = `
# Estatísticas do GitHub de ${username}

**Total de repositórios:** ${totalRepos}  
**Total de estrelas:** ${totalStars}

## Linguagens usadas
${langText}
`;

  fs.writeFileSync(readmePath, content.trim());
  console.log('README atualizado com sucesso!');
}

generateReadme();
