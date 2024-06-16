export default async function fetchData(filename, action, form = null) {
    let ip = `192.168.1.9`;
    const SERVER_URL = `http://${ip}/coffeeshop/api/`;
    const OPTIONS = {
        method: form ? 'POST' : 'GET',
        ...(form && { body: form })
    };

    try {
        const PATH = new URL(SERVER_URL + filename);
        PATH.searchParams.append('action', action);
        const RESPONSE = await fetch(PATH.href, OPTIONS);

        if (!RESPONSE.ok) {
            throw new Error(`HTTP error! status: ${RESPONSE.status}`);
        }

        const DATA = await RESPONSE.json();
        console.log('RESPONSE', DATA);
        return DATA;

    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};
