// Academicos script
let script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/gh/Rediseno-Web-Ingenieria-Civil/Generador-de-Academicos@1.1.0/academicos-script.js";

// File and sheet details
const sheetName = 'Equipo DIC';

// XLSX library
const xlsx = XLSX;

// Process the workbook and generate the main content
function processWorkbook(workbook) {
    const sheet = workbook.Sheets[sheetName];
    let data = xlsx.utils.sheet_to_json(sheet);

    // Filter out rows where all cells are empty
    data = data.filter(row =>
        Object.values(row).some(cell => cell !== null && cell !== '')
    );

    // Get unique values for "Estamento" and "Estado"
    const uniqueEstamento = [...new Set(data.map(row => row.Estamento))];
    const uniqueEstado = [...new Set(data.map(row => row.Estado))];
    console.log(uniqueEstamento);
    console.log(uniqueEstado);

    // Filter data
    data = data.filter(
        row => row.Estamento === 'Docente' && row.Estado === 'Vigente'
    );

    // Trim whitespace from all cells
    data = data.map(row => {
        Object.keys(row).forEach(key => {
            if (typeof row[key] === 'string') {
                row[key] = row[key].trim();
            }
        });
        return row;
    });

    // Column mappings
    const columns = {
        'Nombre': 'nombre',
        'Jerarquía': 'posicion',
        'Correo 1': 'email',
        'Jornada': 'Jornada',
        'Acamicos A-Z': 'az',
        'Url foto magnolia': 'img',
        'Piso/Área': 'Area',
        'LinkedIn': 'lkd',
        'PhD': 'phd',
        'Portafolio Uchile': 'uchile'
    };

    // Rename columns
    data = data.map(row => {
        const newRow = {};
        Object.keys(columns).forEach(oldKey => {
            newRow[columns[oldKey]] = row[oldKey];
        });
        return newRow;
    });

    // Print unique values for "Jornada" and "Area"
    const uniqueJornada = [...new Set(data.map(row => row.Jornada))];
    const uniqueArea = [...new Set(data.map(row => row.Area))];
    console.log(uniqueJornada);
    console.log(uniqueArea);

    // Sort data by "nombre"
    data.sort((a, b) => a.nombre.localeCompare(b.nombre));

    // Extract correct LinkedIn URLs
    data = data.map(row => {
        const match = row.lkd ? row.lkd.match(/https\S+/) : null;
        row.lkd = match ? match[0] : '';
        return row;
    });

    // Replace empty img with default img
    const defaultImg =
        '/dam/jcr:83b29991-c553-4b5a-88a1-c7815e0f9165/Logo%20DIC%20Sin%20foto%20.png';
    data = data.map(row => {
        const imgMatch = row.img
            ? row.img.match(/\s*\/dam\/jcr:\s*(\w[\s\S]+\w)\s*/)
            : null;
        row.img = imgMatch ? `/dam/jcr:${imgMatch[1]}` : defaultImg;
        return row;
    });

    // Fill NaN with default values
    data = data.map(row => {
        row.Area = row.Area || 'Cursos Comunes';
        Object.keys(row).forEach(key => {
            if (row[key] === null || row[key] === undefined) {
                row[key] = '';
            }
        });
        return row;
    });

    console.log(data.slice(0, 5)); // Print first 5 rows
    console.log(`Number of rows: ${data.length}`);

    // Define area names and their corresponding IDs
    const areaNames = {
        'ECG': 'Área Estructuras, Construcción y Geotecnia',
        'RHMA': 'Área Recursos Hídricos y Medio Ambiente',
        'Transporte': 'Área Ingeniería de Transporte',
        'Cursos Comunes': 'Cursos Comunes'
    };

    // Define jornada names and their corresponding IDs
    const jornadaNames = {
        Completa: 'completa',
        Parcial: 'parcial',
        Externo: 'externa'
    };

    function createAcademicosesp(data, jornada, areaId, areaName) {
        const areaIdMap = {
            ECG: 'estructura',
            RHMA: 'hidrica',
            Transporte: 'transporte'
        };
        const academicos = data.filter(
            row => row.Jornada === jornada && row.Area === areaId
        );
        return {
            id: areaIdMap[areaId] || areaId.toLowerCase(),
            name: areaName,
            academicos
        };
    }

    const dicList = [];
    for (const [jornada, jornadaId] of Object.entries(jornadaNames)) {
        const academicosesp = [];
        for (const [areaId, areaName] of Object.entries(areaNames)) {
            console.log(`Creating ${jornada} ${areaId} ${areaName}...`);
            academicosesp.push(createAcademicosesp(data, jornada, areaId, areaName));
        }
        dicList.push({ id: jornadaId, academicosesp });
    }

    // Render the main content
    renderMainContent(dicList);
}

