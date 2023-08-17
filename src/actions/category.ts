import { SAVE_CATEGORIES } from "@constants/category";
import ICategory from "@interfaces/ICategory";

const saveCategories = (categories: ICategory[]) => {
    return {
        type: SAVE_CATEGORIES,
        payload: categories,
    };
};

export { saveCategories };
