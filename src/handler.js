const { nanoid } = require("nanoid")
const books = require("./books")


const addBooksHandler = (request, h) => {
	const {
		name, 
		year, 
		author, 
		summary, 
		publisher, 
		pageCount, 
		readPage, 
		reading
	} = request.payload
	const id = nanoid(16)
	const finished = pageCount === readPage
	const insertedAt = new Date().toISOString()
	const updatedAt = insertedAt
	const newBooks = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished,
		reading, 
		insertedAt, 
		updatedAt
	}

	if(!name) {
		const response = h.response({
			status: "fail",
			message: "Gagal menambahkan buku. Mohon isi nama buku"
		}).code(400)
		return response
	}

	if(readPage > pageCount) {
		const response = h.response({
			status: "fail",
			message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
		}).code(400)
		return response
	}
    
	books.push(newBooks)
	const isSuccess = books.filter((book) => book.id === id).length > 0
	if(isSuccess) {
		const response = h.response({
			status: "success",
			message: "Buku berhasil ditambahkan",
			data: {
				bookId: id 
			}
		}).code(201)
		return response
	}
}

const getAllBooksHandler = (request, h) => {
	const {name, reading, finished} = request.query
	let allBooks = books
	if(name !== undefined) {
		allBooks = allBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
	}
	if(reading !==  undefined) {
		allBooks = allBooks.filter((book) => book.reading === !!Number(reading))
	}
	if(finished !== undefined) {
		allBooks = allBooks.filter((book) => book.finished === !!Number(finished))
	}
	const response = h.response({
		status: "success",
		data: {
			books: allBooks.map((book) => ({
				id: book.id,
				name: book.name,
				publisher: book.publisher
			}))
		}
	}).code(200)
	return response
}
const getBookByIdHandler = (request, h) => {
	const id  = request.params.bookId
	const book = books.filter((b) => b.id === id)[0]

	if(book !== undefined) {
		return {
			status: "success",
			data: {
				book,
			},
		}
	} 

	const response = h.response({
		status: "fail",
		message: "Buku tidak ditemukan",
	}).code(404)
	return response
}
const editBookByIdHandler = (request, h) => {
	const id  = request.params.bookId
	const {
		name, 
		year, 
		author, 
		summary, 
		publisher, 
		pageCount, 
		readPage, 
		reading
	} = request.payload

	const bookIndex = books.findIndex((book) => book.id === id)

	if(bookIndex !== -1) {
		if(!name) {
			const response = h.response({
				status: "fail",
				message: "Gagal memperbarui buku. Mohon isi nama buku"
			}).code(400)
			return response
		}
		if(readPage > pageCount) {
			const response = h.response({
				status: "fail",
				message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
			}).code(400)
			return response
		}
		const finished = readPage === pageCount
		const updatedAt = new Date().toISOString()
		books[bookIndex] = {
			...books[bookIndex],
			name, 
			year, 
			author, 
			summary, 
			publisher, 
			pageCount, 
			readPage, 
			reading,
			finished,
			updatedAt
		}
		const response = h.response({
			status: "success",
			message: "Buku berhasil diperbarui"
		}).code(200)
		return response
	}
	const response = h.response({
		status: "fail",
		message: "Gagal memperbarui buku. Id tidak ditemukan"
	}).code(404)
	return response
}

const deleteBookByIdHandler = (request, h) => {
	const id  = request.params.bookId
    
	const bookIndex = books.findIndex((book) => book.id === id)

	if(bookIndex !== -1) {
		books.splice(bookIndex, 1)
		const response = h.response({
			status: "success",
			message: "Buku berhasil dihapus"
		}).code(200)
		return response
	}
	const response = h.response({
		status: "fail",
		message: "Buku gagal dihapus. Id tidak ditemukan"
	}).code(404)
	return response
}

module.exports = {
	addBooksHandler,
	getAllBooksHandler,
	getBookByIdHandler,
	editBookByIdHandler,
	deleteBookByIdHandler
}
