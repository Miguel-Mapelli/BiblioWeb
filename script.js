(function(){
  "use strict";

  /* ---------------- Dados ---------------- */
  var COVER_PALETTES = {
    "Programação": ["#2F5233","#1E3A22"],
    "Literatura Brasileira": ["#A23B2E","#7C2C22"],
    "Ficção Científica": ["#2C4A66","#1B3247"],
    "Clássicos": ["#6B4E9C","#4D3873"],
    "Não-ficção": ["#A07C34","#7A5E27"],
    "Terror": ["#3A1E1E","#210F0F"],
    "Fantasia": ["#3E2C6B","#2A1D4A"],
    "Romance": ["#8C3159","#631F3F"],
    "Poesia": ["#2F6B5E","#1F4A41"],
    "Autoajuda": ["#B4842A","#8A611E"],
    "História": ["#4A5A3C","#333F29"]
  };
  // Cor de capa segue o primeiro gênero cadastrado no livro.
  function coverStyle(cats){
    var p = COVER_PALETTES[(cats && cats[0])] || ["#5B584E","#3F3D34"];
    return "background: linear-gradient(155deg,"+p[0]+","+p[1]+");";
  }
  // Capas reais vêm da API pública de capas da Open Library, indexadas pelo ISBN.
  // Quando não há capa cadastrada, o gradiente + inicial (já presentes na marcação) permanecem visíveis.
  function coverUrl(b){
    var digits = String((b && b.isbn) || "").replace(/[^0-9Xx]/g,"");
    if(!digits) return "";
    return "https://covers.openlibrary.org/b/isbn/"+digits+"-L.jpg";
  }

  var STORAGE_KEY = "biblioweb_v1";

  function seedData(){
    return {
      books: [
        { id: "b1", title: "Clean Code", author: "Robert C. Martin", categories: ["Programação","Não-ficção","Internacional"], status: "Disponível",
          synopsis: "Um guia prático sobre como escrever código legível, sustentável e fácil de manter, com exemplos e princípios que qualquer desenvolvedor pode aplicar no dia a dia.",
          publisher: "Prentice Hall", edition: "1ª edição", year: "2008", isbn: "978-0-13-235088-4", language: "Inglês", pages: "464", dimensions: "23,5 x 17,8 x 3,0 cm", weight: "780 g" },
        { id: "b2", title: "Dom Casmurro", author: "Machado de Assis", categories: ["Literatura Brasileira","Nacional","Clássicos","Romance"], status: "Disponível",
          synopsis: "Bentinho narra sua vida e a dúvida que o persegue sobre a fidelidade de Capitu, em um dos maiores clássicos da literatura brasileira.",
          publisher: "Editora Ática", edition: "3ª edição", year: "2019", isbn: "978-85-08-18442-1", language: "Português", pages: "256", dimensions: "20,5 x 13,5 x 1,5 cm", weight: "220 g" },
        { id: "b3", title: "1984", author: "George Orwell", categories: ["Ficção Científica","Clássicos","Internacional"], status: "Emprestado",
          synopsis: "Em uma sociedade vigiada pelo Grande Irmão, Winston Smith desafia um regime que controla até os pensamentos de seus cidadãos.",
          publisher: "Companhia das Letras", edition: "1ª edição", year: "2009", isbn: "978-85-359-1487-8", language: "Português", pages: "416", dimensions: "21,0 x 14,0 x 2,5 cm", weight: "380 g" },
        { id: "b4", title: "O Cortiço", author: "Aluísio Azevedo", categories: ["Literatura Brasileira","Nacional","Clássicos"], status: "Disponível",
          synopsis: "Retrato naturalista da vida em um cortiço carioca, onde ambição, desejo e sobrevivência se cruzam entre seus moradores.",
          publisher: "Editora Ática", edition: "2ª edição", year: "2004", isbn: "978-85-08-08451-6", language: "Português", pages: "240", dimensions: "20,0 x 13,5 x 1,3 cm", weight: "200 g" },
        { id: "b5", title: "Sapiens", author: "Yuval Noah Harari", categories: ["Não-ficção","História","Internacional"], status: "Disponível",
          synopsis: "Uma história da humanidade, da revolução cognitiva à era da informação, explicando como o Homo sapiens conquistou o planeta.",
          publisher: "L&PM Editores", edition: "1ª edição", year: "2015", isbn: "978-85-254-3153-1", language: "Português", pages: "464", dimensions: "23,0 x 16,0 x 3,0 cm", weight: "620 g" },
        { id: "b6", title: "O Pequeno Príncipe", author: "Antoine de Saint-Exupéry", categories: ["Clássicos","Internacional","Infantojuvenil"], status: "Disponível",
          synopsis: "Um aviador perdido no deserto encontra um pequeno príncipe vindo de outro planeta, numa fábula sobre amor, perda e o que realmente importa.",
          publisher: "Agir", edition: "1ª edição", year: "2015", isbn: "978-85-220-1028-5", language: "Português", pages: "96", dimensions: "21,0 x 14,0 x 1,0 cm", weight: "150 g" },
        { id: "b7", title: "Duna", author: "Frank Herbert", categories: ["Ficção Científica","Internacional"], status: "Emprestado",
          synopsis: "No planeta desértico de Arrakis, Paul Atreides se vê no centro de uma luta por poder, religião e a especiaria mais valiosa do universo.",
          publisher: "Aleph", edition: "1ª edição", year: "2017", isbn: "978-85-7657-268-9", language: "Português", pages: "656", dimensions: "23,0 x 16,0 x 4,0 cm", weight: "750 g" },
        { id: "b8", title: "A Revolução dos Bichos", author: "George Orwell", categories: ["Clássicos","Internacional","Suspense"], status: "Disponível",
          synopsis: "Os animais de uma fazenda expulsam seus donos e tentam construir uma sociedade igualitária — até que o poder começa a corromper.",
          publisher: "Companhia das Letras", edition: "1ª edição", year: "2007", isbn: "978-85-359-0931-7", language: "Português", pages: "152", dimensions: "21,0 x 14,0 x 1,2 cm", weight: "180 g" },
        { id: "b9", title: "Vidas Secas", author: "Graciliano Ramos", categories: ["Literatura Brasileira","Nacional","Clássicos"], status: "Disponível",
          synopsis: "A saga de uma família de retirantes que enfrenta a seca no sertão nordestino, em prosa seca e precisa.",
          publisher: "Editora Record", edition: "1ª edição", year: "2019", isbn: "978-85-01-11234-6", language: "Português", pages: "176", dimensions: "20,5 x 13,5 x 1,2 cm", weight: "190 g" },
        { id: "b10", title: "O Guia do Mochileiro das Galáxias", author: "Douglas Adams", categories: ["Ficção Científica","Internacional"], status: "Disponível",
          synopsis: "Momentos depois de a Terra ser demolida para dar lugar a uma autoestrada espacial, Arthur Dent embarca numa aventura absurda pela galáxia.",
          publisher: "Arqueiro", edition: "1ª edição", year: "2010", isbn: "978-85-8041-034-2", language: "Português", pages: "208", dimensions: "20,8 x 13,8 x 1,4 cm", weight: "210 g" },
        { id: "b11", title: "Introduction to Algorithms", author: "Cormen, Leiserson, Rivest & Stein", categories: ["Programação","Internacional"], status: "Emprestado",
          synopsis: "Referência completa sobre algoritmos e estruturas de dados, amplamente usada em cursos de ciência da computação.",
          publisher: "MIT Press", edition: "3ª edição", year: "2009", isbn: "978-0-262-03384-8", language: "Inglês", pages: "1312", dimensions: "23,5 x 19,0 x 6,0 cm", weight: "2100 g" },
        { id: "b12", title: "Capitães da Areia", author: "Jorge Amado", categories: ["Literatura Brasileira","Nacional"], status: "Disponível",
          synopsis: "Um grupo de meninos abandonados vive de pequenos furtos pelas ruas de Salvador, entre lealdade, sonho e sobrevivência.",
          publisher: "Companhia das Letras", edition: "1ª edição", year: "2008", isbn: "978-85-359-1223-2", language: "Português", pages: "256", dimensions: "20,5 x 13,5 x 1,6 cm", weight: "230 g" },
        { id: "b13", title: "It: A Coisa", author: "Stephen King", categories: ["Terror","Internacional","Suspense"], status: "Disponível",
          synopsis: "Em Derry, um grupo de amigos enfrenta uma entidade ancestral que desperta a cada 27 anos para se alimentar dos medos da cidade.",
          publisher: "Suma", edition: "1ª edição", year: "2017", isbn: "978-85-5651-146-2", language: "Português", pages: "1104", dimensions: "23,0 x 16,0 x 5,5 cm", weight: "980 g" },
        { id: "b14", title: "O Iluminado", author: "Stephen King", categories: ["Terror","Internacional","Suspense"], status: "Emprestado",
          synopsis: "Jack Torrance aceita cuidar de um hotel isolado no inverno e vê a mente ir se corrompendo junto com as forças sombrias do lugar.",
          publisher: "Suma", edition: "1ª edição", year: "2019", isbn: "978-85-5651-231-5", language: "Português", pages: "544", dimensions: "23,0 x 16,0 x 3,0 cm", weight: "520 g" },
        { id: "b15", title: "Grande Sertão: Veredas", author: "Guimarães Rosa", categories: ["Literatura Brasileira","Nacional","Clássicos"], status: "Disponível",
          synopsis: "Riobaldo narra sua vida de jagunço no sertão, entre o amor por Diadorim e o pacto com o demônio que o assombra.",
          publisher: "Nova Fronteira", edition: "1ª edição", year: "2019", isbn: "978-85-209-4530-1", language: "Português", pages: "624", dimensions: "23,0 x 16,0 x 3,5 cm", weight: "560 g" },
        { id: "b16", title: "Harry Potter e a Pedra Filosofal", author: "J.K. Rowling", categories: ["Fantasia","Internacional","Infantojuvenil"], status: "Disponível",
          synopsis: "Um garoto órfão descobre, no dia do seu aniversário, que é um bruxo e embarca para a Escola de Magia e Bruxaria de Hogwarts.",
          publisher: "Rocco", edition: "1ª edição", year: "2017", isbn: "978-85-325-1101-4", language: "Português", pages: "264", dimensions: "20,8 x 13,8 x 1,8 cm", weight: "280 g" },
        { id: "b17", title: "O Senhor dos Anéis: A Sociedade do Anel", author: "J.R.R. Tolkien", categories: ["Fantasia","Internacional","Clássicos"], status: "Disponível",
          synopsis: "Frodo Bolseiro herda um anel de poder e parte em uma jornada para destruí-lo antes que caia nas mãos do Senhor do Escuro.",
          publisher: "HarperCollins", edition: "2ª edição", year: "2019", isbn: "978-85-9503-088-7", language: "Português", pages: "576", dimensions: "23,0 x 16,0 x 3,2 cm", weight: "540 g" },
        { id: "b18", title: "Memórias Póstumas de Brás Cubas", author: "Machado de Assis", categories: ["Literatura Brasileira","Nacional","Clássicos","Romance"], status: "Disponível",
          synopsis: "Um defunto-autor narra, com ironia e digressões, os episódios de sua vida e as pequenas vaidades da sociedade em que viveu.",
          publisher: "Penguin-Companhia", edition: "1ª edição", year: "2014", isbn: "978-85-8285-035-9", language: "Português", pages: "272", dimensions: "20,5 x 13,5 x 1,6 cm", weight: "230 g" },
        { id: "b19", title: "O Poder do Hábito", author: "Charles Duhigg", categories: ["Não-ficção","Autoajuda","Internacional"], status: "Disponível",
          synopsis: "Uma investigação sobre como os hábitos funcionam no cérebro e como é possível transformá-los na vida pessoal e profissional.",
          publisher: "Objetiva", edition: "1ª edição", year: "2012", isbn: "978-85-8105-030-0", language: "Português", pages: "408", dimensions: "23,0 x 16,0 x 2,4 cm", weight: "460 g" },
        { id: "b20", title: "Antologia Poética", author: "Carlos Drummond de Andrade", categories: ["Poesia","Literatura Brasileira","Nacional"], status: "Disponível",
          synopsis: "Uma seleção dos principais poemas de Drummond, reunindo décadas de reflexão sobre o cotidiano, o amor e a condição humana.",
          publisher: "Companhia das Letras", edition: "1ª edição", year: "2012", isbn: "978-85-359-2079-4", language: "Português", pages: "320", dimensions: "20,5 x 13,5 x 1,8 cm", weight: "260 g" }
      ],
      loans: [],
      reservations: [
        { id: "r1", bookId: "b3", title: "1984", author: "George Orwell", patron: "Carla Nunes", reservedOn: new Date(Date.now()-2*24*3600*1000).toISOString() }
      ],
      activity: [
        { text: "Sistema inicializado com 20 títulos no acervo.", time: "há 2 dias" }
      ]
    };
  }

  function loadData(){
    try{
      var raw = localStorage.getItem(STORAGE_KEY);
      if(raw) return JSON.parse(raw);
    }catch(e){}
    var seeded = seedData();
    saveData(seeded);
    return seeded;
  }
  function saveData(d){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }catch(e){}
  }

  var data = loadData();

  /* ---------------- Sessão (papel + nome persistem entre recarregamentos) ---------------- */
  var SESSION_KEY = "biblioweb_session_v1";
  function loadSession(){
    try{
      var raw = sessionStorage.getItem(SESSION_KEY);
      if(raw) return JSON.parse(raw);
    }catch(e){}
    return null;
  }
  function saveSession(role, userName){
    try{ sessionStorage.setItem(SESSION_KEY, JSON.stringify({role:role, userName:userName})); }catch(e){}
  }
  function clearSession(){
    try{ sessionStorage.removeItem(SESSION_KEY); }catch(e){}
  }
  var restoredSession = loadSession();

  /* ---------------- Tema (claro/escuro) ---------------- */
  var THEME_KEY = "biblioweb_theme_v1";
  var ICON_SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
  var ICON_MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>';
  function effectiveTheme(){
    var attr = document.documentElement.getAttribute("data-theme");
    if(attr==="light" || attr==="dark") return attr;
    return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  }
  function updateThemeToggleIcon(){
    var btn = document.getElementById("theme-toggle");
    if(!btn) return;
    var dark = effectiveTheme()==="dark";
    btn.innerHTML = dark ? ICON_SUN : ICON_MOON;
    var label = dark ? "Mudar para modo claro" : "Mudar para modo escuro";
    btn.setAttribute("aria-label", label);
    btn.title = label;
  }
  function initTheme(){
    var saved = null;
    try{ saved = localStorage.getItem(THEME_KEY); }catch(e){}
    if(saved==="light" || saved==="dark") document.documentElement.setAttribute("data-theme", saved);
    updateThemeToggleIcon();
  }
  function bindThemeToggle(){
    var btn = document.getElementById("theme-toggle");
    if(!btn) return;
    btn.addEventListener("click", function(){
      var next = effectiveTheme()==="dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try{ localStorage.setItem(THEME_KEY, next); }catch(e){}
      updateThemeToggleIcon();
    });
  }

  /* ---------------- Estado da aplicação (papel/nome restaurados da sessão) ---------------- */
  var state = {
    screen: restoredSession ? (restoredSession.role==="bibliotecario" ? "painel" : "home") : "login",
    role: restoredSession ? restoredSession.role : null,          // "estudante" | "bibliotecario"
    userName: restoredSession ? restoredSession.userName : null,
    loginTab: "estudante",
    searchQuery: "",
    activeCategories: [],  // vazio = "Todas"; várias categorias = filtro em conjunto (AND)
    currentBookId: null,
    lastLoanId: null,
    lastReservationId: null,
    editingBookId: null,  // id do livro em edição no modal, ou "new"
    modalOpen: false
  };

  var CATEGORIES = ["Programação","Literatura Brasileira","Ficção Científica","Clássicos","Não-ficção",
    "Terror","Fantasia","Romance","Poesia","Suspense","Autoajuda","História","Infantojuvenil","Nacional","Internacional"];

  /* ---------------- Auxiliares gerais ---------------- */
  function initials(title){ return String(title||"").trim().charAt(0).toUpperCase(); }
  function fmtDate(d){
    var dt = (d instanceof Date) ? d : new Date(d);
    var dd = String(dt.getDate()).padStart(2,"0");
    var mm = String(dt.getMonth()+1).padStart(2,"0");
    return dd+"/"+mm+"/"+dt.getFullYear();
  }
  function addDays(date, days){
    var d = new Date(date);
    d.setDate(d.getDate()+days);
    return d;
  }
  function isOverdue(dueIso){
    return new Date(dueIso) < new Date(new Date().toDateString());
  }
  function findBook(id){
    for(var i=0;i<data.books.length;i++){ if(data.books[i].id===id) return data.books[i]; }
    return null;
  }
  function logActivity(text){
    data.activity.unshift({ text: text, time: "agora" });
    data.activity = data.activity.slice(0,8);
  }
  function toast(msg){
    var t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(function(){ t.classList.remove("show"); }, 2600);
  }
  function go(screen, extra){
    state.screen = screen;
    if(extra) for(var k in extra) state[k]=extra[k];
    window.scrollTo(0,0);
    render();
  }

  /* ---------------- Auxiliares de template ----------------
     tpl(id) clona o conteúdo de um <template> do index.html e devolve
     um DocumentFragment pronto para ser preenchido (querySelector) e
     inserido no DOM. */
  function tpl(id){
    var t = document.getElementById(id);
    return document.importNode(t.content, true);
  }
  // Preenche o container de cover/cover-sm com o gradiente + inicial e,
  // quando existir capa real, sobrepõe a imagem ao carregar. titleText
  // permite usar o título gravado no empréstimo/reserva (que pode diferir
  // do título atual do livro) enquanto a cor/capa seguem o livro, se ele
  // ainda existir no acervo.
  function applyCover(el, book, titleText){
    var title = titleText !== undefined ? titleText : (book && book.title);
    el.setAttribute("style", coverStyle(book && book.categories));
    el.textContent = initials(title);
    var url = coverUrl(book);
    if(!url) return;
    var img = document.createElement("img");
    img.src = url;
    img.alt = "Capa de " + (title || "");
    img.loading = "lazy";
    img.addEventListener("load", function(){ img.classList.add("loaded"); });
    img.addEventListener("error", function(){ img.remove(); });
    el.appendChild(img);
  }
  // Preenche um <span class="badge"> com o texto e a cor certos para o status.
  function fillBadge(el, status){
    el.textContent = status;
    el.classList.remove("badge-available","badge-borrowed");
    el.classList.add(status==="Disponível" ? "badge-available" : "badge-borrowed");
  }
  // Preenche uma linha vazia de tabela (colspan + mensagem).
  function fillEmptyRow(frag, colspan, message){
    var td = frag.querySelector("[data-slot='text']");
    td.colSpan = colspan;
    td.textContent = message;
  }

  /* ---------------- Render: shell ---------------- */
  function render(){
    var root = document.getElementById("app");
    root.innerHTML = "";
    if(state.screen === "login"){
      root.appendChild(renderLogin());
      bindLogin();
      return;
    }
    root.appendChild(renderShell());
    bindGlobal();
    bindScreen();
    if(state.modalOpen) openModalDom();
  }

  function renderShell(){
    var frag = tpl("tpl-shell");
    var brandBtn = frag.querySelector(".brand");
    brandBtn.setAttribute("data-nav", state.role==="bibliotecario" ? "painel" : "home");
    frag.querySelector("[data-slot='user-name']").textContent = state.userName || "";

    var items = state.role === "bibliotecario"
      ? [["painel","Painel"],["acervo","Acervo"],["emprestimos","Empréstimos"]]
      : [["home","Home"],["busca","Buscar"],["conta","Minha Conta"]];
    var nav = frag.querySelector(".nav");
    var userSpan = frag.querySelector(".nav-user");
    items.forEach(function(it){
      var link = tpl("tpl-nav-link").querySelector(".nav-link");
      link.setAttribute("data-nav", it[0]);
      link.textContent = it[1];
      if(state.screen===it[0]){
        link.classList.add("active");
        link.setAttribute("aria-current","page");
      }
      nav.insertBefore(link, userSpan);
    });

    frag.querySelector("#main").appendChild(renderScreen());
    return frag;
  }

  function bindGlobal(){
    document.querySelectorAll("[data-nav]").forEach(function(el){
      el.addEventListener("click", function(){
        var target = el.getAttribute("data-nav");
        if(target==="busca") go("busca", {searchQuery:"", activeCategories:[]});
        else go(target);
      });
    });
    var logoutBtn = document.querySelector('[data-action="logout"]');
    if(logoutBtn) logoutBtn.addEventListener("click", function(){
      state.role=null; state.userName=null; state.currentBookId=null;
      clearSession();
      go("login");
    });
    var resetBtn = document.querySelector('[data-action="reset-demo"]');
    if(resetBtn) resetBtn.addEventListener("click", function(){
      if(confirm("Isso apaga os empréstimos feitos e restaura o acervo original. Continuar?")){
        try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
        location.reload();
      }
    });
  }

  /* ---------------- Roteador de telas ---------------- */
  function renderScreen(){
    switch(state.screen){
      case "home": return renderHome();
      case "busca": return renderBusca();
      case "detalhe": return renderDetalhe();
      case "confirmacao": return renderConfirmacao();
      case "conta": return renderConta();
      case "painel": return renderPainel();
      case "acervo": return renderAcervo();
      case "emprestimos": return renderEmprestimosBib();
      default: return document.createDocumentFragment();
    }
  }
  function bindScreen(){
    switch(state.screen){
      case "home": return bindHome();
      case "busca": return bindBusca();
      case "detalhe": return bindDetalhe();
      case "confirmacao": return bindConfirmacao();
      case "conta": return bindConta();
      case "painel": return bindPainel();
      case "acervo": return bindAcervo();
      case "emprestimos": return bindEmprestimosBib();
    }
  }

  function mensagemTela(msg){
    var frag = tpl("tpl-mensagem-tela");
    frag.querySelector("[data-slot='mensagem']").textContent = msg;
    return frag;
  }

  /* ---------------- LOGIN ---------------- */
  function renderLogin(){
    var frag = tpl("tpl-login");
    var isEstudante = state.loginTab === "estudante";
    frag.querySelectorAll(".role-tab").forEach(function(tab){
      var active = tab.getAttribute("data-tab") === state.loginTab;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    frag.querySelector("[data-slot='submit-label']").textContent =
      "Entrar como " + (isEstudante ? "estudante" : "bibliotecário(a)");
    return frag;
  }
  function bindLogin(){
    document.querySelectorAll(".role-tab").forEach(function(el){
      el.addEventListener("click", function(){
        state.loginTab = el.getAttribute("data-tab");
        render();
      });
    });
    document.getElementById("login-form").addEventListener("submit", function(e){
      e.preventDefault();
      var name = document.getElementById("f-name").value.trim() || "Usuário";
      state.role = state.loginTab;
      state.userName = name;
      saveSession(state.role, state.userName);
      go(state.role==="bibliotecario" ? "painel" : "home");
      toast("Bem-vindo(a), "+name+"!");
    });
  }

  /* ---------------- HOME (estudante) ---------------- */
  function renderHome(){
    var frag = tpl("tpl-home");
    var destaques = data.books.filter(function(b){return b.status==="Disponível";}).slice(0,3);
    var cats = CATEGORIES;

    frag.querySelector("[data-slot='first-name']").textContent = (state.userName||"").split(" ")[0];

    var chips = frag.querySelector("[data-list='chips']");
    cats.forEach(function(c){
      var chip = tpl("tpl-chip").querySelector(".chip");
      chip.setAttribute("data-cat", c);
      chip.textContent = c;
      chips.appendChild(chip);
    });

    var grid = frag.querySelector("[data-list='livros']");
    var empty = frag.querySelector("[data-slot='empty']");
    if(destaques.length){
      destaques.forEach(function(b){ grid.appendChild(bookCardEl(b)); });
    }else{
      grid.hidden = true;
      empty.hidden = false;
    }
    return frag;
  }
  function bindHome(){
    document.getElementById("home-search-form").addEventListener("submit", function(e){
      e.preventDefault();
      var q = document.getElementById("home-search-input").value.trim();
      go("busca", {searchQuery:q, activeCategories:[]});
    });
    document.querySelectorAll("[data-cat]").forEach(function(el){
      el.addEventListener("click", function(){
        go("busca", {searchQuery:"", activeCategories: [el.getAttribute("data-cat")]});
      });
    });
    bindBookCards();
  }

  function bookCardEl(b){
    var frag = tpl("tpl-book-card");
    var card = frag.querySelector(".book-card");
    card.setAttribute("data-book", b.id);
    applyCover(frag.querySelector("[data-slot='cover']"), b);
    frag.querySelector("[data-slot='title']").textContent = b.title;
    frag.querySelector("[data-slot='author']").textContent = b.author;
    fillBadge(frag.querySelector("[data-slot='badge']"), b.status);
    return card;
  }
  function bindBookCards(){
    document.querySelectorAll("[data-book]").forEach(function(el){
      el.addEventListener("click", function(){
        go("detalhe", {currentBookId: el.getAttribute("data-book")});
      });
    });
  }

  /* ---------------- BUSCA (resultados de busca) ---------------- */
  function renderBusca(){
    var frag = tpl("tpl-busca");
    var q = state.searchQuery.toLowerCase();
    var selected = state.activeCategories;
    var results = data.books.filter(function(b){
      var matchQ = !q || b.title.toLowerCase().indexOf(q)>-1 || b.author.toLowerCase().indexOf(q)>-1 ||
        b.categories.some(function(c){ return c.toLowerCase().indexOf(q)>-1; });
      // Filtro em conjunto: com mais de uma categoria marcada, só entram livros que têm TODAS elas.
      var matchCat = selected.length===0 || selected.every(function(c){ return b.categories.indexOf(c)>-1; });
      return matchQ && matchCat;
    });

    frag.querySelector("#busca-input").value = state.searchQuery;

    var chips = frag.querySelector("[data-list='chips']");
    var allChip = tpl("tpl-chip").querySelector(".chip");
    allChip.setAttribute("data-cat", "Todas");
    allChip.textContent = "Todas";
    if(selected.length===0) allChip.classList.add("active");
    chips.appendChild(allChip);
    CATEGORIES.forEach(function(c){
      var chip = tpl("tpl-chip").querySelector(".chip");
      chip.setAttribute("data-cat", c);
      chip.textContent = c;
      if(selected.indexOf(c)>-1) chip.classList.add("active");
      chips.appendChild(chip);
    });

    var countLabel = results.length+' resultado'+(results.length===1?"":"s")+
      (q ? ' para "'+state.searchQuery+'"' : '');
    frag.querySelector("[data-slot='count']").textContent = countLabel;

    var list = frag.querySelector("[data-list='resultados']");
    var empty = frag.querySelector("[data-slot='empty']");
    if(results.length){
      results.forEach(function(b){ list.appendChild(bookListRowEl(b)); });
    }else{
      empty.hidden = false;
    }
    return frag;
  }
  function bookListRowEl(b){
    var frag = tpl("tpl-book-list-row");
    applyCover(frag.querySelector("[data-slot='cover']"), b);
    frag.querySelector("[data-slot='title']").textContent = b.title;
    frag.querySelector("[data-slot='author']").textContent = b.author;
    frag.querySelector("[data-slot='category']").textContent = b.categories.join(" · ");
    fillBadge(frag.querySelector("[data-slot='badge']"), b.status);
    frag.querySelector("[data-book]").setAttribute("data-book", b.id);
    return frag.querySelector(".list-row");
  }
  function bindBusca(){
    document.getElementById("busca-form").addEventListener("submit", function(e){
      e.preventDefault();
      state.searchQuery = document.getElementById("busca-input").value.trim();
      render();
    });
    document.querySelectorAll("[data-cat]").forEach(function(el){
      el.addEventListener("click", function(){
        var c = el.getAttribute("data-cat");
        if(c==="Todas"){
          state.activeCategories = [];
        }else{
          var i = state.activeCategories.indexOf(c);
          if(i>-1) state.activeCategories.splice(i,1);
          else state.activeCategories.push(c);
        }
        render();
      });
    });
    bindBookCards();
  }

  /* ---------------- DETALHE ---------------- */
  var SPEC_FIELDS = [
    ["Editora","publisher"], ["Edição","edition"], ["Ano","year"], ["ISBN","isbn"],
    ["Páginas","pages"], ["Dimensões","dimensions"], ["Peso","weight"], ["Idioma","language"]
  ];
  function renderDetalhe(){
    var b = findBook(state.currentBookId);
    if(!b) return mensagemTela("Livro não encontrado.");
    var frag = tpl("tpl-detalhe");

    applyCover(frag.querySelector("[data-slot='cover']"), b);
    frag.querySelector("[data-slot='category']").textContent = b.categories.join(" · ");
    frag.querySelector("[data-slot='title']").textContent = b.title;
    frag.querySelector("[data-slot='author']").textContent = b.author;
    frag.querySelector("[data-slot='synopsis']").textContent = b.synopsis;
    fillBadge(frag.querySelector("[data-slot='badge']"), b.status);

    var specsBox = frag.querySelector("[data-list='specs']");
    SPEC_FIELDS.forEach(function(f){
      var row = tpl("tpl-spec-row");
      row.querySelector("[data-slot='label']").textContent = f[0];
      row.querySelector("[data-slot='value']").textContent = b[f[1]] || "—";
      specsBox.appendChild(row);
    });

    frag.querySelector("[data-slot='actions']").appendChild(detailActionFrag(b));
    return frag;
  }
  function detailActionFrag(b){
    if(b.status === "Disponível"){
      return tpl("tpl-detail-action-borrow");
    }
    var queue = data.reservations.filter(function(r){ return r.bookId===b.id; });
    var mine = queue.findIndex(function(r){ return r.patron===state.userName; });
    if(mine > -1){
      var queuedFrag = tpl("tpl-detail-action-queued");
      queuedFrag.querySelector("[data-slot='queue-label']").textContent =
        "Você está na fila (posição "+(mine+1)+"ª)";
      return queuedFrag;
    }
    return tpl("tpl-detail-action-reserve");
  }
  function bindDetalhe(){
    document.querySelector('[data-action="back"]').addEventListener("click", function(){ go("busca"); });
    var borrowBtn = document.querySelector('[data-action="borrow"]');
    if(borrowBtn) borrowBtn.addEventListener("click", function(){
      var b = findBook(state.currentBookId);
      b.status = "Emprestado";
      var due = addDays(new Date(), 15);
      var loan = { id: "l"+Date.now(), bookId: b.id, title: b.title, author: b.author, due: due.toISOString(), borrowedOn: new Date().toISOString(), returned:false };
      data.loans.unshift(loan);
      logActivity('"'+b.title+'" foi emprestado para '+state.userName+'.');
      saveData(data);
      state.lastLoanId = loan.id;
      state.lastReservationId = null;
      go("confirmacao");
    });
    var reserveBtn = document.querySelector('[data-action="reserve"]');
    if(reserveBtn) reserveBtn.addEventListener("click", function(){
      var b = findBook(state.currentBookId);
      var res = { id: "r"+Date.now(), bookId: b.id, title: b.title, author: b.author, patron: state.userName, reservedOn: new Date().toISOString() };
      data.reservations.push(res);
      logActivity(state.userName+' entrou na fila de reserva de "'+b.title+'".');
      saveData(data);
      state.lastReservationId = res.id;
      state.lastLoanId = null;
      go("confirmacao");
    });
  }

  /* ---------------- CONFIRMAÇÃO ---------------- */
  function renderConfirmacao(){
    if(state.lastReservationId){
      var res = data.reservations.filter(function(r){return r.id===state.lastReservationId;})[0];
      if(!res) return mensagemTela("Nada para confirmar.");
      var pos = data.reservations.filter(function(r){return r.bookId===res.bookId;})
                  .findIndex(function(r){return r.id===res.id;}) + 1;
      var frag = tpl("tpl-confirmacao-reserva");
      frag.querySelector("[data-slot='titulo']").textContent = res.title;
      frag.querySelector("[data-slot='reservado']").textContent = fmtDate(res.reservedOn);
      frag.querySelector("[data-slot='posicao']").textContent = pos+"ª";
      return frag;
    }
    var loan = data.loans.filter(function(l){return l.id===state.lastLoanId;})[0];
    if(!loan) return mensagemTela("Nada para confirmar.");
    var frag2 = tpl("tpl-confirmacao-emprestimo");
    frag2.querySelector("[data-slot='titulo']").textContent = loan.title;
    frag2.querySelector("[data-slot='retirado']").textContent = fmtDate(loan.borrowedOn);
    frag2.querySelector("[data-slot='devolucao']").textContent = fmtDate(loan.due);
    return frag2;
  }
  function bindConfirmacao(){ /* nav/logout/reset já ligados uma única vez por render() */ }

  /* ---------------- MINHA CONTA ---------------- */
  function renderConta(){
    var frag = tpl("tpl-conta");
    var active = data.loans.filter(function(l){return !l.returned;})
      .sort(function(a,b){ return new Date(a.due) - new Date(b.due); });
    var myReservations = data.reservations.filter(function(r){return r.patron===state.userName;});

    frag.querySelector("[data-slot='nome']").textContent = state.userName || "";
    frag.querySelector("[data-slot='titulo-emprestimos']").textContent = "Empréstimos ativos ("+active.length+")";
    frag.querySelector("[data-slot='titulo-reservas']").textContent = "Reservas ativas ("+myReservations.length+")";

    var loansBox = frag.querySelector("[data-list='emprestimos']");
    if(active.length){
      active.forEach(function(l){ loansBox.appendChild(loanCardEl(l)); });
    }else{
      frag.querySelector("[data-slot='empty-emprestimos']").hidden = false;
    }

    var resBox = frag.querySelector("[data-list='reservas']");
    if(myReservations.length){
      myReservations.forEach(function(r){ resBox.appendChild(reservationCardEl(r)); });
    }else{
      frag.querySelector("[data-slot='empty-reservas']").hidden = false;
    }
    return frag;
  }
  function reservationCardEl(r){
    var pos = data.reservations.filter(function(x){return x.bookId===r.bookId;})
                .findIndex(function(x){return x.id===r.id;}) + 1;
    var b = findBook(r.bookId);
    var frag = tpl("tpl-reservation-card");
    applyCover(frag.querySelector("[data-slot='cover']"), b, r.title);
    frag.querySelector("[data-slot='title']").textContent = r.title;
    frag.querySelector("[data-slot='author']").textContent = r.author;
    frag.querySelector("[data-slot='info']").textContent = "Posição "+pos+"ª na fila · reservado em "+fmtDate(r.reservedOn);
    frag.querySelector("[data-cancel-reserve]").setAttribute("data-cancel-reserve", r.id);
    return frag.querySelector(".loan-card");
  }
  function loanCardEl(l){
    var overdue = isOverdue(l.due);
    var b = findBook(l.bookId);
    var frag = tpl("tpl-loan-card");
    applyCover(frag.querySelector("[data-slot='cover']"), b, l.title);
    frag.querySelector("[data-slot='title']").textContent = l.title;
    frag.querySelector("[data-slot='author']").textContent = l.author;
    var dueEl = frag.querySelector("[data-slot='due']");
    dueEl.textContent = (overdue?"Atrasado — devolução era ":"Devolução até ") + fmtDate(l.due);
    dueEl.classList.toggle("overdue", overdue);
    frag.querySelector("[data-renew]").setAttribute("data-renew", l.id);
    return frag.querySelector(".loan-card");
  }
  function bindConta(){
    document.querySelectorAll("[data-renew]").forEach(function(el){
      el.addEventListener("click", function(){
        var loan = data.loans.filter(function(l){return l.id===el.getAttribute("data-renew");})[0];
        if(loan){
          loan.due = addDays(loan.due, 7).toISOString();
          logActivity('"'+loan.title+'" foi renovado por mais 7 dias.');
          saveData(data);
          toast("Empréstimo renovado por mais 7 dias.");
          render();
        }
      });
    });
    document.querySelectorAll("[data-cancel-reserve]").forEach(function(el){
      el.addEventListener("click", function(){
        var id = el.getAttribute("data-cancel-reserve");
        var r = data.reservations.filter(function(x){return x.id===id;})[0];
        if(r && confirm('Cancelar sua reserva de "'+r.title+'"?')){
          data.reservations = data.reservations.filter(function(x){return x.id!==id;});
          logActivity('Reserva de "'+r.title+'" cancelada por '+state.userName+'.');
          saveData(data);
          toast("Reserva cancelada.");
          render();
        }
      });
    });
  }

  /* ---------------- PAINEL DO BIBLIOTECÁRIO ---------------- */
  function renderPainel(){
    var frag = tpl("tpl-painel");
    var totalBooks = data.books.length;
    var activeLoans = data.loans.filter(function(l){return !l.returned;}).length;
    var overdue = data.loans.filter(function(l){return !l.returned && isOverdue(l.due);}).length;

    frag.querySelector("[data-slot='first-name']").textContent = (state.userName||"").split(" ")[0];

    var stats = frag.querySelector("[data-list='stats']");
    [[totalBooks,"Livros cadastrados"],[activeLoans,"Empréstimos ativos"],
     [overdue,"Devoluções atrasadas"],[data.reservations.length,"Reservas pendentes"]].forEach(function(s){
      stats.appendChild(statCardEl(s[0], s[1]));
    });

    var activityBox = frag.querySelector("[data-list='atividades']");
    if(data.activity.length){
      data.activity.forEach(function(a){ activityBox.appendChild(activityItemEl(a)); });
    }else{
      frag.querySelector("[data-slot='empty']").hidden = false;
    }
    return frag;
  }
  function statCardEl(num, label){
    var frag = tpl("tpl-stat-card");
    frag.querySelector("[data-slot='num']").textContent = num;
    frag.querySelector("[data-slot='label']").textContent = label;
    return frag.querySelector(".stat-card");
  }
  function activityItemEl(a){
    var frag = tpl("tpl-activity-item");
    frag.querySelector("[data-slot='text']").textContent = a.text;
    frag.querySelector("[data-slot='time']").textContent = a.time;
    return frag.querySelector(".activity-item");
  }
  function bindPainel(){ /* nav/logout/reset já ligados uma única vez por render() */ }

  /* ---------------- ACERVO (gerenciar) ---------------- */
  function renderAcervo(){
    var frag = tpl("tpl-acervo");
    var q = state.searchQuery.toLowerCase();
    var list = data.books.filter(function(b){
      return !q || b.title.toLowerCase().indexOf(q)>-1 || b.author.toLowerCase().indexOf(q)>-1;
    });

    frag.querySelector("#acervo-search").value = state.searchQuery;

    var tbody = frag.querySelector("[data-list='linhas']");
    if(list.length){
      list.forEach(function(b){ tbody.appendChild(acervoRowEl(b)); });
    }else{
      var emptyRow = tpl("tpl-empty-row");
      fillEmptyRow(emptyRow, 6, "Nenhum livro encontrado.");
      tbody.appendChild(emptyRow);
    }

    if(state.modalOpen){
      frag.querySelector("[data-slot='modal-container']").appendChild(bookModalEl());
    }
    return frag;
  }
  function acervoRowEl(b){
    var frag = tpl("tpl-acervo-row");
    applyCover(frag.querySelector("[data-slot='cover']"), b);
    frag.querySelector("[data-slot='title']").textContent = b.title;
    frag.querySelector("[data-slot='author']").textContent = b.author;
    frag.querySelector("[data-slot='category']").textContent = b.categories.join(", ");
    fillBadge(frag.querySelector("[data-slot='badge']"), b.status);
    frag.querySelector("[data-edit]").setAttribute("data-edit", b.id);
    frag.querySelector("[data-del]").setAttribute("data-del", b.id);
    return frag.querySelector("tr");
  }
  function bookModalEl(){
    var editing = state.editingBookId && state.editingBookId!=="new" ? findBook(state.editingBookId) : null;
    var v = editing || { title:"", author:"", categories:[], status:"Disponível", synopsis:"",
      publisher:"", edition:"", year:"", isbn:"", language:"Português", pages:"", dimensions:"", weight:"" };
    var frag = tpl("tpl-book-modal");

    frag.querySelector("[data-slot='titulo']").textContent = editing ? "Editar livro" : "Novo livro";

    var catGroup = frag.querySelector("#m-cat-group");
    CATEGORIES.forEach(function(c){
      var label = tpl("tpl-cat-check").querySelector(".cat-check");
      var input = label.querySelector("input");
      input.value = c;
      if(v.categories.indexOf(c)>-1) input.checked = true;
      label.querySelector("span").textContent = c;
      catGroup.appendChild(label);
    });

    frag.querySelector("#m-title").value = v.title;
    frag.querySelector("#m-author").value = v.author;
    frag.querySelector("#m-status").value = v.status;
    frag.querySelector("#m-syn").value = v.synopsis;
    frag.querySelector("#m-pub").value = v.publisher;
    frag.querySelector("#m-year").value = v.year;
    frag.querySelector("#m-edition").value = v.edition;
    frag.querySelector("#m-lang").value = v.language;
    frag.querySelector("#m-isbn").value = v.isbn;
    frag.querySelector("#m-pages").value = v.pages;
    frag.querySelector("#m-dims").value = v.dimensions;
    frag.querySelector("#m-weight").value = v.weight;

    return frag.querySelector(".modal-backdrop");
  }
  function openModalDom(){
    var backdrop = document.getElementById("modal-backdrop");
    if(!backdrop) return;
    backdrop.addEventListener("click", function(e){ if(e.target===backdrop) closeModal(); });
    document.querySelector('[data-action="close-modal"]').addEventListener("click", closeModal);
    document.getElementById("book-form").addEventListener("submit", function(e){
      e.preventDefault();
      var checkedCats = Array.prototype.slice.call(
        document.querySelectorAll("#m-cat-group input:checked")
      ).map(function(i){ return i.value; });
      if(!checkedCats.length){ toast("Selecione ao menos um gênero."); return; }
      var vals = {
        title: document.getElementById("m-title").value.trim(),
        author: document.getElementById("m-author").value.trim(),
        categories: checkedCats,
        status: document.getElementById("m-status").value,
        synopsis: document.getElementById("m-syn").value.trim(),
        publisher: document.getElementById("m-pub").value.trim(),
        year: document.getElementById("m-year").value.trim(),
        edition: document.getElementById("m-edition").value.trim(),
        language: document.getElementById("m-lang").value.trim(),
        isbn: document.getElementById("m-isbn").value.trim(),
        pages: document.getElementById("m-pages").value.trim(),
        dimensions: document.getElementById("m-dims").value.trim(),
        weight: document.getElementById("m-weight").value.trim()
      };
      if(state.editingBookId==="new"){
        var nb = Object.assign({id:"b"+Date.now()}, vals);
        data.books.unshift(nb);
        logActivity('"'+nb.title+'" foi adicionado ao acervo.');
        toast("Livro cadastrado.");
      }else{
        var b = findBook(state.editingBookId);
        Object.assign(b, vals);
        logActivity('"'+b.title+'" foi atualizado.');
        toast("Livro atualizado.");
      }
      saveData(data);
      closeModal();
    });
  }
  function closeModal(){ state.modalOpen=false; state.editingBookId=null; render(); }
  function bindAcervo(){
    document.getElementById("acervo-search").addEventListener("input", function(e){
      state.searchQuery = e.target.value;
      render();
    });
    document.querySelector('[data-action="new-book"]').addEventListener("click", function(){
      state.editingBookId = "new"; state.modalOpen = true; render();
    });
    document.querySelectorAll("[data-edit]").forEach(function(el){
      el.addEventListener("click", function(){
        state.editingBookId = el.getAttribute("data-edit"); state.modalOpen = true; render();
      });
    });
    document.querySelectorAll("[data-del]").forEach(function(el){
      el.addEventListener("click", function(){
        var id = el.getAttribute("data-del");
        var b = findBook(id);
        if(!b) return;
        if(confirm('Excluir "'+b.title+'" do acervo?')){
          data.books = data.books.filter(function(x){return x.id!==id;});
          logActivity('"'+b.title+'" foi removido do acervo.');
          saveData(data);
          toast("Livro removido.");
          render();
        }
      });
    });
  }

  /* ---------------- EMPRÉSTIMOS (bibliotecário) ---------------- */
  function renderEmprestimosBib(){
    var frag = tpl("tpl-emprestimos-bib");
    var active = data.loans.filter(function(l){return !l.returned;})
      .sort(function(a,b){ return new Date(a.due) - new Date(b.due); });

    frag.querySelector("[data-slot='titulo-ativos']").textContent = "Empréstimos ativos ("+active.length+")";
    frag.querySelector("[data-slot='titulo-fila']").textContent = "Fila de reservas ("+data.reservations.length+")";

    var ativosBody = frag.querySelector("[data-list='ativos']");
    if(active.length){
      active.forEach(function(l){ ativosBody.appendChild(emprestimoRowEl(l)); });
    }else{
      var emptyLoans = tpl("tpl-empty-row");
      fillEmptyRow(emptyLoans, 4, "Nenhum empréstimo ativo.");
      ativosBody.appendChild(emptyLoans);
    }

    var filaBody = frag.querySelector("[data-list='fila']");
    if(data.reservations.length){
      data.reservations.forEach(function(r, i, arr){ filaBody.appendChild(reservaFilaRowEl(r, arr)); });
    }else{
      var emptyRes = tpl("tpl-empty-row");
      fillEmptyRow(emptyRes, 4, "Nenhuma reserva pendente.");
      filaBody.appendChild(emptyRes);
    }
    return frag;
  }
  function emprestimoRowEl(l){
    var overdue = isOverdue(l.due);
    var frag = tpl("tpl-emprestimo-row");
    frag.querySelector("[data-slot='title']").textContent = l.title;
    frag.querySelector("[data-slot='borrowed']").textContent = fmtDate(l.borrowedOn);
    var dueCell = frag.querySelector("[data-slot='due']");
    if(overdue){
      var strong = document.createElement("strong");
      strong.className = "text-overdue";
      strong.textContent = fmtDate(l.due)+" (atrasado)";
      dueCell.appendChild(strong);
    }else{
      dueCell.textContent = fmtDate(l.due);
    }
    frag.querySelector("[data-return]").setAttribute("data-return", l.id);
    return frag.querySelector("tr");
  }
  function reservaFilaRowEl(r, arr){
    var pos = arr.filter(function(x){return x.bookId===r.bookId;}).findIndex(function(x){return x.id===r.id;}) + 1;
    var frag = tpl("tpl-reserva-fila-row");
    frag.querySelector("[data-slot='title']").textContent = r.title;
    frag.querySelector("[data-slot='patron']").textContent = r.patron;
    frag.querySelector("[data-slot='reserved']").textContent = fmtDate(r.reservedOn);
    frag.querySelector("[data-slot='pos']").textContent = pos+"ª";
    return frag.querySelector("tr");
  }
  function bindEmprestimosBib(){
    document.querySelectorAll("[data-return]").forEach(function(el){
      el.addEventListener("click", function(){
        var loan = data.loans.filter(function(l){return l.id===el.getAttribute("data-return");})[0];
        if(loan){
          loan.returned = true;
          var b = findBook(loan.bookId);
          if(b) b.status = "Disponível";
          logActivity('Devolução de "'+loan.title+'" confirmada.');
          var queued = data.reservations.filter(function(r){return r.bookId===loan.bookId;});
          var msg = "Devolução confirmada.";
          if(queued.length){
            var next = queued[0];
            data.reservations = data.reservations.filter(function(r){return r.id!==next.id;});
            logActivity(next.patron+' foi avisado(a) que "'+loan.title+'" está disponível (reserva).');
            msg = 'Devolução confirmada. '+next.patron+' foi avisado(a) da reserva.';
          }
          saveData(data);
          toast(msg);
          render();
        }
      });
    });
  }

  /* ---------------- Inicialização ---------------- */
  initTheme();
  bindThemeToggle();
  render();
})();
