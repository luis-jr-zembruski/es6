import api from './api';

class App{
  constructor(){
    //Guarda todos os repositórios
    this.repositories = [];

    //Busca no html os elementos para manipulação
    this.formEl = document.getElementById('repo-form');
    this.inputEl = document.querySelector('input[name=repository]');
    this.listEl = document.getElementById('repo-list');

    this.registerHandlers();
  }

  registerHandlers() {
    //Escuta os eventos que acontecem no site
    this.formEl.onsubmit = event => this.addRepository(event);
  }

  //Função para mostrar mensagem enquanto estiver carregando 
  //o resultado da requisição a Api
  setLoading(loading = true) {
    if(loading === true){
      let loadingEl = document.createElement('span');
      loadingEl.appendChild(document.createTextNode('Carregando solicitação...'));
      loadingEl.setAttribute('id', 'loading');

      this.formEl.appendChild(loadingEl);
    }else {
      document.getElementById('loading').remove();
    }
  }

  async addRepository(event) {
    //Evita que o site seja recarregado quando for clicado
    event.preventDefault();

    //Verifica se foi passado algo pelo input
    const repoInput = this.inputEl.value;
    if (repoInput.length === 0)
      return;

    this.setLoading();

    try {
      //Faz a requisição a api
      const response = await api.get(`/repos/${repoInput}`);

      const { name, description, html_url, owner: { avatar_url }} = response.data;

      this.repositories.push({
        name,
        description,
        avatar_url,
        html_url
      });

      this.inputEl.value = '';

      this.render();
    } catch {
      alert ('Repositório não encontrado!');
      this.inputEl.value = '';
    }

    this.setLoading(false);
  }

  render(){
    //Limpa a lista de repositórios toda vez que for renderizar
    this.listEl.innerHTML = '';

    this.repositories.forEach(repo => {
      //Cria a imagem do usuário
      let imgEl = document.createElement('img');
      imgEl.setAttribute('src', repo.avatar_url);

      //Cria o título do repositório
      let titleEl = document.createElement('strong');
      titleEl.appendChild(document.createTextNode(repo.name));

      //Cria a descrição do repositório
      let descriptionEl = document.createElement('p');
      descriptionEl.appendChild(document.createTextNode(repo.description));

      //cria o link do repositório
      let linkEl = document.createElement('a');
      linkEl.setAttribute('target', '_blank');
      linkEl.setAttribute('href', repo.html_url);
      linkEl.appendChild(document.createTextNode('Acessar'));

      //Criar a listagem do repositório
      let listItemEl = document.createElement('li');
      listItemEl.appendChild(imgEl);
      listItemEl.appendChild(titleEl);
      listItemEl.appendChild(descriptionEl);
      listItemEl.appendChild(linkEl);

      //Cria o repositório na lista
      this.listEl.appendChild(listItemEl);
    });
  }

}

new App();