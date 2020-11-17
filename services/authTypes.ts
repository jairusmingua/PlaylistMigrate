//types that lets you formalize authentication
export enum AuthType{
    spotify="spotify",
    youtube="youtube",
    queryString="authType"
}
export enum TokenType{
    spotify="spotify",
    youtube="youtube",
    queryString="tokenType"
}

export interface OAuthType{
    access_token?:String;
    refresh_token?:String;
    token_type?:String;
    scope?:String;
    expires_in?:Number;
    auth_type:AuthType;

}

