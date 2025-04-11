export function IsUsernameValid(username: string){
    const regex = /^[a-zA-Z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ]{4,16}$/;
    return regex.test(username);
}

export function IsEmailValid(email: string){
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
}

export function IsPasswordValid(password: string){
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

export function IsCommentValid(comment: string){
    const regex = /^(?=.*\S)[a-zA-Z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ\s.,!?;:'"()-]{1,}$/;
    return regex.test(comment);
}

export function IsRecipeNameValid(recipeName: string){
    const regex = /^(?=.*\S)[a-zA-Z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ\s.,!?;:'"()-]{1,64}$/;
    return regex.test(recipeName);
}

export function IsPreparationTimeValid(preparationTime: string){
    const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    return regex.test(preparationTime);
}

export function IsPreparationDescriptionValid(preparationDescription: string){
    const regex = /^(?=.*\S)[a-zA-Z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ\s.,!?;:'"()-]{1,}$/;
    return regex.test(preparationDescription);
}
