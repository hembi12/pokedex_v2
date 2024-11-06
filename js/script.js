// script.js

class Pokemon {
    constructor(data) {
        this.abilities = data.abilities;
        this.detailPageURL = data.detailPageURL;
        this.weight = data.weight;
        this.weakness = data.weakness;
        this.number = data.number;
        this.height = data.height;
        this.collectibles_slug = data.collectibles_slug;
        this.featured = data.featured;
        this.slug = data.slug;
        this.name = data.name;
        this.ThumbnailAltText = data.ThumbnailAltText;
        this.ThumbnailImage = data.ThumbnailImage;
        this.id = data.id;
        this.type = data.type;
    }

    // Método para crear la tarjeta del Pokémon
    createCard() {
        const card = document.createElement('div');
        card.className = 'bg-white rounded shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition';

        const img = document.createElement('img');
        img.src = this.ThumbnailImage;
        img.alt = this.ThumbnailAltText;
        img.className = 'w-24 h-24 mb-2';

        const name = document.createElement('h2');
        name.textContent = this.name;
        name.className = 'text-xl font-semibold mb-1';

        const types = document.createElement('div');
        types.className = 'flex space-x-2';
        this.type.forEach(t => {
            const typeBadge = document.createElement('span');
            typeBadge.textContent = t.charAt(0).toUpperCase() + t.slice(1);
            typeBadge.className = `px-2 py-1 bg-${Pokemon.getTypeColor(t)}-200 text-${Pokemon.getTypeColor(t)}-800 rounded-full text-sm`;
            types.appendChild(typeBadge);
        });

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(types);

        // Evento para abrir el modal con más información
        card.addEventListener('click', () => {
            Pokemon.showModal(this);
        });

        return card;
    }

    // Método estático para obtener colores basados en el tipo
    static getTypeColor(type) {
        const typeColors = {
            grass: 'green',
            poison: 'purple',
            fire: 'red',
            water: 'blue',
            electric: 'yellow',
            psychic: 'pink',
            ice: 'teal',
            dragon: 'indigo',
            dark: 'gray',
            fairy: 'pink',
            fighting: 'orange',
            flying: 'sky',
            ground: 'yellow',
            bug: 'lime',
            rock: 'amber',
            ghost: 'violet',
            steel: 'slate'
            // Agrega más tipos según sea necesario
        };
        return typeColors[type.toLowerCase()] || 'gray';
    }

