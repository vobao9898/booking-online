import ICategory from "@interfaces/ICategory";
import CategoryRepository from "@repositories/CategoryRepository";
import { handleResponseError } from "@utils/index";

const CategoryService = {
    getCategories: async (id: number): Promise<ICategory[]> => {
        try {
            const response = await CategoryRepository.getCategories(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
};

export default CategoryService;
