import {Rule} from "./Rule.ts";

export class PasswordStrength implements Rule {
    validate(value: any): boolean {
        const passwordRegex : RegExp =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        return passwordRegex.test(value);
    }

    getDescription(): string {
        return "Le mot de passe doit contenir 8 caractères dont un caractère spécial, un chiffre et une majuscule";
    }
}