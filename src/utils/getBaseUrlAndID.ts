const getBaseUrlAndID = (url: string) => {
    
    const normalizedUrl = url.endsWith('/') ? url.slice(0, -1) : url;

    const parts = normalizedUrl.split('/');
    const baseUrl = parts.slice(0, 3).join('/'); 
    const id = parts[3] || undefined;

    return { baseUrl, id };
}

export default getBaseUrlAndID;