// Handle excel file input
function handleFileInput(event) {
    const file = event.target.files[0];
    if (file) {
        // Configure reader to read and process excel file
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = xlsx.read(data, { type: 'array' });
            processWorkbook(workbook);
        };

        reader.readAsArrayBuffer(file);
    }
}
document
    .getElementById('file-input')
    .addEventListener('change', handleFileInput);

// Function to render academic information
function renderAcademicos(academico) {
    let linkedin_html = ``;
    if (academico.lkd) {
        linkedin_html = `<a href="${academico.lkd}" target="_blank"><img src="/dam/jcr:c02ea606-e99e-4513-8c7e-284428d65ae6" alt="LinkedIn"/></a>`;
    }
    let uchile_html = ``;
    if (academico.uchile) {
        uchile_html = `<a href="${academico.uchile}" target="_blank"><img src="/dam/jcr:675077de-db71-4bf7-871d-3ae30a57cdce" alt="UChile"/></a>`;
    }
    let az_html = `<p class="name-academic">${academico.nombre}</p>`;
    if (academico.az) {
        az_html = `<a class="name-academic" href="${academico.az}" target="_blank">${academico.nombre}</a>`;
    }
    let jornada_html = ``;
    if (academico.Jornada) {
        jornada_html = `<div>${academico.Jornada}</div>`;
        if (["Completa", "Parcial"].includes(academico.Jornada)) {
            jornada_html = `<div>Jornada ${academico.Jornada}</div>`;
        }
        else if (["Externo"].includes(academico.Jornada)) {
            jornada_html = `<div>Jornada Parcial</div>`;
        }        
    }

    return `
                <div class="col-2">
                    <div class="academic">
                        <div class="social-container">
                            <div class="img-container">
                                <img class="photo-academic" src="${academico.img}" alt="${academico.nombre}"/>
                            </div>
                            <div class="social-menu">
                                <div class="social-li" style="display: flex; justify-content: center;">
                                    ${linkedin_html}
                                    ${uchile_html}
                                </div>
                            </div>
                        </div>
                        ${az_html}
                        <div class="position-academic">
                            ${academico.posicion}
                        </div>
                        ${jornada_html}
                        <div class="phd-academic">
                            ${academico.phd}
                        </div>
                        <div class="email-academic">
                            <a href="mailto:${academico.email}" target="_blank">${academico.email}</a>
                        </div>
                    </div>
                </div>
`;
}

// Function to render the main content
function renderMainContent(jornadas) {
    let mainContent = `
    <div class="tab__list" role="tablist">
        <a data-toggle="tab" href="#completa" role="tab">Jornada completa</a>
        <a data-toggle="tab" href="#parcial" role="tab">Jornada parcial</a>
        <a data-toggle="tab" href="#externa" role="tab">Externos</a>
        <a data-toggle="tab" href="#search-academics" role="tab" class="active">Todos</a>
    </div>
    `;

    const jornadas_tabs_html = jornadas.map(jornada => {
        const academicos_jornada = jornada.academicosesp.map(esp => {
            const academicos_esp = esp.academicos.map(academico =>
                renderAcademicos(academico))
                .join('');
            const academicos_esp_html = `
        <h3>${esp.name}</h3>
        <div class="academic-container">
            <div class="row">
                ${academicos_esp}
            </div>
        </div>
            `;
            return academicos_esp_html;
        }).join('');

        const jornada_tab = `
    <div id="${jornada.id}" class="tab__item" role="tabpanel">
${academicos_jornada}
    </div>
        `;

        return jornada_tab;
    }).join('');

    mainContent += jornadas_tabs_html;

    const all_academicos_html = jornadas.map(jornada =>
        jornada.academicosesp.map(esp =>
            esp.academicos.map(academico =>
                renderAcademicos(academico)
            ).join('')
        ).join('')
    ).join('');

    mainContent += `
    <div id="search-academics" class="tab__item active" role="tabpanel">
        <div class="filter-name-academic">
            <input type="text" id="name-academic-filter" placeholder="Buscar por nombre" title="Escribe nombre a buscar" aria-labelledby="buscar-button"/>
            <button id="buscar-button" type="button">Buscar</button>
        </div>
        <div class="academic-container" id="search-academic-container">
            <div class="row" id="search-academic-row">
                ${all_academicos_html}
            </div>
        </div>
    </div>
    `;

    document.querySelector('main').innerHTML = mainContent;
    document.querySelector('main').appendChild(script);

    const style_html = `
<style>
    #academicos-main .social-li a[target="_blank"]:after {
    content: "";
    display: none;
    }
</style>
    `;

    const main_html = `
<main id="academicos-main">
${mainContent}
</main>
    `;
    const script_html = `
<script src="${script.src}"></script>
    `;

    const copyBox = `
<textarea id="copy-box" rows="10" cols="50">
    ${style_html}
    ${main_html}
    ${script_html}
</textarea>
    `;
    document.querySelector('main').insertAdjacentHTML('afterbegin', copyBox);
}