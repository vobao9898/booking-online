import axiosClient from "@api/axiosClient";
import ICategory from "@interfaces/ICategory";

const CategoryRepository = {
    getCategories: (id: number): Promise<ICategory[]> => {
        return new Promise((resolve, reject) => {
            axiosClient.get(`/category/getbymerchant/${id}`).then(
                (resp: any) => {
                    resolve(resp.data);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },
};

export default CategoryRepository;