    // Método estático para capitalizar la primera letra
    static capitalize(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    // Método estático para mostrar el modal
    static showModal(pokemon) {
        const modal = document.getElementById('modal');
        const modalContent = document.getElementById('modal-content');

        // Limpiar contenido previo
        modalContent.innerHTML = '';

        // Imagen
        const img = document.createElement('img');
        img.src = pokemon.ThumbnailImage;
        img.alt = pokemon.ThumbnailAltText;
        img.className = 'w-32 h-32 mx-auto mb-4';

        // Nombre
        const name = document.createElement('h2');
        name.textContent = pokemon.name;
        name.className = 'text-2xl font-bold text-center mb-2';

        // Número
        const number = document.createElement('p');
        number.textContent = `Número: ${pokemon.number}`;
        number.className = 'text-center mb-2';

        // Tipo
        const types = document.createElement('div');
        types.className = 'flex justify-center space-x-2 mb-2';
        pokemon.type.forEach(t => {
            const typeBadge = document.createElement('span');
            typeBadge.textContent = t.charAt(0).toUpperCase() + t.slice(1);
            typeBadge.className = `px-3 py-1 bg-${Pokemon.getTypeColor(t)}-200 text-${Pokemon.getTypeColor(t)}-800 rounded-full text-sm`;
            types.appendChild(typeBadge);
        });

        // Peso y Altura
        const stats = document.createElement('p');
        stats.textContent = `Peso: ${pokemon.weight} kg | Altura: ${pokemon.height} cm`;
        stats.className = 'text-center mb-2';

        // Habilidades
        const abilities = document.createElement('div');
        abilities.className = 'mb-2';
        const abilitiesTitle = document.createElement('h3');
        abilitiesTitle.textContent = 'Habilidades:';
        abilitiesTitle.className = 'font-semibold mb-1';
        const abilitiesList = document.createElement('ul');
        pokemon.abilities.forEach(ab => {
            const li = document.createElement('li');
            li.textContent = ab;
            abilitiesList.appendChild(li);
        });
        abilities.appendChild(abilitiesTitle);
        abilities.appendChild(abilitiesList);

        // Debilidades
        const weaknesses = document.createElement('div');
        weaknesses.className = 'mb-2';
        const weaknessesTitle = document.createElement('h3');
        weaknessesTitle.textContent = 'Debilidades:';
        weaknessesTitle.className = 'font-semibold mb-1';
        const weaknessesList = document.createElement('ul');
        pokemon.weakness.forEach(wk => {
            const li = document.createElement('li');
            li.textContent = wk;
            weaknessesList.appendChild(li);
        });
        weaknesses.appendChild(weaknessesTitle);
        weaknesses.appendChild(weaknessesList);

        // Agregar elementos al contenido del modal
        modalContent.appendChild(img);
        modalContent.appendChild(name);
        modalContent.appendChild(number);
        modalContent.appendChild(types);
        modalContent.appendChild(stats);
        modalContent.appendChild(abilities);
        modalContent.appendChild(weaknesses);

        // Mostrar el modal
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    // Método estático para cerrar el modal
    static closeModal() {
        const modal = document.getElementById('modal');
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }
}

class Pokedex {
    constructor() {
        this.pokemons = [];
        this.filteredPokemons = [];
        this.container = document.getElementById('pokemon-container');
        this.searchInput = document.getElementById('search');
        this.numberInput = document.getElementById('number');
        this.typeSelect = document.getElementById('type');
        this.abilitiesSelect = document.getElementById('abilities');
        this.weaknessesSelect = document.getElementById('weaknesses');

        // Propiedades para paginación
        this.currentPage = 1;
        this.itemsPerPage = 20; // Puedes ajustar el número de Pokémon por página
        this.paginationContainer = document.getElementById('pagination'); // Asegúrate de tener un elemento con id 'pagination' en tu HTML

        this.loadPokemons();
        this.setupSearch();
        this.setupFilterEvents();
        this.setupModalClose();

        // Escuchar eventos de redimensionamiento para ajustar la paginación responsiva
        window.addEventListener('resize', () => {
            this.renderPagination();
        });
    }

    // Método para obtener Pokémon únicos basado en una clave específica
    getUniquePokemons(data, key) {
        const seen = new Set();
        return data.filter(item => {
            const identifier = item[key];
            if (seen.has(identifier)) {
                return false;
            }
            seen.add(identifier);
            return true;
        });
    }

    // Cargar los Pokémon desde el JSON
    async loadPokemons() {
        try {
            const response = await fetch('data/pokemons.json');
            const data = await response.json();

            // 1. Filtrar Pokémon con weight igual a 9999
            const filteredByWeight = data.filter(pokemon => Number(pokemon.weight) !== 9999);

            // 2. Filtrar Pokémon únicos basado en 'number'
            const uniqueByNumber = this.getUniquePokemons(filteredByWeight, 'number');

            // 3. Asignar los Pokémon filtrados
            this.pokemons = uniqueByNumber.map(pokemonData => new Pokemon(pokemonData));
            this.filteredPokemons = this.pokemons;

            // Extraer y llenar los filtros de tipo, habilidades y debilidades
            this.populateFilterOptions();

            this.render();
        } catch (error) {
            console.error('Error al cargar los Pokémon:', error);
            this.container.innerHTML = '<p class="text-red-500">Error al cargar los Pokémon.</p>';
        }
    }

    // Extraer valores únicos para filtros y llenar los selects
    populateFilterOptions() {
        const types = new Set();
        const abilities = new Set();
        const weaknesses = new Set();

        this.pokemons.forEach(pokemon => {
            pokemon.type.forEach(t => types.add(t));
            pokemon.abilities.forEach(ab => abilities.add(ab));
            pokemon.weakness.forEach(wk => weaknesses.add(wk));
        });

        // Llenar el filtro de tipos
        types.forEach(t => {
            const option = document.createElement('option');
            option.value = t;
            option.textContent = this.capitalize(t);
            this.typeSelect.appendChild(option);
        });

        // Llenar el filtro de habilidades
        abilities.forEach(ab => {
            const option = document.createElement('option');
            option.value = ab;
            option.textContent = ab;
            this.abilitiesSelect.appendChild(option);
        });

        // Llenar el filtro de debilidades
        weaknesses.forEach(wk => {
            const option = document.createElement('option');
            option.value = wk;
            option.textContent = wk;
            this.weaknessesSelect.appendChild(option);
        });
    }

    // Capitalizar la primera letra
    capitalize(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    // Renderizar las tarjetas de Pokémon con paginación
    render() {
        // Limpiar contenedor
        this.container.innerHTML = '';

        if (this.filteredPokemons.length === 0) {
            this.container.innerHTML = '<p class="text-center col-span-full">No se encontraron Pokémon.</p>';
            this.paginationContainer.innerHTML = ''; // Limpiar paginación
            return;
        }

        // Calcular índices de los Pokémon a mostrar en la página actual
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedPokemons = this.filteredPokemons.slice(startIndex, endIndex);

        // Crear y agregar tarjetas de Pokémon
        paginatedPokemons.forEach(pokemon => {
            const card = pokemon.createCard();
            this.container.appendChild(card);
        });

        // Renderizar controles de paginación
        this.renderPagination();
    }

    // Método para renderizar los controles de paginación con número limitado y responsivo
    renderPagination() {
        this.paginationContainer.innerHTML = ''; // Limpiar controles anteriores

        const totalPages = Math.ceil(this.filteredPokemons.length / this.itemsPerPage);
        if (totalPages <= 1) return; // No hay necesidad de paginación

        // Definir el número máximo de botones de página a mostrar basado en el ancho de la ventana
        let maxPageButtons;
        const screenWidth = window.innerWidth;

        if (screenWidth >= 1024) { // Pantallas grandes (desktops)
            maxPageButtons = 7;
        } else if (screenWidth >= 768) { // Pantallas medianas (tablets)
            maxPageButtons = 5;
        } else { // Pantallas pequeñas (móviles)
            maxPageButtons = 3;
        }

        // Calcular el rango de páginas a mostrar alrededor de la página actual
        let startPage = Math.max(this.currentPage - Math.floor(maxPageButtons / 2), 1);
        let endPage = startPage + maxPageButtons - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(endPage - maxPageButtons + 1, 1);
        }

        // Crear botón "Anterior"
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.disabled = this.currentPage === 1;
        prevButton.className = 'px-3 py-1 mr-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50';
        prevButton.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.render();
            }
        });
        this.paginationContainer.appendChild(prevButton);

