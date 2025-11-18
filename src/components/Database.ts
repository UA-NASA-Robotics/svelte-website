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

	async delete(table:string, documentID:string){
		const doc = await this.read(table, documentID);
		if(!doc || !doc._rev) return null; // Document not found or no revision available
		const response = await fetch('http://' + this.url + '/' + table + '/' + documentID + "?rev=" + doc._rev, {
			method: 'DELETE',
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

	async update(table: string, documentID: string, data: any) {
		const doc = await this.read(table, documentID);
		if (!doc || !doc._rev) {
			// Document doesn't exist, create it with the specified ID
			const response = await fetch('http://' + this.url + '/' + table + '/' + documentID, {
				method: 'PUT',
				headers: {
					Authorization: `Basic ${btoa(this.user + ':' + this.password)}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ _id: documentID, ...data })
			});
			return response.ok ? await response.json() : null;
		}
		
		// Document exists, update it
		const response = await fetch('http://' + this.url + '/' + table + '/' + documentID, {
			method: 'PUT',
			headers: {
				Authorization: `Basic ${btoa(this.user + ':' + this.password)}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ ...data, _id: documentID, _rev: doc._rev })
		});

		if (response.ok) {
			return await response.json();
		} else {
			return null;
		}
	}
}
