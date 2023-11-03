export class Database {
	url: string;
	user: string;
	password: string;

	constructor(url: string, user: string, password: string) {
		this.url = url;
		this.user = user;
		this.password = password;
	}

	async read(table: string, documentQuery: string) {
		const response = await fetch('http://' + this.url + '/' + table + '/' + documentQuery, {
			method: 'GET',
			headers: {
				Authorization: `Basic ${btoa(this.user + ':' + this.password)}`,
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			return await response.json();
		} else {
			return null;
		}
	}

	async append(table: string, data: any) {
		const response = await fetch('http://' + this.url + '/' + table, {
			method: 'POST',
			headers: {
				Authorization: `Basic ${btoa(this.user + ':' + this.password)}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if (response.ok) {
			return await response.json();
		} else {
			return null;
		}
	}
}
