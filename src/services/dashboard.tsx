import Api from '../Api'
// import Command from '../models/Command.model';

export const getDashboard = async (id:any) => {

    try {
        const res = await Api.get(`/dashboard/${id}`);
        if (res.status === 200) {
            return res.data;
        } else {
            return Promise.reject(res.data);
        }
    } catch (err) {
        return Promise.reject(err);
    }
    
};
