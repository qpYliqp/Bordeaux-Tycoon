export enum ImportanceName {
    E1 = "de portée nationale et internationale",
    E2 = "de portée régionale, métropolitaine et d'agglomération",
    E3 = "de portée intercommunale",
    E4 = "de portée communale",
    E5 = "de quartier et de proximité",
    E99 = "en cours de travaus (en jachère)"
}

export function getImportanceName(id: number | undefined): string {
    const key = "E"+id;
    return ImportanceName[key as keyof typeof ImportanceName] || "";
}