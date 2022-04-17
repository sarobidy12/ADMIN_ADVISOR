import Api from '../Api';

interface IParamIE {
    id: string;
    filter: any
}

export const exportPdf: (data: IParamIE) => Promise<any> = (data) =>
    Api.post('/exportImport', {
        ...data
    });


export const importJSON: (data: any) => Promise<any> = (data) =>
    Api.post('/exportImport/import', {
        ...data
    });

export const importJSONRestaurant: (data: any) => Promise<any> = (data) =>
    Api.post('/exportImport/import/restaurant', data)

export const exportJsonRestaurant: () => Promise<any> = () =>
    Api.get('/exportImport/export/restaurant')
