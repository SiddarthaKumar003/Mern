import User from "../models/user.model.js"

const checkPermission = async(userId)=>{
    const user = User.findById(userId)

    if(user.role !== 'ADMIN')
        return false;
    return true;
}

export default checkPermission