# 📱 O Celular Está Me Ouvindo? — Privacidade Digital & Algoritmos

> **Projeto Acadêmico PBL (Problem-Based Learning)**  
> **Instituição:** Atitus Educação • **Curso:** Ciência da Computação

Site interativo de divulgação científica e conscientização em privacidade digital, desenvolvido para explicar ao público geral como funcionam os algoritmos de recomendação, o rastreamento comportamental e como proteger smartphones Android e iOS.

## ✨ Funcionalidades do Site (`index.html`)

1. **Mito vs. Ciência:** Explicação didática sobre bateria, tráfego de rede e custo computacional da gravação contínua vs. modelos preditivos.
2. **Espelho Digital ao Vivo (*Browser Fingerprinting*):** Demonstração 100% local (sem coletar nem salvar dados) do que qualquer página web detecta instantaneamente sobre o aparelho do visitante.
3. **Simulador de Bastidores do Algoritmo:** 3 casos reais do cotidiano destrinchados em etapas técnicas (Grafo Social, Wi-Fi compartilhado, *Dwell Time* e Pixels de rastreamento).
4. **Manual Interativo de Autodefesa Digital:** Caminhos exatos para **Android** e **iPhone (iOS)** com detecção automática do aparelho e barra de progresso de blindagem (`0%` a `100%`).
5. **Quiz Rápido "Mito ou Verdade":** Perguntas interativas com feedback imediato.

## 🚀 Como Publicar no GitHub Pages

1. Crie um repositório público no GitHub (ex.: `pbl-privacidade-digital`).
2. Envie os arquivos desta pasta (`index.html`, `css/`, `js/`, `assets/`).
3. No repositório do GitHub, acesse **Settings ➔ Pages**.
4. Em **Build and deployment ➔ Source**, selecione **Deploy from a branch**, escolha `main` e `/ (root)` e clique em **Save**.
5. Em cerca de 1 minuto seu site estará no ar em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

## 🎨 Atualizando o QR Code dos Folders

Assim que tiver o link oficial do GitHub Pages, gere novamente os 3 folders com o QR Code apontando para o seu site:

```bash
python generate_folders.py "https://SEU-USUARIO.github.io/NOME-DO-REPO/"
```

Os arquivos atualizados estarão prontos na pasta `renders/`.
