export const handleDate = (data) =>{
    let date = new Date(data)
    let finalDate = date.toUTCString();
    finalDate =  finalDate.split(" ");
    return ` ${finalDate[2]} ${finalDate[1]}, ${finalDate[3]}`
}