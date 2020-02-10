class HttpService {

    get(url) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.open('GET', url);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status !== 200)
                        reject(xhr.responseText);

                    resolve(JSON.parse(xhr.responseText));
                }
            };

            xhr.send();
        });
    }
}