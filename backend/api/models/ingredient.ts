import { Commodity } from "./commodity";
import { Measure } from "./measure";

export class Ingredient{
    commodity?: Commodity;
    measure?: Measure;
    quantity?: number;
}