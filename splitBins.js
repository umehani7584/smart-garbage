const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// 10 naye bin IDs
const newBinIds = [
    'BIN-001', 'BIN-002', 'BIN-003', 'BIN-004',
    'BIN-005', 'BIN-006', 'BIN-007',
    'BIN-008', 'BIN-009', 'BIN-010'
];

// Purane bins ko naye bins mein map karo
const mapping = {
    'mil-bin01': newBinIds.slice(0, 4),   // BIN-001 to BIN-004
    'mil-bin02': newBinIds.slice(4, 7),   // BIN-005 to BIN-007
    'mil-bin03': newBinIds.slice(7, 10)   // BIN-008 to BIN-010
};

const dataByBin = {
    'mil-bin01': [],
    'mil-bin02': [],
    'mil-bin03': []
};

// CSV file read karo
fs.createReadStream('public/data/bins.csv')
    .pipe(csv())
    .on('data', (row) => {
        const deviceTag = row['Device Tag'];
        if (dataByBin[deviceTag]) {
            dataByBin[deviceTag].push(row);
        }
    })
    .on('end', () => {
        console.log('✅ CSV file loaded!');
        
        const newRows = [];
        
        for (const [oldBin, newBins] of Object.entries(mapping)) {
            const binData = dataByBin[oldBin];
            if (!binData) continue;
            
            newBins.forEach((newBin, idx) => {
                for (let i = idx; i < binData.length; i += newBins.length) {
                    const row = { ...binData[i] };
                    row['Device Tag'] = newBin;
                    newRows.push(row);
                }
            });
        }
        
        console.log(`✅ Total rows: ${newRows.length}`);
        
        // Nayi CSV file likho
        const csvWriter = createCsvWriter({
            path: 'public/data/bins_10_bins.csv',
            header: Object.keys(newRows[0]).map(key => ({ id: key, title: key }))
        });
        
        csvWriter.writeRecords(newRows)
            .then(() => {
                console.log('✅ New file created: public/data/bins_10_bins.csv');
                console.log('🎉 Done! 10 bins ki nayi CSV file ban gayi!');
            });
    });