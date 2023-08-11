import {setStorage, getStorage} from "@/composables/storage";
export default ({axios, baseUrl }) => ({

    async login(credentials) {
        const request = await axios.post(`${baseUrl}/jwt-login`, credentials, {
        })
        if (request.status === 200) {
            setStorage('token', request.data.token)
            return request.data
        }
        return null
    },

    async getQuizzes(filters) {
        return await this.getAll('quizzes', filters)
    },
    async getQuiz(id) {
        return await this.getOne('quizzes', id)
    },
    async createQuiz(quiz) {
        return await this.create('quizzes', quiz, {groups: ['question:read','answer:read']})
    },
    async updateQuiz(quiz) {
        return await this.update(quiz, {groups: ['question:read', 'answer:read']})
    },
    async deleteQuiz(id) {
        return await this.delete(id)
    },
    async createQuizAnswer(app) {
        return await this.create('quiz-answers', app)
    },
    async getAll(ep, filters) {
        let page = filters === null || filters.page === undefined ? 1 : filters.page
        const datas = []
        let hasNextPage = true

        do {
            const request = await axios.get(`${baseUrl}/${ep}`, {
                params: {
                    page,
                },
            })

            if (request.status === 200) {
                if (filters === null) return request.data['hydra:member']
                else if (filters.allObjects) datas.push(...request.data['hydra:member'])
                else return request.data
            }

            if (!request.data['hydra:view']['hydra:next']) {
                hasNextPage = false
            }
            page++
        } while (hasNextPage)
        return datas
    },
    async getOne(ep, id, params = null) {
        const request = await axios.get(`${baseUrl}/${ep}/${id}`, {
            headers: {
                'Content-Type': 'application/ld+json',
            },
            params: {
                ...params,
            },
        })
        if (request.status === 200) {
            return request.data
        }
        return []
    },
    async create(ep, data, params = null) {
        const request = await axios.post(`${baseUrl}/${ep}`, data, {
            headers: {
                'Content-Type': 'application/ld+json',
            },
            params: {
                ...params,
            },
        })
        if (request.status === 201) {
            return request.data
        }
    },
    async update(data, params = null) {
        return await axios.put(`${baseUrl}${data['@id']}`, data, {
            headers: {
                'Content-Type': 'application/ld+json',
            },
            params: {
                ...params,
            },
        })
    },
    async delete(id) {
        const request = await axios.delete(`${baseUrl}${id}`, {
            headers: {
                'Content-Type': 'application/ld+json',
            },
        })
        return request.status === 204
    },
})
