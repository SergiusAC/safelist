export const stringUtils = {
    
    isBlank(str: string | undefined | null): boolean {
        return !str || str.trim().length <= 0;
    },
    
    isNotBlank(str: string | undefined | null): boolean {
        return !this.isBlank(str);
    },
}