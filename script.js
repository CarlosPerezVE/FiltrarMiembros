document.getElementById('csvForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const fileInput = document.getElementById('csvFile');
    const levelSelect = document.getElementById('levelSelect');
    const selectedLevel = levelSelect.value;

    if (!fileInput.files.length || !selectedLevel) {
        alert('Por favor, sube un archivo y selecciona un nivel.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const csvData = event.target.result;
        const rows = csvData.split('\n').map(row => row.split(','));
        const headers = rows[0];
        const levelIndex = headers.indexOf("Nivel actual");
        const memberIndex = headers.indexOf("Miembro");

        if (levelIndex === -1 || memberIndex === -1) {
            alert('El archivo CSV no tiene las columnas esperadas.');
            return;
        }

        const filteredMembers = rows
            .slice(1) // Exclude headers
            .filter(row => row[levelIndex]?.trim() === selectedLevel)
            .map(row => row[memberIndex]?.trim());

        if (filteredMembers.length === 0) {
            alert('No se encontraron usuarios para este nivel.');
            return;
        }

        const txtContent = filteredMembers.join('\n');
        const blob = new Blob([txtContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = url;
        downloadLink.download = `${selectedLevel}_usuarios.txt`;
        downloadLink.style.display = 'inline';
        downloadLink.textContent = 'Haz clic aquí para descargar el archivo';
    };

    reader.readAsText(file);
});

document.getElementById('csvFile').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const csvData = event.target.result;
        const rows = csvData.split('\n').map(row => row.split(','));
        const headers = rows[0];
        const levelIndex = headers.indexOf("Nivel actual");

        if (levelIndex === -1) {
            alert('El archivo CSV no tiene una columna "Nivel actual".');
            return;
        }

        const levels = Array.from(
            new Set(rows.slice(1).map(row => row[levelIndex]?.trim()).filter(Boolean))
        );

        const levelSelect = document.getElementById('levelSelect');
        levelSelect.innerHTML = '<option value="" disabled selected>Selecciona un nivel</option>';

        levels.forEach(level => {
            const option = document.createElement('option');
            option.value = level;
            option.textContent = level;
            levelSelect.appendChild(option);
        });
    };

    reader.readAsText(file);
});
