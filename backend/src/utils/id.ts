// MySQL primary keys are auto-increment integers, unlike Mongo's ObjectId.
export function isValidId(id: string): boolean {
    return /^\d+$/.test(id)
}
