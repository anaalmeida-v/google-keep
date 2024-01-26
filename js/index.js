(async () => {    
    const getDados = async () => {
        return  await (await fetch('./dados.json')).json();
    }

    let dados = await getDados();

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

    const limparContainerNotas = () => {
        document.querySelector('.notas-container .grid-container').innerHTML = "";
    }

    const renderizarNota = (id, titulo, conteudo, cor, marcadores) => {
        const conteudoResumido = conteudo.substr(0, 600) + '...';
        const notaHtml = `<div class="grid-item js-nota ${cor}">
                            <div class="notas">
                                <input type="hidden" class="id-nota" value="${id}">
                                <h2 class="titulo-notas">${titulo}</h2>
                                <p class="conteudo-notas">${conteudoResumido}</p>
                                <p>${marcadores.join(', ')}</p>
                            </div>
                        </div>`;
        document.querySelector('.notas-container .grid-container').innerHTML += notaHtml; 
    }

    const excluirArquivar = (key) => {
        const idElement = document.getElementById('id-nota-aberta');
        if(!idElement) return;

        const id = idElement.value * 1;
        dados = dados.map(dado => {
            if(dado.id === id){
                dado[key] = true;
            }
            return dado;
        });
        fecharNota();
        renderizarNotas(dados);
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

    const renderizarNotas = (dados, mostrarArquivado = false, mostrarExcluido = false) => {
        limparContainerNotas();
        for(let index = 0; index < dados.length; index++){
            const { id, titulo, conteudo, cor, marcadores, arquivado, excluido } = dados[index];
            if(arquivado === mostrarArquivado || x == 2 && excluido === mostrarExcluido) {
                renderizarNota(id, titulo, conteudo, cor, marcadores);
            }
        }
        setTimeout(() => {            
            resizeAllGridItems();
        }, 100);
    }

    const filtrarNotasPorMarcador = (dados, marcador) => {
        const dadosFiltrados = dados.filter(dado => {
            return dado.marcadores.indexOf(marcador) !== -1;
        });
        renderizarNotas(dadosFiltrados);
    }

    const filtrarNotasPor = (dados, key, mostrarArquivado, mostrarExcluido) => {
        const dadosFiltrados = dados.filter(dado => dado[key] === true);
        renderizarNotas(dadosFiltrados, mostrarArquivado, mostrarExcluido);
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

    document.body.addEventListener('click', (event) => {
        if(event.target.classList.contains('nota-aberta')) {
            fecharNota();
        }
        if(event.target.closest('.js-mostrar-tudo')) {
            renderizarNotas(dados);
        }
        if(event.target.closest('.js-excluir')) {
            excluirArquivar('excluido')
        }
        if(event.target.closest('.js-arquivar')) {
            excluirArquivar('arquivado')
        }
        if(event.target.closest('.js-fechar')) {
            fecharNota();
        }
        if(event.target.closest('.js-nota')){
            const id = event.target.closest('.js-nota').querySelector('.id-nota').value * 1;
            abrirNota(id);
        }
        if(event.target.closest('.js-menu-lixeira')) {
            filtrarNotasPor(dados, 'excluido', false, true);
        }
        if(event.target.closest('.js-menu-arquivo')) {
            filtrarNotasPor(dados, 'arquivado', true, false);
        }
        if(event.target.closest('.js-marcador')) {
            let nomeMarcador = '';
            if(event.target.closest('.js-marcador')){
                nomeMarcador = event.target.closest('.js-marcador').querySelector('a').textContent;
            } else {
                nomeMarcador = event.target.querySelector('a').textContent;
            }
            filtrarNotasPorMarcador(dados, nomeMarcador);
        }
    });

    const marcadoresResumidos = extrairMarcadoresUnicos(dados);    
    marcadoresResumidos.forEach(marcador => renderizarMarcadoresMenu(marcador));
    renderizarNotas(dados);
    window.addEventListener("resize", resizeAllGridItems);
    resizeAllGridItems();
})();