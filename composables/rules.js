export function emailRule(value) {
    const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return  regex.test(value) || "L'adresse email n'est pas valide !";
}

export function textRule(value) {
    return  !!value || 'Le champ ne doit pas être vide !'
}
