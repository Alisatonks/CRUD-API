const getBaseUrlAndID = (url: string) => {
    const baseUrl = url.substring(0, url.lastIndexOf("/") );
    const id = url.split("/")[3];
    return {baseUrl, id}
}

export default getBaseUrlAndID;