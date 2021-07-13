export function secondDifference(timestamp: Date):Number{
    return (Date.now() - timestamp.getTime())/1000
}