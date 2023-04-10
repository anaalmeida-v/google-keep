(async () => {
    let dados = await (await fetch('./dados.json')).json();
    const extrairMarcadoresUnicos = (dados) => {
        const marcadoresUnicos = [];
        for(let index = 0; index < dados.length; index++){
            const { marcadores } = dados[index];
            if(Array.isArray(marcadores)){
                for(let indexMarcador = 0; indexMarcador < marcadores.length; indexMarcador++){
                    if(marcadoresUnicos.indexOf(marcadores[indexMarcador]) === -1) {
                        marcadoresUnicos.push(marcadores[indexMarcador]);
                    }
                }
            }
        }
        return marcadoresUnicos;
    }

    const renderizarNotas = (id, titulo, conteudo, cor, marcadores) => {
        const conteudoResumido = conteudo.substr(0, 200) + '...';
        const notaHtml = `<div class="col-12">
                            <div class="notas js-nota ${cor}">
                                <input type="hidden" class="id-nota" value="${id}">
                                <h2 class="titulo-notas">${titulo}</h2>
                                <p class="conteudo-notas">${conteudoResumido}</p>
                                <p>${marcadores.join(', ')}</p>
                            </div>
                        </div>`;
        document.querySelector('.notas-container .row').innerHTML += notaHtml; 
    }

    const renderizarMarcadoresMenu = (marcador) => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        const a = document.createElement('a');

        li.classList.add('nav-item');
        li.classList.add('js-marcador');
        a.href = "#";
        a.classList.add("nav-link");
        a.textContent = marcador;
        span.classList.add("icon-bookmark-empty");
        li.appendChild(span);
        li.appendChild(a);

        document.querySelector('#nav-principal').insertBefore(li, document.querySelector('#nav-principal .arquivo'));
    }

    const formatarNotas = (dados) => {
        document.querySelector('.notas-container .row').innerHTML = "";
        for(let index = 0; index < dados.length; index++){
            const { id, titulo, conteudo, cor, marcadores, arquivado, excluido } = dados[index];
            if(arquivado === false && excluido === false) {
                renderizarNotas(id, titulo, conteudo, cor, marcadores);
            }
        }
        atribuirEventos();
    }

    const filtrarNotasPorMarcador = (dados, marcador) => {
        const dadosFiltrados = dados.filter(dado => {
            return dado.marcadores.indexOf(marcador) !== -1;
        });
        document.querySelector('.notas-container .row').innerHTML = "";
        for(let index = 0; index < dadosFiltrados.length; index++){
            const { id, titulo, conteudo, cor, marcadores } = dadosFiltrados[index];
            renderizarNotas(id, titulo, conteudo, cor, marcadores);
        }
        atribuirEventos();
    }

    const filtrarNotasPorArquivado = (dados) => {
        const dadosFiltrados = dados.filter(dado => dado.arquivado === true);
        document.querySelector('.notas-container .row').innerHTML = "";
        for(let index = 0; index < dadosFiltrados.length; index++){
            const { id, titulo, conteudo, cor, marcadores } = dadosFiltrados[index];
            renderizarNotas(id, titulo, conteudo, cor, marcadores);
        }
        atribuirEventos();
    }

    const filtrarNotasPorExcluido = (dados) => {
        const dadosFiltrados = dados.filter(dado => dado.excluido === true);
        document.querySelector('.notas-container .row').innerHTML = "";
        for(let index = 0; index < dadosFiltrados.length; index++){
            const { id, titulo, conteudo, cor, marcadores } = dadosFiltrados[index];
            renderizarNotas(id, titulo, conteudo, cor, marcadores);
        }
        atribuirEventos();
    }

    const abrirNota = (id) => {
        const notaAberta = dados.filter(function(dado) {
            return dado.id === id;
        }).pop();
        document.querySelector('.nota-aberta .titulo-notas').textContent = notaAberta.titulo;
        document.querySelector('.nota-aberta .conteudo-notas').textContent = notaAberta.conteudo;
        document.querySelector('.nota-aberta .notas').classList.add(notaAberta.cor);
        document.querySelector('.nota-aberta #id-nota-aberta').value = notaAberta.id;
        if(notaAberta.marcadores.length > 0){
            notaAberta.marcadores.forEach(function(marcador) {
                const span = document.createElement('span');
                span.textContent = marcador;
                document.querySelector('.nota-aberta .nota-marcadores').appendChild(span);
            });
        }
        document.querySelector('.nota-aberta').classList.add('ativo');
    }

    const fecharNota = () => {
        document.querySelector('.nota-aberta').classList.remove('ativo');
        document.querySelector('.nota-aberta .notas').classList.remove('nota-azul');
        document.querySelector('.nota-aberta .notas').classList.remove('nota-laranja');
        document.querySelector('.nota-aberta .nota-marcadores').innerHTML = '';
    }
    const atribuirEventos = () => {

        document.querySelectorAll('.js-marcador').forEach(function(marcador){
            marcador.addEventListener('click', function(event){
                let nomeMarcador = '';
                if(event.target.tagName === 'LI'){
                    nomeMarcador = event.target.querySelector('a').textContent;
                } else {
                    nomeMarcador = event.target.parentElement.querySelector('a').textContent;
                }
                filtrarNotasPorMarcador(dados, nomeMarcador);
            }, false);
        });

        document.querySelectorAll('.js-menu-arquivo').forEach(function(marcador){
            marcador.addEventListener('click', function(event){
                let nomeMarcador = '';
                if(event.target.tagName === 'LI'){
                    nomeMarcador = event.target.querySelector('a').textContent;
                } else {
                    nomeMarcador = event.target.parentElement.querySelector('a').textContent;
                }
                filtrarNotasPorArquivado(dados);
            }, false);
        });

        document.querySelectorAll('.js-menu-lixeira').forEach(function(marcador){
            marcador.addEventListener('click', function(event){
                let nomeMarcador = '';
                if(event.target.tagName === 'LI'){
                    nomeMarcador = event.target.querySelector('a').textContent;
                } else {
                    nomeMarcador = event.target.parentElement.querySelector('a').textContent;
                }
                filtrarNotasPorExcluido(dados, nomeMarcador);
            }, false);
        });
    
        document.querySelectorAll('.js-nota').forEach(nota => {
            nota.addEventListener('click', event => {
                let elementoPai = event.target;
                if(event.target.tagName !== 'DIV' || event.target.classList.contains('notas')){
                    elementoPai = event.target.parentElement;
                }
                const id = elementoPai.querySelector('.id-nota').value * 1;
                abrirNota(id);
            });
        });
        
        document.querySelector('.js-fechar').addEventListener('click', () => {
            fecharNota();
        });
    
        document.querySelector('.js-arquivar').addEventListener('click', () => {
            const idElement = document.getElementById('id-nota-aberta');
            if(!idElement) return;
    
            const id = idElement.value * 1;
    
            dados = dados.map(dado => {
                if(dado.id === id){
                    dado.arquivado = true;
                }
                return dado;
            });
            fecharNota();
            formatarNotas(dados);
        });
    
        document.querySelector('.js-excluir').addEventListener('click', () => {
            const idElement = document.getElementById('id-nota-aberta');
            if(!idElement) return;
    
            const id = idElement.value * 1;
    
            dados = dados.map(dado => {
                if(dado.id === id){
                    dado.excluido = true;
                }
                return dado;
            });
            fecharNota();
            formatarNotas(dados);
        });
    
        document.querySelector('.nota-aberta').addEventListener('click', event => {
            if(event.target.classList.contains('nota-aberta')) {
                fecharNota();
            }
        });

        document.querySelector('.js-mostrar-tudo').addEventListener('click', () => {
            formatarNotas(dados);
        });
    }

    const marcadoresResumidos = extrairMarcadoresUnicos(dados);    
    marcadoresResumidos.forEach(marcador => renderizarMarcadoresMenu(marcador));
    formatarNotas(dados);
})();