        // Crear botón de la primera página y puntos suspensivos si es necesario
        if (startPage > 1) {
            const firstPageButton = document.createElement('button');
            firstPageButton.textContent = '1';
            firstPageButton.className = `px-3 py-1 mr-2 rounded ${1 === this.currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`;
            firstPageButton.addEventListener('click', () => {
                this.currentPage = 1;
                this.render();
            });
            this.paginationContainer.appendChild(firstPageButton);

            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'px-3 py-1 mr-2';
                this.paginationContainer.appendChild(ellipsis);
            }
        }

        // Crear botones de página dentro del rango
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = `px-3 py-1 mr-2 rounded ${i === this.currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`;
            pageButton.addEventListener('click', () => {
                this.currentPage = i;
                this.render();
            });
            this.paginationContainer.appendChild(pageButton);
        }

        // Crear botón de la última página y puntos suspensivos si es necesario
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'px-3 py-1 mr-2';
                this.paginationContainer.appendChild(ellipsis);
            }

            const lastPageButton = document.createElement('button');
            lastPageButton.textContent = totalPages;
            lastPageButton.className = `px-3 py-1 mr-2 rounded ${totalPages === this.currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`;
            lastPageButton.addEventListener('click', () => {
                this.currentPage = totalPages;
                this.render();
            });
            this.paginationContainer.appendChild(lastPageButton);
        }

        // Crear botón "Siguiente"
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Siguiente';
        nextButton.disabled = this.currentPage === totalPages;
        nextButton.className = 'px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50';
        nextButton.addEventListener('click', () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.render();
            }
        });
        this.paginationContainer.appendChild(nextButton);
    }

    // Configurar el buscador y filtros
    setupSearch() {
        this.searchInput.addEventListener('input', () => {
            this.applyFilters();
        });

        this.numberInput.addEventListener('input', () => {
            this.applyFilters();
        });
    }

    setupFilterEvents() {
        this.typeSelect.addEventListener('change', () => {
            this.applyFilters();
        });

        this.abilitiesSelect.addEventListener('change', () => {
            this.applyFilters();
        });

        this.weaknessesSelect.addEventListener('change', () => {
            this.applyFilters();
        });
    }

    // Aplicar todos los filtros seleccionados
    applyFilters() {
        const searchQuery = this.searchInput.value.toLowerCase().trim();
        const numberQuery = this.numberInput.value.trim();
        const selectedType = this.typeSelect.value.toLowerCase();
        const selectedAbility = this.abilitiesSelect.value.toLowerCase();
        const selectedWeakness = this.weaknessesSelect.value.toLowerCase();

        this.filteredPokemons = this.pokemons.filter(pokemon => {
            // Filtro por nombre
            const matchesName = pokemon.name.toLowerCase().includes(searchQuery);

            // Filtro por número
            const matchesNumber = numberQuery === '' || pokemon.number === numberQuery.padStart(3, '0');

            // Filtro por tipo
            const matchesType = selectedType === '' || pokemon.type.map(t => t.toLowerCase()).includes(selectedType);

            // Filtro por habilidades
            const matchesAbilities = selectedAbility === '' || pokemon.abilities.map(a => a.toLowerCase()).includes(selectedAbility);

            // Filtro por debilidades
            const matchesWeaknesses = selectedWeakness === '' || pokemon.weakness.map(w => w.toLowerCase()).includes(selectedWeakness);

            return matchesName && matchesNumber && matchesType && matchesAbilities && matchesWeaknesses;
        });

        // Resetear a la primera página al aplicar nuevos filtros
        this.currentPage = 1;

        this.render();
    }

    // Configurar el cierre del modal
    setupModalClose() {
        const closeModalBtn = document.getElementById('close-modal');
        const modal = document.getElementById('modal');

        closeModalBtn.addEventListener('click', () => {
            Pokemon.closeModal();
        });

        // Cerrar modal al hacer clic fuera del contenido
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                Pokemon.closeModal();
            }
        });

        // Cerrar modal con la tecla Esc
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                Pokemon.closeModal();
            }
        });
    }
}

// Inicializar el Pokédex cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Pokedex();
});