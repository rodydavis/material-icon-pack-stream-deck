const fs = require('fs');
const path = require('path');

function copyIcons(pathToIcons, pathToDestination, metaFile) {
    const icons = [];
    const iconGroups = fs.readdirSync(pathToIcons);
    for (const iconGroup of iconGroups) {
        const iconGroupPath = path.join(pathToIcons, iconGroup);
        const iconNameGroups = fs.readdirSync(iconGroupPath);
        for (const iconNameGroup of iconNameGroups) {
            const iconStyleGroupPath = path.join(iconGroupPath, iconNameGroup);
            const iconPath = path.join(iconStyleGroupPath, 'materialicons', '24px.svg');
            const iconPathAlt = path.join(iconStyleGroupPath, 'materialiconsoutlined', '24px.svg');
            if (fs.existsSync(iconPath)) {
                icons.push({
                    path: iconPath,
                    name: iconNameGroup,
                    group: iconGroup,
                });
            } else if (fs.existsSync(iconPathAlt)) {
                icons.push({
                    path: iconPathAlt,
                    name: iconNameGroup,
                    group: iconGroup,
                });
            }
        }
    }
    for (const icon of icons) {
        console.log('copying icon', icon.name);
        const iconName = icon.name;
        const iconPath = icon.path;
        const destPath = path.join(pathToDestination, `${iconName}.svg`);
        let contents = fs.readFileSync(iconPath).toString();
        contents = contents.replace('width="24">', 'width="24" fill="white">');
        fs.writeFileSync(destPath, contents);
    }
    fs.writeFileSync(metaFile, JSON.stringify(icons.map(icon => ({
        "path": `${icon.name}.svg`,
        "name": icon.name,
        "tags": [
            icon.group
        ]
    })), null, 2));
}

copyIcons(path.join(__dirname, '../third_party/google-material-icons/src'), path.join(__dirname, '../icons'), path.join(__dirname, '../icons.json'));