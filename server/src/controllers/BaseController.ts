export class BaseController {

    protected getKeys(results: unknown): string[] {
        return Object.keys(results as object);
    }
    
    protected getValues(results: unknown): string[] {
        return Object.values(results as object);
    }
}