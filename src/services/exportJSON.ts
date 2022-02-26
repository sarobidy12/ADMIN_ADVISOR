const exportJSON = (name: string, data: any) => {

    const fileName = name;
    const exportType: any = "json";

    (window as any).exportFromJSON({ data, fileName, exportType })

};

export default exportJSON;