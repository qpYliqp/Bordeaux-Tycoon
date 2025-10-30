export function formatNumberWithSpace(str : number | undefined) : string
{
    if(str == undefined)
    {
        return ""
    }
    else
    {
        return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    
}