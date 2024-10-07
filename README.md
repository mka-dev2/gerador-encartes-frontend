
# Gerador de Encartes - Front-end

Este é o front-end do projeto Gerador de Encartes, desenvolvido em Next.js, que permite criar e personalizar encartes facilmente. Esta aplicação se comunica com o back-end para processar imagens e gerenciar uploads.

## Tecnologias Utilizadas

- **Next.js**: Framework React para renderização do front-end e gerenciamento de rotas.
- **React**: Biblioteca JavaScript para construção da interface de usuário.
- **Tailwind CSS**: Framework de CSS para estilização rápida e eficiente.
- **TypeScript**: Linguagem de programação que adiciona tipagem estática ao JavaScript.
- **Puppeteer**: Ferramenta para manipulação de navegadores para geração de imagens.
- **ExcelJS**: Biblioteca para manipulação de arquivos Excel.
- **HTML-to-Image**: Biblioteca para converter elementos HTML em imagens.
- **PapaParse**: Parser para CSV.

## Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## Instalação

1. Clone o repositório para a sua máquina local:

   ```bash
   git clone https://github.com/seu-usuario/gerador-encartes-frontend.git
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd gerador-encartes-frontend
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

   ou, se estiver usando o yarn:

   ```bash
   yarn install
   ```

## Configuração

Antes de rodar o projeto, certifique-se de configurar a URL correta do back-end no arquivo `.env.local`. Crie um arquivo `.env.local` na raiz do projeto e adicione:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Substitua `http://localhost:3001` pela URL do back-end em produção.

## Scripts Disponíveis

- **`npm run dev`** ou **`yarn dev`**: Executa o servidor Next.js em modo de desenvolvimento.
- **`npm run build`** ou **`yarn build`**: Cria uma versão otimizada para produção do front-end.
- **`npm run start`** ou **`yarn start`**: Inicia o servidor com o build de produção.
- **`npm run lint`** ou **`yarn lint`**: Executa o linter para verificar a qualidade do código.
- **`npm run test`** ou **`yarn test`**: Executa os testes utilizando o Jest.

## Rodando o Projeto

Para rodar o projeto em modo de desenvolvimento, execute o comando:

```bash
npm run dev
```

ou

```bash
yarn dev
```

A aplicação estará disponível em `http://localhost:3000`.

## Build para Produção

Para gerar o build de produção do front-end, execute:

```bash
npm run build
```

ou

```bash
yarn build
```

Em seguida, para iniciar o servidor de produção, use:

```bash
npm start
```

ou

```bash
yarn start
```

## Deploy

### Vercel

O deploy pode ser feito facilmente utilizando a plataforma [Vercel](https://vercel.com/):

1. Conecte seu repositório Git com a Vercel.
2. Defina a variável de ambiente `NEXT_PUBLIC_API_URL` na Vercel, apontando para o URL do back-end.
3. A Vercel cuidará do processo de build e deploy automaticamente.

### Configuração de Ambiente

Certifique-se de configurar corretamente a variável `NEXT_PUBLIC_API_URL` em produção para apontar para a API do back-end.

## Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](./LICENSE) para mais informações.
