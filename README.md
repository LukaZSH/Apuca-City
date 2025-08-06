# Apuca City - Plataforma de Relatos Urbanos

![Ícone do Apuca City](https://raw.githubusercontent.com/LukaZSH/Apuca-City/main/public/pwa-512x512.png)

**Apuca City** é uma aplicação web progressiva (PWA) desenvolvida para permitir que os cidadãos de Apucarana, PR, relatem problemas urbanos de forma colaborativa. A plataforma centraliza os relatos, permite o acompanhamento do status por parte da comunidade e oferece um painel administrativo para a gestão e resolução dos problemas.

**[Acesse a demonstração ao vivo](https://apuca-city.vercel.app/)**

---

## 📋 Índice

* [Sobre o Projeto](#-sobre-o-projeto)
* [🖼️ Telas do Projeto](#️-telas-do-projeto)
* [✨ Funcionalidades](#-funcionalidades)
    * [Visitante (Não Autenticado)](#visitante-não-autenticado)
    * [Cidadão (Usuário Autenticado)](#cidadão-usuário-autenticado)
    * [Administrador](#administrador)
* [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
* [🚀 Como Executar o Projeto Localmente](#-como-executar-o-projeto-localmente)
* [🔧 Configuração do Supabase](#-configuração-do-supabase)
* [📄 Licença](#-licença)

---

## 💻 Sobre o Projeto

O objetivo do **Apuca City** é criar uma ponte direta entre a população e a administração municipal, utilizando a tecnologia para agilizar a identificação e resolução de problemas urbanos. Cidadãos podem reportar questões como buracos na rua, lixo acumulado e problemas de iluminação, anexando fotos e a localização exata, enquanto o poder público pode gerenciar as demandas de forma centralizada e transparente.

A aplicação foi construída como um **Progressive Web App (PWA)**, garantindo uma experiência de usuário fluida e "instalável" em dispositivos móveis e desktops, sem a necessidade de uma loja de aplicativos.

---

## 🖼️ Telas do Projeto

| Tela de Login | Dashboard Principal |
| :---: | :---: |
| ![Tela de Login do Apuca City]([COLE A URL DA IMAGEM AQUI]) | ![Dashboard Principal do Apuca City]([COLE A URL DA IMAGEM AQUI]) |

| Painel do Administrador | Versão Mobile |
| :---: | :---: |
| ![Painel do Administrador com Gráficos]([COLE A URL DA IMAGEM AQUI]) | ![Apuca City rodando em um celular]([COLE A URL DA IMAGEM AQUI]) |


---

## ✨ Funcionalidades

O sistema possui três níveis de acesso com funcionalidades distintas:

### Visitante (Não Autenticado)
* Visualizar o mural com todos os relatos de problemas.
* Consultar os detalhes de cada relato, incluindo descrição, fotos e localização.
* Acessar a plataforma sem a necessidade de criar uma conta.
* Ser convidado a criar uma conta ou fazer login para interagir.

### Cidadão (Usuário Autenticado)
* Todas as funcionalidades do Visitante.
* **Autenticação:** Criar conta, fazer login e recuperar senha.
* **Criar Relatos:** Reportar novos problemas com título, descrição, tipo, fotos e localização precisa.
* **Apoiar Relatos:** Dar "like" em problemas existentes para aumentar sua relevância.
* **Gerenciar Perfil:** Atualizar nome, foto de perfil e senha.
* **Meus Relatos:** Visualizar uma lista com todos os problemas que reportou.

### Administrador
* Todas as funcionalidades do Cidadão.
* **Painel Administrativo:** Acessar uma área restrita com estatísticas e ferramentas de gerenciamento.
* **Visualizar Estatísticas:** Gráficos sobre o número de problemas por status e por tipo.
* **Gerenciar Status:** Alterar o status de um problema (Pendente, Em Andamento, Resolvido).
* **Gerenciar Usuários:** Visualizar a lista de todos os usuários cadastrados e excluir contas (ex: em caso de abuso da plataforma).

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

* **Frontend:**
    * **React** com **Vite**
    * **TypeScript**
    * **Tailwind CSS** para estilização
    * **Shadcn/ui** para componentes de UI
    * **React Query** para gerenciamento de estado do servidor
    * **Recharts** para visualização de dados (gráficos)
    * **Zod** para validação de esquemas
* **Backend & Banco de Dados (BaaS):**
    * **Supabase**
        * **Authentication:** Gerenciamento de usuários e segurança.
        * **PostgreSQL Database:** Armazenamento de dados com Row Level Security (RLS).
        * **Storage:** Hospedagem de imagens dos relatos.
        * **Edge Functions (Deno):** Funções serverless para operações seguras, como a exclusão de usuários.
* **Deploy:**
    * **Vercel** para o frontend.
    * **Supabase** para o backend e funções.

---

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e rodar o projeto em sua máquina.

### Pré-requisitos
* [Node.js](https://nodejs.org/) (versão LTS recomendada)
* [Git](https://git-scm.com/)
* Uma conta no [Supabase](https://supabase.com/)

### Instalação
1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/LukaZSH/Apuca-City.git](https://github.com/LukaZSH/Apuca-City.git)
    cd Apuca-City
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    * Crie um arquivo chamado `.env` na raiz do projeto.
    * Adicione suas credenciais do Supabase (encontradas em *Project Settings > API* no seu painel do Supabase):
        ```
        VITE_SUPABASE_URL="SUA_URL_DO_PROJETO_SUPABASE"
        VITE_SUPABASE_ANON_KEY="SUA_CHAVE_ANON_DO_PROJETO_SUPABASE"
        ```

4.  **Execute o projeto:**
    ```bash
    npm run dev
    ```
    O aplicativo estará disponível em `http://localhost:8080`.

---

## 🔧 Configuração do Supabase

Para que a aplicação funcione corretamente, é necessário configurar as políticas de segurança (RLS) e a Edge Function no seu projeto Supabase.

1.  **Políticas de Segurança (RLS):**
    Execute os scripts SQL necessários no **SQL Editor** do seu painel Supabase para garantir que os usuários só possam acessar e modificar os dados permitidos. A principal política a ser adicionada é a que permite que administradores visualizem todos os perfis.

2.  **Edge Function (`delete-user`):**
    * Instale a CLI do Supabase: `npm install supabase --save-dev`
    * Faça login: `npx supabase login`
    * Vincule seu projeto: `npx supabase link --project-ref SEU_PROJECT_REF`
    * Faça o deploy da função que está na pasta `supabase/functions/delete-user`:
        ```bash
        npx supabase functions deploy delete-user
        ```

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.


