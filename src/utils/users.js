const users=[]

// addUser, removeUser, getUser,getUsersInRoom

const addUser=({id,username,room})=>{
username=username.trim().toLowerCase()

room=room.trim().toLowerCase()
if(!username||!room){
    return {
        error:'User name and room are required'
    }
}

const existingUser=users.find(user=>user.room===room&&user.username===username);
if(existingUser){
    return {
        error:'Username is in use'
    }
}
const user={username,room,id,initials:getUserInitials(username)}
users.push(user);
return {user}
}


const removeUser=(id)=>{
    const userIndex=users.findIndex(user=>user.id===id)

    if(userIndex!==-1){
        return users.splice(userIndex,1)[0];
    }
}


const getUser=(id)=>{
    const user=users.find(user=>user.id===id)
    return user;
}


const getUsersInRoom=(room)=>{
    return users.filter(user=>room&&user.room==room.trim().toLowerCase());
}


const getUserInitials=(name)=>{
let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

let initials = [...name.matchAll(rgx)] || [];

initials = (
  (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
).toUpperCase();

return initials}

module.exports={addUser,removeUser,getUser,getUsersInRoom,getUserInitials}