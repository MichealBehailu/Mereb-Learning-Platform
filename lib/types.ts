 //created for typesafety //to be used like in action.ts(create couurse)

export type ApiResponse = {
    status : "success" | "error"
    message : string
}