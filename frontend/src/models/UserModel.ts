class UserModel {
  public _id: string = ''
  public firstName: string = ''
  public lastName: string = ''
  public email: string = ''
  public role: 'user' | 'admin' = 'user'
}

export default UserModel
