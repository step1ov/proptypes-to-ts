const typesMap : Record<string, string> = {
    string: 'string',
    number: 'number',
    bool: 'boolean',
    func: '() => void',
    any: 'any',
    array: 'any[]',
    'instanceOf(Date)': 'Date'
}

const reservedTypes : Record<string, string> = {
    theme: "Record<string, string>",
    style: "ViewStyle",
    navigation: "NavigationProp<any, any>"
}

const Convert = (code: string, isInterface: boolean): string => {
    let result = '';
    if (code){
        const codeClear = code.replace((/ |\r\n|\n|\r/gm),"");
        const parts = codeClear.split("=");
        if (parts.length === 2) {

            let name = parts[0].replace('.propTypes', '') + "Props";
            let body = parts[1]
                .replace(/\{|}|PropTypes.|;/gm, '')
                .replace(/,(?=[^()]*\))/g, ';');
            result = `${isInterface ? "export interface" : "type"} ${name} ${isInterface ? '' : '= '}{\n`

            const elems = body.split(',').filter(x => x);

            for (let i = 0; i < elems.length; i++) {
                let elem = elems[i];

                let isRequired = false;
                if (elem.includes('.isRequired')){
                    isRequired = true;
                    elem = elem.replace('.isRequired', '');
                }

                if (elem.includes(':')) {
                    const elemParts = elem.split(':');
                    let elemName = elemParts[0];
                    let elemType = elemParts[1];

                    result += '\t' + elemName;
                    if (!isRequired) result += '?';
                    result += ': ';

                    if (elemType.includes('oneOfType')){
                        elemType = elemType
                            .replace(/oneOfType|\(\[|]\)/gm, '')
                            .split(';')
                            .map(x => typesMap[x] ? typesMap[x] : 'any')
                            .join(' | ');
                    } else {
                        elemType = typesMap[elemType] ? typesMap[elemType] : 'any';
                    }

                    if (elemName === "children" && elemType !== "string") {
                        elemType = "ReactNode";
                    } else if (reservedTypes[elemName]) {
                        elemType = reservedTypes[elemName];
                    }

                    result += elemType;
                    if (i < elems.length - 1) {
                        result += ',';
                    }
                    result += '\n';
                }
            }

            result += '}'
        }
    }
    return result;
}

export default Convert;
