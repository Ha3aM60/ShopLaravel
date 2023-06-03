export interface ILogin {
    email: string,
    password: string
}

export interface ILoginResult {
    access_token: string
}

export interface IUser {
    email: string,
    name: string,
    image: string
}