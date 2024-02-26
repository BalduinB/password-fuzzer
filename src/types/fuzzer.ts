export interface PasswordFuzzerMethod {
    fuzz(v: string): Array<string>;
}
